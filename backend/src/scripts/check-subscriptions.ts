import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";
const forceInsecureTls = process.env.PG_SSL_REJECT_UNAUTHORIZED === 'false';
const requiresSsl = /sslmode=(require|verify-ca|verify-full)/i.test(connectionString);

const pool = new pg.Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ...(requiresSsl || forceInsecureTls
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkSubscriptions() {
  console.log('🤖 Starting automated SaaS subscription expiration audit...');
  const now = new Date();

  try {
    // 1. Obtener todas las suscripciones vencidas que sigan ACTIVAS
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: now
        }
      },
      include: {
        provider: {
          include: {
            user: true
          }
        }
      }
    });

    console.log(`🔍 Found ${expiredSubscriptions.length} expired active subscriptions.`);

    for (const sub of expiredSubscriptions) {
      console.log(`⚠️ Suspending Provider ${sub.providerId} (${sub.provider.user.name}) due to subscription expiry on ${sub.endDate}`);

      // Transacción ACID para asegurar consistencia e impedir cobros fantasmas o inconsistencias
      await prisma.$transaction([
        // A. Actualizar estado de la suscripción
        prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'EXPIRED' }
        }),
        // B. Suspender al proveedor de servicios (Bloqueo de visibilidad automática)
        prisma.serviceProvider.update({
          where: { id: sub.providerId },
          data: { status: 'SUSPENDED' }
        }),
        // C. Registrar en el historial de auditoría del proveedor
        prisma.providerHistory.create({
          data: {
            providerId: sub.providerId,
            action: 'SUBSCRIPTION_EXPIRED',
            description: `Suscripción ${sub.plan} expirada el ${sub.endDate.toLocaleDateString('es-CL')}. Cuenta suspendida temporalmente por morosidad.`,
            metadata: JSON.stringify({
              subscriptionId: sub.id,
              expiredPlan: sub.plan,
              endDate: sub.endDate
            })
          }
        }),
        // D. Registrar log de auditoría global del sistema
        prisma.auditLog.create({
          data: {
            action: 'SUSPEND_PROVIDER_BY_CRON',
            resource: 'ServiceProvider',
            resourceId: sub.providerId,
            oldValue: 'ACTIVE',
            newValue: 'SUSPENDED',
            notes: `Suscripción vencida automáticamente por cron de control diario.`,
            ipAddress: '127.0.0.1',
            userAgent: 'RedMecanica-BillingWorker/1.0'
          } as any
        })
      ]);

      console.log(`✅ Suspensión aplicada con éxito para ${sub.provider.user.name}`);
    }

    console.log('🎉 Subscription audit completed successfully.');
  } catch (error) {
    console.error('❌ Failed to run subscription check cron:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkSubscriptions().catch(async (e) => {
  console.error('❌ Fatal error running check-subscriptions script:', e);
  await prisma.$disconnect();
  await pool.end();
  process.exit(1);
});
