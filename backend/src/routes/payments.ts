import express from 'express';
import { prisma } from '../db.js';
import { webpayService } from '../services/webpay.js';

const router = express.Router();

const PLATFORM_FEE_PERCENT = 10;
const WEBPAY_RETURN_URL = process.env.WEBPAY_RETURN_URL || 'https://redmecanica.cl/payment/return';
const WEBPAY_FINAL_URL = process.env.WEBPAY_FINAL_URL || 'https://redmecanica.cl/payment/final';



router.post('/create', async (req, res) => {
  try {
    const { jobId, amount, paymentMethod } = req.body;

    if (!jobId || !amount) {
      return res.status(400).json({ error: 'Job ID y monto son requeridos' });
    }

    // Para demos o pruebas, permitir jobId especial
    const isDemo = jobId === 'demo' || jobId.startsWith('demo-');

    if (!isDemo) {
      const existingJob = await prisma.job.findUnique({
        where: { id: jobId },
        include: { 
          request: { include: { user: true, vehicle: true } }
        }
      });

      if (!existingJob) {
        return res.status(404).json({ error: 'Job no encontrado' });
      }
    }

    if (paymentMethod === 'webpay') {
      const buyOrder = isDemo ? `RM-DEMO-${Date.now()}` : `RM-${jobId}-${Date.now()}`;
      const sessionId = isDemo ? 'demo-session' : 'sessionId';

      const webpayData = await webpayService.createTransaction(
        buyOrder,
        sessionId,
        amount,
        `${WEBPAY_RETURN_URL}?jobId=${jobId}`,
        `${WEBPAY_FINAL_URL}?jobId=${jobId}`
      );

      const paymentOrder = {
        id: `payment-${Date.now()}`,
        jobId,
        amount,
        paymentMethod: 'WEBPAY',
        status: 'PENDING',
        buyOrder,
        token: webpayData.token,
        createdAt: new Date()
      };

      return res.json({
        payment: paymentOrder,
        token: webpayData.token,
        url: webpayData.url,
        message: webpayService.isWebpayConfigured() 
          ? 'Redirigir a Webpay para completar pago'
          : 'Modo simulación - token generado'
      });
    }

    if (!isDemo) {
      const job = await prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        return res.status(404).json({ error: 'Job no encontrado' });
      }
    }

    const paymentOrder = {
      id: `payment-${Date.now()}`,
      jobId,
      amount,
      paymentMethod: paymentMethod || 'TRANSFER',
      status: 'PENDING',
      createdAt: new Date()
    };

    res.json({
      payment: paymentOrder,
      message: `Orden de pago creada. Método: ${paymentMethod || 'TRANSFER'}`
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Error al crear orden de pago' });
  }
});

router.post('/confirm', async (req, res) => {
  try {
    const { jobId, subscriptionId, token, paymentMethod } = req.body;

    if (paymentMethod === 'webpay' && token) {
      const commitResult = await webpayService.commitTransaction(token);

      if (commitResult.responseCode !== 0) {
        return res.status(400).json({ 
          error: 'Pago rechazado',
          code: commitResult.responseCode,
          status: commitResult.status
        });
      }

      // 1. Caso Suscripción
      if (subscriptionId) {
        const subscription = await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            status: 'ACTIVE',
            lastPaymentDate: new Date(),
          }
        });

        await prisma.providerHistory.create({
          data: {
            providerId: subscription.providerId,
            action: 'SUBSCRIPTION_ACTIVATED',
            description: 'Suscripción activada por pago Webpay exitoso',
          }
        });

        return res.json({
          message: 'Suscripción pagada y activada',
          subscription,
          transaction: {
            authorizationCode: commitResult.authorizationCode,
            cardNumber: commitResult.cardDetail.card_number,
            amount: commitResult.amount
          }
        });
      }

      // 2. Caso Job
      if (jobId) {
        const job = await prisma.job.update({
          where: { id: jobId },
          data: {
            paymentStatus: 'HELD',
            status: 'CONFIRMED'
          }
        });

        return res.json({
          message: 'Pago confirmado y retenido en escrow',
          job,
          transaction: {
            authorizationCode: commitResult.authorizationCode,
            cardNumber: commitResult.cardDetail.card_number,
            amount: commitResult.amount
          },
          escrow: {
            amount: commitResult.amount,
            status: 'HELD',
            releaseCondition: 'Cliente debe aprobar el trabajo completado'
          }
        });
      }

      return res.status(400).json({ error: 'Falta identificador (jobId o subscriptionId)' });
    }

    // Flujo normal sin Webpay (Solo Job por ahora para simplificar)
    if (jobId) {
      const job = await prisma.job.update({
        where: { id: jobId },
        data: {
          paymentStatus: 'HELD',
          status: 'CONFIRMED'
        }
      });

      return res.json({
        message: 'Pago confirmado y retenido en escrow',
        job,
        escrow: {
          amount: req.body.amount,
          status: 'HELD',
          releaseCondition: 'Cliente debe aprobar el trabajo completado'
        }
      });
    }

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Error al confirmar pago' });
  }
});

