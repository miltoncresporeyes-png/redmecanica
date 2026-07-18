import express from 'express';
import { prisma } from '../db.js';
import { webpayService } from '../services/webpay.js';
import { mercadoPagoService } from '../services/mercadopago.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

const PLATFORM_FEE_PERCENT = 12;
const WEBPAY_RETURN_URL = process.env.WEBPAY_RETURN_URL || 'https://redmecanica.cl/payment/return';
const WEBPAY_FINAL_URL = process.env.WEBPAY_FINAL_URL || 'https://redmecanica.cl/payment/final';
const MERCADOPAGO_RETURN_URL = process.env.MERCADOPAGO_RETURN_URL || 'https://redmecanica.cl/payment/return';
const MERCADOPAGO_FINAL_URL = process.env.MERCADOPAGO_FINAL_URL || 'https://redmecanica.cl/payment/final';
const MERCADOPAGO_NOTIFICATION_URL = process.env.MERCADOPAGO_NOTIFICATION_URL || '';

async function createMercadoPagoCheckout(params: {
  jobId: string;
  amount: number;
  title: string;
  description: string;
  payerEmail?: string;
}) {
  return mercadoPagoService.createPreference({
    externalReference: `job-${params.jobId}-${Date.now()}`,
    title: params.title,
    description: params.description,
    amount: params.amount,
    payerEmail: params.payerEmail,
    successUrl: `${MERCADOPAGO_RETURN_URL}?jobId=${params.jobId}`,
    failureUrl: `${MERCADOPAGO_FINAL_URL}?jobId=${params.jobId}&status=failure`,
    pendingUrl: `${MERCADOPAGO_FINAL_URL}?jobId=${params.jobId}&status=pending`,
    notificationUrl: MERCADOPAGO_NOTIFICATION_URL || undefined,
    metadata: {
      jobId: params.jobId,
      amount: params.amount,
    },
  });
}



