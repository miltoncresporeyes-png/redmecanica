import type { Prisma } from '@prisma/client';
import { prisma } from '../db.js';

/**
 * Ciclo de vida de un prestador (visibilidad ≠ verificación):
 *
 *   PENDING   cuenta creada, vitrina incompleta (placeholder de /auth/register). No visible.
 *   ACTIVE    vitrina publicada por el prestador. Visible, SIN verificar.
 *   APPROVED  vitrina aprobada por el equipo tras revisar documentos. Visible y VERIFICADA.
 *   PAUSED    el propio prestador oculto su vitrina temporalmente. Puede reanudarla cuando quiera.
 *   SUSPENDED oculta por un administrador (el prestador no puede reanudarla).
 *   UNDER_REVIEW  en revisión manual (si el equipo la marca así). No visible.
 *
 * Reglas:
 *  - Es visible en el directorio quien está ACTIVE o APPROVED.
 *  - Solo APPROVED muestra la insignia "Verificado".
 */
export const VISIBLE_PROVIDER_STATUSES = ['ACTIVE', 'APPROVED'] as const;

export const isProviderVisible = (status?: string | null) =>
  !!status && (VISIBLE_PROVIDER_STATUSES as readonly string[]).includes(status);

export const isProviderVerified = (status?: string | null) => status === 'APPROVED';

/**
 * Cola de revisión del admin: todo lo que requiere atención del equipo.
 *  - PENDING: registros nuevos, completos o incompletos (el admin puede contactarlos).
 *  - UNDER_REVIEW: marcadas expresamente en revisión.
 *  - ACTIVE sin reviewedAt Y con documentos subidos: hay algo que verificar. Las vitrinas gratuitas sin documentos
 *    no entran (no hay nada que revisar y inflarian la cola con cada alta).
 */
export const providerReviewQueueWhere: Prisma.ServiceProviderWhereInput = {
  OR: [
    { status: { in: ['PENDING', 'UNDER_REVIEW'] } },
    {
      status: 'ACTIVE',
      reviewedAt: null,
      OR: [{ idDocumentUrl: { not: null } }, { backgroundCheckUrl: { not: null } }],
    },
  ],
};

/**
 * Un pago/activacion/renovacion de suscripcion solo debe publicar vitrinas que aun no lo estan (PENDING).
 * NUNCA debe tocar APPROVED (perderia la verificacion), SUSPENDED (saltaria la sancion de un administrador),
 * PAUSED (decision del prestador) ni REJECTED.
 */
export const promoteProviderOnPayment = async (providerId: string) => {
  await prisma.serviceProvider.updateMany({
    where: { id: providerId, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
    data: { status: 'ACTIVE' },
  });
};