router.post('/release', async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { provider: true }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job no encontrado' });
    }

    if (job.paymentStatus !== 'HELD') {
      return res.status(400).json({ error: 'No hay pago retenido para liberar' });
    }

    if (job.status !== 'DELIVERED' && job.status !== 'REVIEWED') {
      return res.status(400).json({ error: 'El trabajo debe estar completado y entregado' });
    }

    const amount = job.estimatedCost || 0;
    const platformFee = amount * (PLATFORM_FEE_PERCENT / 100);
    const providerPayout = amount - platformFee;

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        paymentStatus: 'RELEASED'
      }
    });

    res.json({
      message: 'Pago liberado al proveedor exitosamente',
      job: updatedJob,
      payout: {
        total: amount,
        platformFee,
        providerAmount: providerPayout,
        currency: 'CLP'
      }
    });
  } catch (error) {
    console.error('Error releasing payment:', error);
    res.status(500).json({ error: 'Error al liberar pago' });
  }
});

router.post('/refund', async (req, res) => {
  try {
    const { jobId, reason, amount, token, authorizationCode } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job no encontrado' });
    }

    if (job.paymentStatus === 'RELEASED') {
      return res.status(400).json({ error: 'El pago ya fue liberado, no se puede reembolsar' });
    }

    if (token && webpayService.isWebpayConfigured()) {
      try {
        await webpayService.refundTransaction(
          token,
          amount || job.estimatedCost || 0,
          authorizationCode || '123456',
          jobId
        );
      } catch (webpayError) {
        console.error('Webpay refund error:', webpayError);
      }
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        paymentStatus: 'REFUNDED',
        status: 'REFUNDED'
      }
    });

    res.json({
      message: 'Reembolso procesado exitosamente',
      job: updatedJob,
      refund: {
        amount: amount || job.estimatedCost || 'total',
        reason
      }
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Error al procesar reembolso' });
  }
});

router.get('/methods', (req, res) => {
  const paymentMethods = [
    {
      id: 'webpay',
      name: 'Webpay Plus',
      description: 'Tarjeta de crédito/débito vía Transbank',
      fee: '2.95% + $100',
      available: true,
      icon: '💳'
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: 'Transferencia directa a cuenta del proveedor',
      fee: 'Sin costo',
      available: true,
      icon: '🏦'
    },
    {
      id: 'cash',
      name: 'Efectivo',
      description: 'Pago en persona al finalizar el servicio',
      fee: 'Sin costo',
      available: true,
      note: 'El pago NO queda en escrow, mayor riesgo para la plataforma',
      icon: '💵'
    }
  ];

  res.json({
    methods: paymentMethods,
    escrowEnabled: ['webpay'],
    recommended: 'webpay'
  });
});

router.get('/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        paymentStatus: true,
        estimatedCost: true,
        status: true
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job no encontrado' });
    }

    res.json({
      jobId: job.id,
      paymentStatus: job.paymentStatus,
      amount: job.estimatedCost,
      jobStatus: job.status
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ error: 'Error al obtener estado del pago' });
  }
});

export default router;
