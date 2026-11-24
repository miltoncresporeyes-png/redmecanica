/**
 * Beneficios de cada plan: UNA sola fuente para la pagina de planes y el panel del prestador.
 * Cada beneficio marcado como disponible esta implementado y es visible para el prestador (ver ProviderAccountPanel:
 * "Lo que incluye tu plan"). Lo que aun no existe se marca `soon` y se muestra como "Próximamente", nunca como incluido.
 */
export type PlanTier = 'FREE' | 'PAID' | 'PREMIUM';

export const tierOf = (plan?: string | null): PlanTier =>
  plan === 'PROFESSIONAL' ? 'PREMIUM' : plan === 'MONTHLY' || plan === 'YEARLY' ? 'PAID' : 'FREE';

export const TIER_LABEL: Record<PlanTier, string> = { FREE: 'Vitrina Gratis', PAID: 'Destacado', PREMIUM: 'Taller Premium' };

export interface Benefit { text: string; included: boolean; soon?: boolean }

export const FREE_BENEFITS: Benefit[] = [
  { text: 'Vitrina pública con tus servicios', included: true },
  { text: 'Apareces en tu comuna base (1 comuna)', included: true },
  { text: 'Contacto directo por WhatsApp', included: true },
  { text: 'Sin comisión por contacto', included: true },
  { text: 'Insignia "Verificado" al subir tus documentos', included: true },
  { text: 'Soporte por email', included: true },
  { text: 'Primeros lugares del directorio', included: false },
  { text: 'Insignia "Destacado" y portada', included: false },
  { text: 'Estadísticas de visitas y contactos', included: false },
];

export const PAID_BENEFITS: Benefit[] = [
  { text: 'Todo lo de Vitrina Gratis', included: true },
  { text: 'Primeros lugares en tu comuna', included: true },
  { text: 'Insignia "Destacado" en tu vitrina y listados', included: true },
  { text: 'Aparece en "Anuncios Destacados" de la portada', included: true },
  { text: 'Hasta 3 comunas de cobertura', included: true },
  { text: 'Estadísticas de visitas y contactos', included: true },
  { text: 'Soporte prioritario por email', included: true },
];

export const PREMIUM_BENEFITS: Benefit[] = [
  { text: 'Todo lo del plan Destacado', included: true },
  { text: 'Insignia "Premium" en tu vitrina y listados', included: true },
  { text: 'Hasta 10 comunas de cobertura', included: true },
  { text: 'Multiusuario (5 cuentas)', included: false, soon: true },
  { text: 'Analytics avanzado', included: false, soon: true },
  { text: 'Gestor de cuenta dedicado', included: false, soon: true },
  { text: 'API para tu sistema', included: false, soon: true },
];

export const COMMUNE_LIMIT: Record<PlanTier, number> = { FREE: 1, PAID: 3, PREMIUM: 10 };
