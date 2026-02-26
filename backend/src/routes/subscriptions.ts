import { Router } from 'express';
import { prisma } from '../db.js';
import { z } from 'zod';
import { webpayService } from '../services/webpay.js';

const router = Router();

const WEBPAY_RETURN_URL = process.env.WEBPAY_RETURN_URL || 'https://redmecanica.cl/payment/return';
const WEBPAY_FINAL_URL = process.env.WEBPAY_FINAL_URL || 'https://redmecanica.cl/payment/final';

export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'MONTHLY',
    name: 'Plan Mensual',
    price: 15000,
    currency: 'CLP',
    jobsIncluded: 20,
    features: [
      'Hasta 20 trabajos al mes',
      'Perfil verificado',
      'Soporte prioritario',
      'Acceso a dashboard',
    ],
  },
  YEARLY: {
    id: 'YEARLY',
    name: 'Plan Anual',
    price: 150000,
    currency: 'CLP',
    jobsIncluded: 300,
    features: [
      'Hasta 300 trabajos al año',
      'Perfil verificado',
      'Soporte prioritario 24/7',
      'Acceso a dashboard avanzado',
      'Descuento del 17%',
      'Badges exclusivos',
    ],
  },
  PROFESSIONAL: {
    id: 'PROFESSIONAL',
    name: 'Plan Profesional',
    price: 500000,
    currency: 'CLP',
    jobsIncluded: -1,
    features: [
      'Trabajos ilimitados',
      'Perfil verificado + destacado',
      'Soporte dedicado 24/7',
      'Dashboard analytics',
      'API access',
      '优先匹配送位置',
    ],
  },
};

const createSubscriptionSchema = z.object({
  providerId: z.string().uuid('ID de proveedor inválido'),
  plan: z.enum(['MONTHLY', 'YEARLY', 'PROFESSIONAL']),
  paymentMethod: z.enum(['WEBPAY', 'TRANSFER']).default('WEBPAY'),
  autoRenew: z.boolean().optional().default(true),
});

const updateSubscriptionSchema = z.object({
  plan: z.enum(['MONTHLY', 'YEARLY', 'PROFESSIONAL']).optional(),
  autoRenew: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'CANCELLED', 'SUSPENDED']).optional(),
});

router.get('/plans', (_req, res) => {
  res.json(SUBSCRIPTION_PLANS);
});

