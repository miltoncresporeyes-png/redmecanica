/**
 * Plan efectivo de un prestador. Un plan de pago solo cuenta si su suscripcion esta ACTIVA y no ha vencido;
 * de lo contrario el prestador se comporta como plan gratuito (posicion, insignia, estadisticas, cobertura).
 */
export interface SubscriptionLike {
  plan?: string | null;
  status?: string | null;
  endDate?: Date | string | null;
}

export type EffectivePlan = 'FREE' | 'MONTHLY' | 'YEARLY' | 'PROFESSIONAL';

export const effectivePlan = (sub?: SubscriptionLike | null): EffectivePlan => {
  if (!sub || sub.status !== 'ACTIVE' || !sub.plan || sub.plan === 'FREE') return 'FREE';
  if (sub.endDate && new Date(sub.endDate).getTime() <= Date.now()) return 'FREE';
  return (['MONTHLY', 'YEARLY', 'PROFESSIONAL'].includes(sub.plan) ? sub.plan : 'FREE') as EffectivePlan;
};

export const isPaidPlan = (sub?: SubscriptionLike | null) => effectivePlan(sub) !== 'FREE';

/** Comunas de cobertura incluidas segun el plan vigente (Gratis 1 · Destacado 3 · Premium 10). */
export const PLAN_COMMUNE_LIMITS: Record<EffectivePlan, number> = { FREE: 1, MONTHLY: 3, YEARLY: 3, PROFESSIONAL: 10 };

/**
 * Cupo de comunas del plan. `maxCommunes` en la suscripcion nace con valor 1 (default de la base) aunque se pague un plan,
 * por eso manda el plan; solo se respeta un valor guardado MAYOR (cupo ampliado a mano por el equipo).
 */
export const planCommuneLimit = (sub?: (SubscriptionLike & { maxCommunes?: number | null }) | null): number =>
  Math.max(PLAN_COMMUNE_LIMITS[effectivePlan(sub)], effectivePlan(sub) === 'FREE' ? 1 : sub?.maxCommunes ?? 0);