router.post('/create', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { jobId, amount, paymentMethod } = req.body;
    let existingJob: any = null;

    if (!jobId || !amount) {
      return res.status(400).json({ error: 'Job ID y monto son requeridos' });
    }

    // Para demos o pruebas, permitir jobId especial
    const isDemo = jobId === 'demo' || jobId.startsWith('demo-');

    if (!isDemo) {
      existingJob = await prisma.job.findUnique({
        where: { id: jobId },
        include: { 
          request: { include: { user: true, vehicle: true } }
        }
      });

      if (!existingJob) {
        return res.status(404).json({ error: 'Job no encontrado' });
      }

      if (existingJob.customerId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para pagar por este trabajo' });
      }
    }

    const normalizedPaymentMethod = String(paymentMethod || '').toLowerCase();

    if (normalizedPaymentMethod === 'webpay') {
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

    if (normalizedPaymentMethod === 'mercadopago') {
      if (!mercadoPagoService.isConfigured()) {
        return res.status(503).json({
          error: 'Mercado Pago no está configurado',
          hint: 'Define MERCADOPAGO_ACCESS_TOKEN, MERCADOPAGO_PUBLIC_KEY y las URLs de retorno en el backend'
        });
      }

      const title = isDemo ? 'Servicio RedMecánica' : `Pago de trabajo ${jobId}`;
      const description = isDemo
        ? 'Pago demo para pruebas'
        : `Pago del trabajo ${jobId} en RedMecánica`;

      const payerEmail = isDemo ? undefined : existingJob?.request?.user?.email;

      const preference = await createMercadoPagoCheckout({
        jobId,
        amount,
        title,
        description,
        payerEmail,
      });

      return res.json({
        payment: {
          id: `payment-${Date.now()}`,
          jobId,
          amount,
          paymentMethod: 'MERCADOPAGO',
          status: 'PENDING',
          preferenceId: preference.id,
          createdAt: new Date()
        },
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
        publicKey: mercadoPagoService.getPublicKey(),
        message: 'Redirigir a Mercado Pago para completar el pago'
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

router.post('/webhook/mercadopago', async (req, res) => {
  try {
    const dataId = String(req.query['data.id'] || req.body?.data?.id || req.body?.id || '').trim();
    const requestId = String(req.header('x-request-id') || '').trim();
    const signatureHeader = req.header('x-signature');

    if (!dataId || !requestId || !signatureHeader) {
      return res.status(400).json({ error: 'Webhook incompleto' });
    }

    const isValid = mercadoPagoService.verifyWebhookSignature({
      dataId,
      requestId,
      signatureHeader,
    });

    if (!isValid) {
      return res.status(401).json({ error: 'Firma de webhook inválida' });
    }

    const eventType = String(req.query.type || req.body?.type || '').toLowerCase();
    const resourceType = eventType || String(req.body?.resource || req.body?.topic || '').toLowerCase();
    const resource = await mercadoPagoService.resolveWebhookResource({
      resourceType,
      resourceId: dataId,
    });

    const resourceStatus = String(
      resource?.status || req.body?.status || req.body?.payment_status || req.body?.data?.status || ''
    ).toLowerCase();
    const externalReference = String(
      resource?.external_reference || req.body?.external_reference || req.body?.data?.external_reference || ''
    ).trim();
    const metadata = (resource?.metadata || req.body?.metadata || req.body?.data?.metadata || {}) as Record<string, unknown>;
    const rawAmount = resource?.transaction_amount ?? resource?.total_amount ?? resource?.amount ?? req.body?.transaction_amount ?? req.body?.total_amount;
    const amount = typeof rawAmount === 'number' ? rawAmount : Number(rawAmount || 0);

    const parsedJobId = metadata.jobId
      ? String(metadata.jobId)
      : (() => {
          const match = externalReference.match(/^job-(.+)-\d+$/i);
          return match?.[1] || '';
        })();

    const parsedSubscriptionId = metadata.subscriptionId
      ? String(metadata.subscriptionId)
      : (() => {
          const match = externalReference.match(/^subscription-(.+)$/i);
          return match?.[1] || '';
        })();

    if (resourceStatus === 'approved') {
      if (parsedJobId) {
        const existingJob = await prisma.job.findUnique({
          where: { id: parsedJobId },
          include: { provider: true, customer: true },
        });

        if (existingJob) {
          const updatedJob = await prisma.job.update({
            where: { id: parsedJobId },
            data: {
              paymentStatus: 'HELD',
              status: 'CONFIRMED',
              confirmedAt: existingJob.confirmedAt || new Date(),
            },
          });

          const invoiceExists = await prisma.invoice.findFirst({
            where: {
              type: 'JOB',
              jobId: parsedJobId,
              status: 'PAID',
            },
          });

          if (!invoiceExists) {
            await prisma.invoice.create({
              data: {
                invoiceNumber: `INV-MP-JOB-${dataId}-${Date.now()}`,
                type: 'JOB',
                userId: updatedJob.customerId,
                providerId: updatedJob.providerId,
                jobId: updatedJob.id,
                subtotal: amount || updatedJob.estimatedCost || 0,
                tax: 0,
                total: amount || updatedJob.estimatedCost || 0,
                currency: 'CLP',
                status: 'PAID',
                dueDate: new Date(),
                paidAt: new Date(),
                items: JSON.stringify([
                  {
                    description: 'Pago aprobado vía Mercado Pago - Fondo de Garantía en Custodia',
                    quantity: 1,
                    price: amount || updatedJob.estimatedCost || 0,
                    total: amount || updatedJob.estimatedCost || 0,
                  },
                ]),
                notes: `Webhook aprobado por Mercado Pago. Recurso ${resourceType || 'desconocido'} ${dataId}.`,
              },
            });
          }

          await prisma.jobEvent.create({
            data: {
              jobId: updatedJob.id,
              status: 'CONFIRMED',
              description: 'Pago aprobado y trabajo confirmado por webhook de Mercado Pago',
              metadata: JSON.stringify({
                resourceType,
                dataId,
                requestId,
                amount,
                externalReference,
              }),
            },
          });

          await prisma.providerHistory.create({
            data: {
              providerId: updatedJob.providerId,
              action: 'JOB_CONFIRMED',
              description: 'Trabajo confirmado por pago aprobado en Mercado Pago',
            },
          });
        }
      }

      if (parsedSubscriptionId) {
        const existingSubscription = await prisma.subscription.findUnique({
          where: { id: parsedSubscriptionId },
          include: { provider: true },
        });

        if (existingSubscription) {
          const updatedSubscription = await prisma.subscription.update({
            where: { id: parsedSubscriptionId },
            data: {
              status: 'ACTIVE',
              lastPaymentDate: new Date(),
              provider: {
                update: { status: 'ACTIVE' },
              },
            },
          });

          const invoiceExists = await prisma.invoice.findFirst({
            where: {
              type: 'SUBSCRIPTION',
              subscriptionId: parsedSubscriptionId,
              status: 'PAID',
            },
          });

          if (!invoiceExists) {
            await prisma.invoice.create({
              data: {
                invoiceNumber: `INV-MP-SUB-${dataId}-${Date.now()}`, 
                type: 'SUBSCRIPTION',
                providerId: updatedSubscription.providerId,
                subscriptionId: updatedSubscription.id,
                subtotal: amount || updatedSubscription.amount,
                tax: 0,
                total: amount || updatedSubscription.amount,
                currency: 'CLP',
                status: 'PAID',
                dueDate: new Date(),
                paidAt: new Date(),
                items: JSON.stringify([
                  {
                    description: `Suscripción ${updatedSubscription.plan} pagada vía Mercado Pago`,
                    quantity: 1,
                    price: amount || updatedSubscription.amount,
                    total: amount || updatedSubscription.amount,
                  },
                ]),
                notes: `Webhook aprobado por Mercado Pago. Recurso ${resourceType || 'desconocido'} ${dataId}.`,
              },
            });
          }

          await prisma.providerHistory.create({
            data: {
              providerId: updatedSubscription.providerId,
              action: 'SUBSCRIPTION_ACTIVATED',
              description: 'Suscripción activada por pago aprobado en Mercado Pago',
            },
          });
        }
      }
    }

    return res.status(200).json({
      ok: true,
      received: true,
      eventType,
      dataId,
      resourceStatus,
    });
  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error);
    return res.status(500).json({ error: 'Error procesando webhook de Mercado Pago' });
  }
});

router.post('/confirm', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { jobId, subscriptionId, token, paymentMethod } = req.body;

    // Validation checks
    if (subscriptionId) {
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { provider: true }
      });
      if (!subscription) return res.status(404).json({ error: 'Suscripción no encontrada' });
      if (subscription.provider.userId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para esta suscripción' });
      }
    }

    if (jobId) {
      const existingJob = await prisma.job.findUnique({
        where: { id: jobId }
      });
      if (!existingJob) {
        return res.status(404).json({ error: 'Job no encontrado' });
      }
      if (existingJob.customerId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para confirmar el pago de este trabajo' });
      }
    }

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
            provider: {
              update: {
                status: 'ACTIVE'
              }
            }
          }
        });

        await prisma.providerHistory.create({
          data: {
            providerId: subscription.providerId,
            action: 'SUBSCRIPTION_ACTIVATED',
            description: 'Suscripción activada por pago Webpay exitoso',
          }
        });

        // Generar Factura por Pago de Suscripción
        await prisma.invoice.create({
          data: {
            invoiceNumber: `INV-SUB-${subscription.id.substring(0, 8)}-${Date.now()}`,
            type: 'SUBSCRIPTION',
            providerId: subscription.providerId,
            subscriptionId: subscription.id,
            subtotal: subscription.amount,
            tax: 0,
            total: subscription.amount,
            currency: 'CLP',
            status: 'PAID',
            dueDate: new Date(),
            paidAt: new Date(),
            items: JSON.stringify([
              { 
                description: `Suscripción Mensual - Plan ${subscription.plan}`,
                quantity: 1,
                price: subscription.amount,
                total: subscription.amount
              }
            ]),
            notes: `Pago de suscripción exitoso vía Webpay. Vence el ${subscription.endDate.toLocaleDateString('es-CL')}.`
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
        const existingJob = await prisma.job.findUnique({
          where: { id: jobId }
        });
        if (!existingJob) {
          return res.status(404).json({ error: 'Job no encontrado' });
        }

        const job = await prisma.job.update({
          where: { id: jobId },
          data: {
            paymentStatus: 'HELD',
            status: 'CONFIRMED'
          }
        });

        const amount = commitResult.amount;

        // Crear Factura Relacional de Pago en Escrow
        await prisma.invoice.create({
          data: {
            invoiceNumber: `INV-ESC-${job.id.substring(0, 8)}-${Date.now()}`,
            type: 'JOB',
            userId: job.customerId,
            providerId: job.providerId,
            jobId: job.id,
            subtotal: amount,
            tax: 0,
            total: amount,
            currency: 'CLP',
            status: 'PAID',
            dueDate: new Date(),
            paidAt: new Date(),
            items: JSON.stringify([
              { 
                description: 'Fondo de Garantía en Custodia (Escrow) - Servicio Técnico',
                quantity: 1,
                price: amount,
                total: amount
              }
            ]),
            notes: 'Los fondos han sido retenidos en custodia de RedMecánica. Se liberarán al técnico una vez finalizado y aprobado el trabajo.'
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
      const existingJob = await prisma.job.findUnique({
        where: { id: jobId }
      });
      if (!existingJob) {
        return res.status(404).json({ error: 'Job no encontrado' });
      }

      const job = await prisma.job.update({
        where: { id: jobId },
        data: {
          paymentStatus: 'HELD',
          status: 'CONFIRMED'
        }
      });

      const amount = Number(req.body.amount || existingJob.estimatedCost || 0);

      // Crear Factura Relacional de Pago en Escrow
      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-ESC-${job.id.substring(0, 8)}-${Date.now()}`,
          type: 'JOB',
          userId: job.customerId,
          providerId: job.providerId,
          jobId: job.id,
          subtotal: amount,
          tax: 0,
          total: amount,
          currency: 'CLP',
          status: 'PAID',
          dueDate: new Date(),
          paidAt: new Date(),
          items: JSON.stringify([
            { 
              description: 'Fondo de Garantía en Custodia (Escrow) - Servicio Técnico (Simulado)',
              quantity: 1,
              price: amount,
              total: amount
            }
          ]),
          notes: 'Los fondos simulados han sido retenidos en custodia de RedMecánica. Se liberarán al técnico una vez finalizado y aprobado el trabajo.'
        }
      });

      return res.json({
        message: 'Pago confirmado y retenido en escrow',
        job,
        escrow: {
          amount,
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

router.post('/release', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { provider: true }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job no encontrado' });
    }

    if (job.customerId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado: Solo el cliente o un administrador pueden liberar el pago' });
    }

    if (job.paymentStatus !== 'HELD') {
      return res.status(400).json({ error: 'No hay pago retenido para liberar' });
    }

    if (job.status !== 'DELIVERED' && job.status !== 'REVIEWED' && job.status !== 'WORK_COMPLETED' && job.status !== 'CLOSED') {
      return res.status(400).json({ error: 'El trabajo debe estar completado y entregado' });
    }

    const amount = job.estimatedCost || 0;
    const platformFee = amount * (PLATFORM_FEE_PERCENT / 100);
    const providerPayout = amount - platformFee;

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        paymentStatus: 'RELEASED',
        status: 'CLOSED'
      }
    });

    // Crear Factura al Proveedor por Cobro de Comisión de Plataforma
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-COM-${job.id.substring(0, 8)}-${Date.now()}`,
        type: 'JOB',
        userId: job.customerId,
        providerId: job.providerId,
        jobId: job.id,
        subtotal: platformFee,
        tax: 0,
        total: platformFee,
        currency: 'CLP',
        status: 'PAID',
        dueDate: new Date(),
        paidAt: new Date(),
        items: JSON.stringify([
          { 
            description: `Comisión de Intermediación RedMecánica (Take-rate ${PLATFORM_FEE_PERCENT}%)`,
            quantity: 1,
            price: platformFee,
            total: platformFee
          }
        ]),
        notes: `Cobro de comisión del 12% retenida del pago total de $${amount.toLocaleString('es-CL')} CLP. Monto neto transferido al mecánico: $${providerPayout.toLocaleString('es-CL')} CLP.`
      }
    });

    // Registrar en el historial del prestador
    await prisma.providerHistory.create({
      data: {
        providerId: job.providerId,
        action: 'JOB_COMPLETED',
        description: `Servicio finalizado. Pago liberado: $${providerPayout.toLocaleString('es-CL')} CLP (Comisión $${platformFee.toLocaleString('es-CL')} CLP retenida).`
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

router.post('/refund', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { jobId, reason, amount, token, authorizationCode } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job no encontrado' });
    }

    if (job.customerId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado: No autorizado para procesar reembolsos' });
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

router.get('/status/:jobId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: jobId as string },
      select: {
        id: true,
        paymentStatus: true,
        estimatedCost: true,
        status: true,
        customerId: true,
        providerId: true
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job no encontrado' });
    }

    const providerProfile = await prisma.serviceProvider.findFirst({
      where: { userId: req.user?.id }
    });

    const isClientOwner = job.customerId === req.user?.id;
    const isProviderOwner = job.providerId === providerProfile?.id;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';

    if (!isClientOwner && !isProviderOwner && !isAdmin) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes acceso a este trabajo' });
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