router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { providerId },
      include: {
        provider: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const planDetails = SUBSCRIPTION_PLANS[subscription.plan as keyof typeof SUBSCRIPTION_PLANS];
    
    const completedJobs = await prisma.job.count({
      where: { providerId, status: 'COMPLETED' }
    });

    res.json({
      ...subscription,
      planDetails,
      jobsUsed: completedJobs,
      jobsRemaining: planDetails.jobsIncluded === -1 ? -1 : Math.max(0, planDetails.jobsIncluded - completedJobs),
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = createSubscriptionSchema.parse(req.body);
    const planDetails = SUBSCRIPTION_PLANS[data.plan];

    const existingSubscription = await prisma.subscription.findUnique({
      where: { providerId: data.providerId }
    });

    if (existingSubscription) {
      // If pending, they might be retrying payment. Delete and recreate or just fail? We will fail to keep it simple, or update it.
      // For now we allow them to recreate if it's PENDING. We just delete the old one.
      if (existingSubscription.status === 'PENDING') {
         await prisma.subscription.delete({ where: { providerId: data.providerId } });
      } else {
         return res.status(400).json({ error: 'Provider already has an active subscription' });
      }
    }

    const startDate = new Date();
    const endDate = new Date();
    if (data.plan === 'MONTHLY') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (data.plan === 'YEARLY') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await prisma.subscription.create({
      data: {
        providerId: data.providerId,
        plan: data.plan,
        status: 'PENDING',
        startDate,
        endDate,
        amount: planDetails.price,
        currency: planDetails.currency,
        autoRenew: data.autoRenew,
        nextBillingDate: data.plan === 'MONTHLY' ? endDate : undefined,
      }
    });

    await prisma.providerHistory.create({
      data: {
        providerId: data.providerId,
        action: 'SUBSCRIPTION_CREATED',
        description: `Suscripción ${planDetails.name} creada - Pendiente de pago`,
      }
    });

    // WEBPAY INTEGRATION
    if (data.paymentMethod === 'WEBPAY') {
      try {
        const sessionId = `sub_${subscription.id.substring(0, 10)}`;
        const orderId = `sub_${Date.now()}`;
        
        const webpayData = await webpayService.createTransaction(
          orderId,
          sessionId,
          planDetails.price,
          `${WEBPAY_RETURN_URL}?subscriptionId=${subscription.id}`,
          `${WEBPAY_FINAL_URL}?subscriptionId=${subscription.id}`
        );
        
        return res.status(201).json({
          subscription,
          planDetails,
          paymentRequired: true,
          payment: {
            method: 'WEBPAY',
            token: webpayData.token,
            url: webpayData.url
          }
        });
      } catch (err) {
        console.error('Webpay error creating subscription:', err);
        return res.status(500).json({ error: 'Failed to initialize Webpay transaction' });
      }
    }

    res.status(201).json({
      subscription,
      planDetails,
      paymentRequired: data.paymentMethod === 'TRANSFER',
      payment: {
        method: data.paymentMethod
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: (error as any).issues });
    }
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateSubscriptionSchema.parse(req.body);

    const subscription = await prisma.subscription.findUnique({
      where: { id: String(id) },
      include: { provider: true }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    if (data.plan && data.plan !== subscription.plan) {
      const planDetails = SUBSCRIPTION_PLANS[data.plan];
      const newEndDate = new Date();
      
      if (data.plan === 'MONTHLY') {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      } else {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: id }, // Asegúrate de que 'id' esté definido
      data: {
        plan: data.plan,
        amount: planDetails.price,
        endDate: newEndDate,
      // En Prisma, si quieres "limpiar" un campo opcional, usa null en lugar de undefined
     nextBillingDate: data.plan === 'MONTHLY' ? newEndDate : null, 
   },
  // Agrega esto si necesitas los datos del proveedor en la respuesta
      include: { 
        provider: true 
   }
  });

      await prisma.providerHistory.create({
        data: {
          providerId: subscription.providerId,
          action: 'PLAN_CHANGED',
          description: `Plan cambiado a ${planDetails.name}`,
        }
      });
    }

    if (data.autoRenew !== undefined) {
      await prisma.subscription.update({
        where: { id },
        data: { autoRenew: data.autoRenew }
      });
    }

    if (data.status) {
      await prisma.subscription.update({
        where: { id },
        data: { status: data.status }
      });

      await prisma.providerHistory.create({
        data: {
          providerId: subscription.providerId,
          action: data.status === 'CANCELLED' ? 'SUBSCRIPTION_CANCELLED' : 'SUBSCRIPTION_SUSPENDED',
          description: data.status === 'CANCELLED' ? 'Suscripción cancelada' : 'Suscripción suspendida',
        }
      });
    }

    const updated = await prisma.subscription.findUnique({ where: { id } });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: (error as any).issues });
    }
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

router.post('/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.update({
      where: { id },
      data: { status: 'ACTIVE' },
      include: { provider: true }
    });

    await prisma.providerHistory.create({
      data: {
        providerId: subscription.providerId,
        action: 'SUBSCRIPTION_ACTIVATED',
        description: 'Suscripción activada exitosamente',
      }
    });

    res.json(subscription);
  } catch (error) {
    console.error('Error activating subscription:', error);
    res.status(500).json({ error: 'Failed to activate subscription' });
  }
});

router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        autoRenew: false 
      },
      include: { provider: true }
    });

    await prisma.providerHistory.create({
      data: {
        providerId: subscription.providerId,
        action: 'SUBSCRIPTION_CANCELLED',
        description: 'Suscripción cancelada por el usuario',
      }
    });

    res.json(subscription);
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

router.post('/:id/renew', async (req, res) => {
  try {
    const { id } = req.params;

    const current = await prisma.subscription.findUnique({ where: { id } });
    if (!current) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const planDetails = SUBSCRIPTION_PLANS[current.plan as keyof typeof SUBSCRIPTION_PLANS];
    const newEndDate = new Date(current.endDate);
    
    if (current.plan === 'MONTHLY') {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        startDate: current.endDate,
        endDate: newEndDate,
        lastPaymentDate: new Date(),
        nextBillingDate: current.plan === 'MONTHLY' ? newEndDate : undefined,
      },
      include: { provider: true }
    });

    await prisma.providerHistory.create({
      data: {
        providerId: subscription.providerId,
        action: 'SUBSCRIPTION_RENEWAL',
        description: `Suscripción renovada hasta ${newEndDate.toLocaleDateString()}`,
      }
    });

    res.json(subscription);
  } catch (error) {
    console.error('Error renewing subscription:', error);
    res.status(500).json({ error: 'Failed to renew subscription' });
  }
});

export default router;
