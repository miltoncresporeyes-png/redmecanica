import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth as authenticateToken, AuthRequest } from '../middlewares/requireAuth.js';

const router = Router();

// Productos de expansión territorial disponibles para compra
export const EXPANSION_PRODUCTS = [
  {
    id: 'pack-3-comunas',
    name: 'Pack Territorial +3 Comunas',
    description: 'Recibe solicitudes y aparece en hasta 3 comunas aledañas adicionales',
    blockSize: 3,
    price: 7990,
    currency: 'CLP',
    billingPeriod: 'MONTHLY',
    popular: true,
  },
  {
    id: 'pack-5-comunas',
    name: 'Pack Territorial +5 Comunas',
    description: 'Ideal para talleres con servicio a domicilio o radio ampliado',
    blockSize: 5,
    price: 11990,
    currency: 'CLP',
    billingPeriod: 'MONTHLY',
    popular: false,
  },
  {
    id: 'pack-regional',
    name: 'Pack Regional Ilimitado',
    description: 'Aparece en toda la región metropolitana. Recomendado para grúas y auxilio.',
    blockSize: 52,
    price: 19990,
    currency: 'CLP',
    billingPeriod: 'MONTHLY',
    popular: false,
  },
];

// Obtener catálogo de packs de expansión territorial
router.get('/expansion-products', (_req, res) => {
  res.json(EXPANSION_PRODUCTS);
});

// Todas las siguientes rutas requieren autenticación
router.use(authenticateToken);

// Obtener estado completo de cobertura del proveedor logueado
router.get('/my-coverage', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      include: {
        subscription: true,
        coverages: {
          where: { active: true },
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
        },
        expansions: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!provider) {
      return res.status(404).json({ error: 'Perfil de prestador no encontrado' });
    }

    const planCode = provider.subscription?.plan || 'FREE';
    const planMaxCommunes = provider.subscription?.maxCommunes ?? (planCode === 'FREE' ? 1 : planCode === 'MONTHLY' ? 3 : 10);

    const expansionSlots = provider.expansions.reduce((acc, exp) => acc + exp.blockSize, 0);
    const totalAllowedCommunes = planMaxCommunes + expansionSlots;
    const totalUsedCommunes = provider.coverages.length;

    // Si el prestador tiene una comuna base pero aún no tiene registro en ProviderCoverage, asegurarlo
    let currentCoverages = provider.coverages;
    if (currentCoverages.length === 0 && provider.commune) {
      const baseCov = await prisma.providerCoverage.create({
        data: {
          providerId: provider.id,
          commune: provider.commune,
          region: provider.region || 'Metropolitana de Santiago',
          isPrimary: true,
          source: 'BASE_COMMUNE',
          active: true,
        },
      });
      currentCoverages = [baseCov];
    }

    res.json({
      providerId: provider.id,
      plan: planCode,
      baseCommune: provider.commune,
      planMaxCommunes,
      expansionSlots,
      totalAllowedCommunes,
      totalUsedCommunes: currentCoverages.length,
      isAtLimit: currentCoverages.length >= totalAllowedCommunes,
      coverages: currentCoverages,
      activeExpansions: provider.expansions,
      expansionProducts: EXPANSION_PRODUCTS,
    });
  } catch (error) {
    console.error('Error al obtener cobertura:', error);
    res.status(500).json({ error: 'Error al obtener cobertura territorial' });
  }
});

// Agregar una comuna a la cobertura
router.post('/add-commune', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { commune, region } = req.body;

    if (!commune || typeof commune !== 'string') {
      return res.status(400).json({ error: 'El nombre de la comuna es obligatorio' });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      include: {
        subscription: true,
        coverages: { where: { active: true } },
        expansions: { where: { status: 'ACTIVE' } },
      },
    });

    if (!provider) {
      return res.status(404).json({ error: 'Prestador no encontrado' });
    }

    const planCode = provider.subscription?.plan || 'FREE';
    const planMaxCommunes = provider.subscription?.maxCommunes ?? (planCode === 'FREE' ? 1 : planCode === 'MONTHLY' ? 3 : 10);
    const expansionSlots = provider.expansions.reduce((acc, exp) => acc + exp.blockSize, 0);
    const totalAllowed = planMaxCommunes + expansionSlots;

    const trimmedCommune = commune.trim();

    // Verificar si ya la tiene agregada
    const existing = provider.coverages.find(
      (c) => c.commune.toLowerCase() === trimmedCommune.toLowerCase()
    );
    if (existing) {
      return res.status(400).json({ error: `La comuna ${trimmedCommune} ya está activa en tu cobertura` });
    }

    // Verificar límite
    if (provider.coverages.length >= totalAllowed) {
      return res.status(403).json({
        error: `Has alcanzado el límite de ${totalAllowed} comunas. Adquiere una expansión para sumar más zonas.`,
        code: 'LIMIT_REACHED',
        totalAllowed,
      });
    }

    // Determinar la fuente (PLAN_INCLUDED o EXPANSION_PAID)
    const isPlanSlotAvailable = provider.coverages.length < planMaxCommunes;
    const source = isPlanSlotAvailable ? 'PLAN_INCLUDED' : 'EXPANSION_PAID';

    const newCoverage = await prisma.providerCoverage.create({
      data: {
        providerId: provider.id,
        commune: trimmedCommune,
        region: region || provider.region || 'Metropolitana de Santiago',
        isPrimary: provider.coverages.length === 0,
        source: provider.coverages.length === 0 ? 'BASE_COMMUNE' : source,
        active: true,
      },
    });

    res.json({
      success: true,
      coverage: newCoverage,
      message: `Comuna ${trimmedCommune} agregada con éxito`,
    });
  } catch (error: any) {
    console.error('Error al agregar comuna:', error);
    res.status(500).json({ error: error.message || 'Error al agregar comuna a la cobertura' });
  }
});

// Eliminar una comuna de la cobertura (no se puede eliminar la principal si es la única)
router.delete('/remove-commune/:coverageId', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const coverageId = Array.isArray(req.params.coverageId) ? req.params.coverageId[0] : req.params.coverageId;
    if (!coverageId) {
      return res.status(400).json({ error: 'coverageId requerido' });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
    });

    if (!provider) {
      return res.status(404).json({ error: 'Prestador no encontrado' });
    }

    const coverage = await prisma.providerCoverage.findUnique({
      where: { id: coverageId },
    });

    if (!coverage || coverage.providerId !== provider.id) {
      return res.status(404).json({ error: 'Cobertura no encontrada' });
    }

    if (coverage.isPrimary) {
      return res.status(400).json({
        error: 'No puedes eliminar tu comuna principal. Si cambiaste de taller, actualiza tu dirección en Perfil.',
      });
    }

    await prisma.providerCoverage.delete({
      where: { id: coverageId },
    });

    res.json({ success: true, message: 'Comuna retirada de tu cobertura' });
  } catch (error) {
    console.error('Error al remover comuna:', error);
    res.status(500).json({ error: 'Error al remover comuna de la cobertura' });
  }
});

export default router;
