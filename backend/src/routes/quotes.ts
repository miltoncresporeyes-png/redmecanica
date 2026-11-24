import express from 'express';
import { prisma } from '../db.js';
import { requireAuth as authenticateToken, AuthRequest } from '../middlewares/requireAuth.js';

const router = express.Router();

const QUOTABLE_JOB_STATUSES = ['PENDING', 'SEARCHING', 'QUOTING'];
const MAX_AMOUNT = 100_000_000;

// Numero finito dentro de rango; undefined si no se envio; null si es invalido
const parseAmount = (v: unknown, { min = 0 }: { min?: number } = {}): number | undefined | null => {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > MAX_AMOUNT) return null;
  return n;
};


// Datos del prestador que puede ver un cliente. NUNCA incluir rut, documentos (idDocumentUrl, backgroundCheckUrl),
// ni la cuenta de usuario completa.
const PUBLIC_PROVIDER_SELECT = {
  id: true,
  type: true,
  businessName: true,
  experience: true,
  rating: true,
  completedJobs: true,
  commune: true,
  region: true,
  phone: true,
  status: true,
  user: { select: { name: true } },
} as const;

// Solo prestadores publicados (ACTIVE) o verificados (APPROVED) pueden cotizar
const canQuote = (status?: string | null) => status === 'ACTIVE' || status === 'APPROVED';

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken as any);

// POST /api/quotes - Crear una nueva cotización (Solo Prestadores)
router.post('/', async (req: any, res) => {
  try {
    const {
      jobId,
      preliminaryDiagnosis,
      serviceItems,
      laborCost,
      partsCost,
      totalCost,
      estimatedDuration,
      warranty,
      paymentMethods,
      validUntil
    } = req.body;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    // Verificar si el usuario es un proveedor
    const provider = await prisma.serviceProvider.findFirst({
      where: { userId }
    });

    if (!provider) {
      return res.status(403).json({ error: 'Solo los Prestadores pueden crear cotizaciones' });
    }

    if (!canQuote(provider.status)) {
      return res.status(403).json({ error: 'Completa y publica tu vitrina para poder cotizar solicitudes.' });
    }

    // Validaciones
    if (!jobId) {
      return res.status(400).json({ error: 'Falta la solicitud a cotizar (jobId)' });
    }
    const total = parseAmount(totalCost, { min: 1 });
    const labor = parseAmount(laborCost);
    const parts = parseAmount(partsCost);
    if (total === undefined || total === null) {
      return res.status(400).json({ error: 'El valor total debe ser un monto mayor a 0' });
    }
    if (labor === null || parts === null) {
      return res.status(400).json({ error: 'Los montos de mano de obra y repuestos no son válidos' });
    }
    const duration = estimatedDuration === undefined || estimatedDuration === '' ? 60 : Number(estimatedDuration);
    if (!Number.isInteger(duration) || duration < 1 || duration > 60 * 24 * 30) {
      return res.status(400).json({ error: 'La duración estimada no es válida' });
    }

    // Verificar si el job existe y está en estado válido
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job no encontrado' });
    if (!QUOTABLE_JOB_STATUSES.includes(job.status)) {
      return res.status(400).json({ error: 'Esta solicitud ya no recibe cotizaciones' });
    }
    // Un prestador no puede cotizar una solicitud que el mismo creo (inflaria sus trabajos y calificaciones).
    if (job.customerId === userId || job.customerId === provider.userId) {
      return res.status(403).json({ error: 'No puedes cotizar tu propia solicitud' });
    }

    // Verificar si ya existe una cotización de este proveedor para este job
    const existingQuote = await prisma.quote.findFirst({
      where: { jobId, providerId: provider.id }
    });

    if (existingQuote) {
      return res.status(400).json({ error: 'Ya has enviado una cotización para este trabajo' });
    }

    const quote = await prisma.quote.create({
      data: {
        jobId,
        providerId: provider.id,
        preliminaryDiagnosis: typeof preliminaryDiagnosis === 'string' ? preliminaryDiagnosis.trim().slice(0, 2000) : '',
        serviceItems: JSON.stringify(serviceItems || []),
        laborCost: labor ?? 0,
        partsCost: parts ?? 0,
        totalCost: total,
        estimatedDuration: duration,
        warranty: typeof warranty === 'string' && warranty.trim() ? warranty.trim().slice(0, 200) : 'Sin garantía',
        paymentMethods: paymentMethods || 'CASH',
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs por defecto
        status: 'SENT'
      }
    });

    // Actualizar estado del job a QUOTING si no lo está
    if (job.status === 'SEARCHING' || job.status === 'PENDING') {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: 'QUOTING', quotedAt: new Date() }
      });
    }

    return res.status(201).json(quote);
  } catch (error) {
    console.error('Error creating quote:', error);
    return res.status(500).json({ error: 'Error al crear cotización' });
  }
});

// GET /api/quotes/provider/me - Obtener todas las cotizaciones enviadas por el proveedor actual
router.get('/provider/me', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const provider = await prisma.serviceProvider.findFirst({ where: { userId } });
    if (!provider) return res.status(403).json({ error: 'Usuario no es proveedor' });

    const quotes = await prisma.quote.findMany({
      where: { providerId: provider.id },
      include: {
        job: {
          include: {
            request: {
              include: {
                vehicle: true,
                service: true,
                user: { select: { name: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(quotes);
  } catch (error) {
    console.error('Error fetching provider quotes:', error);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
});

// GET /api/quotes/user/me - Obtener todas las cotizaciones recibidas por el cliente actual
router.get('/user/me', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const quotes = await prisma.quote.findMany({
      where: {
        job: {
          request: {
            userId: userId
          }
        }
      },
      include: {
        job: {
          include: {
            request: {
              include: {
                vehicle: true,
                service: true
              }
            }
          }
        },
        provider: { select: PUBLIC_PROVIDER_SELECT }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(quotes);
  } catch (error) {
    console.error('Error fetching user quotes:', error);
    res.status(500).json({ error: 'Error al obtener tus cotizaciones' });
  }
});

// GET /api/quotes/marketplace - Obtener trabajos disponibles para cotizar (Solo Prestadores)
router.get('/marketplace', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const provider = await prisma.serviceProvider.findFirst({ where: { userId } });
    if (!provider) return res.status(403).json({ error: 'Solo Prestadores pueden acceder al marketplace' });
    if (!canQuote(provider.status)) {
      return res.status(403).json({ error: 'Publica tu vitrina para ver y cotizar solicitudes.' });
    }

    // Buscar jobs que estén en estado PENDING o SEARCHING (que necesiten cotización)
    // Y que el proveedor aún no haya cotizado
    const jobs = await prisma.job.findMany({
      where: {
        status: { in: ['PENDING', 'SEARCHING', 'QUOTING'] },
        customerId: { not: userId },
        quotes: {
          none: { providerId: provider.id }
        }
      },
      include: {
        request: {
          include: {
            service: true,
            vehicle: true,
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes disponibles' });
  }
});

// GET /api/quotes/job/:jobId - Obtener todas las cotizaciones de un job
router.get('/job/:jobId', async (req: any, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        request: { select: { userId: true } },
        provider: { select: { userId: true } }
      }
    });

    if (!job) return res.status(404).json({ error: 'Trabajo no encontrado' });

    const isClientOwner = job.customerId === userId || job.request?.userId === userId;
    const isAssignedProvider = job.provider?.userId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    // A provider can view if they submitted a quote for this job
    const providerProfile = await prisma.serviceProvider.findFirst({
      where: { userId }
    });
    const hasSubmittedQuote = providerProfile 
      ? await prisma.quote.findFirst({ where: { jobId, providerId: providerProfile.id } }).then(q => !!q)
      : false;

    if (!isClientOwner && !isAssignedProvider && !isAdmin && !hasSubmittedQuote) {
      return res.status(403).json({ error: 'No tienes permiso para ver las cotizaciones de este trabajo' });
    }

    const quotes = await prisma.quote.findMany({
      where: { jobId },
      include: {
        provider: { select: { ...PUBLIC_PROVIDER_SELECT, user: { select: { name: true, email: true } } } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
});

// GET /api/quotes/:id - Obtener una cotización específica
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        job: true,
        provider: { select: { ...PUBLIC_PROVIDER_SELECT, userId: true, user: { select: { name: true, email: true } } } }
      }
    });

    if (!quote) return res.status(404).json({ error: 'Cotización no encontrada' });

    const isClientOwner = quote.job.customerId === userId;
    const isProviderOwner = quote.provider.userId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isClientOwner && !isProviderOwner && !isAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta cotización' });
    }

    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cotización' });
  }
});

// PUT /api/quotes/:id - Actualizar una cotización (Solo si está en estado SENT)
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    // Verificar propiedad
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
      include: { provider: true }
    });

    if (!existingQuote) return res.status(404).json({ error: 'Cotización no encontrada' });

    // Verificar que el usuario sea el dueño de la cotización (a través del provider)
    if (existingQuote.provider.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta cotización' });
    }

    if (existingQuote.status !== 'SENT') {
      return res.status(400).json({ error: 'No se puede editar una cotización que ya fue respondida' });
    }

    const {
      preliminaryDiagnosis,
      serviceItems,
      laborCost,
      partsCost,
      totalCost,
      estimatedDuration,
      warranty,
      paymentMethods,
      validUntil
    } = req.body;

    const newTotal = parseAmount(totalCost, { min: 1 });
    const newLabor = parseAmount(laborCost);
    const newParts = parseAmount(partsCost);
    if (newTotal === null || newLabor === null || newParts === null) {
      return res.status(400).json({ error: 'Los montos ingresados no son válidos' });
    }
    if (estimatedDuration !== undefined && (!Number.isInteger(Number(estimatedDuration)) || Number(estimatedDuration) < 1)) {
      return res.status(400).json({ error: 'La duración estimada no es válida' });
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        preliminaryDiagnosis: typeof preliminaryDiagnosis === 'string' ? preliminaryDiagnosis.trim().slice(0, 2000) : undefined,
        serviceItems: serviceItems ? JSON.stringify(serviceItems) : undefined,
        laborCost: newLabor,
        partsCost: newParts,
        totalCost: newTotal,
        estimatedDuration: estimatedDuration !== undefined ? Number(estimatedDuration) : undefined,
        warranty: typeof warranty === 'string' ? warranty.trim().slice(0, 200) || 'Sin garantía' : undefined,
        paymentMethods,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        updatedAt: new Date()
      }
    });

    res.json(updatedQuote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Error al actualizar cotización' });
  }
});

// POST /api/quotes/:id/accept - Aceptar una cotización
router.post('/:id/accept', async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    if (quote.job.customerId !== userId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'No autorizado para aceptar esta cotización' });
    }

    if (quote.status !== 'SENT') {
      return res.status(400).json({ error: 'Esta cotización ya fue respondida o retirada' });
    }
    if (!QUOTABLE_JOB_STATUSES.includes(quote.job.status) && quote.job.status !== 'COMPARING_QUOTES') {
      return res.status(400).json({ error: 'Esta solicitud ya tiene un prestador confirmado' });
    }
    if (quote.validUntil && quote.validUntil.getTime() < Date.now()) {
      return res.status(400).json({ error: 'Esta cotización venció. Pide al prestador que la renueve.' });
    }

    // Actualizar la cotización a ACCEPTED
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        respondedAt: new Date()
      }
    });

    // Rechazar las demás cotizaciones del mismo job
    await prisma.quote.updateMany({
      where: {
        jobId: quote.jobId,
        id: { not: id }
      },
      data: { status: 'REJECTED' }
    });

    // Actualizar el job
    await prisma.job.update({
      where: { id: quote.jobId },
      data: {
        status: 'CONFIRMED',
        selectedQuoteId: id,
        providerId: quote.providerId,
        estimatedCost: quote.totalCost,
        confirmedAt: new Date()
      }
    });

    res.json(updatedQuote);
  } catch (error) {
    console.error('Error accepting quote:', error);
    res.status(500).json({ error: 'Error al aceptar cotización' });
  }
});

// POST /api/quotes/:id/reject - Rechazar una cotización
router.post('/:id/reject', async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    if (quote.job.customerId !== userId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'No autorizado para rechazar esta cotización' });
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status: 'REJECTED',
        respondedAt: new Date()
      }
    });

    res.json(updatedQuote);
  } catch (error) {
    console.error('Error rejecting quote:', error);
    res.status(500).json({ error: 'Error al rechazar cotización' });
  }
});

// DELETE /api/quotes/:id - Eliminar una cotización (solo si no ha sido aceptada)
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { provider: true }
    });

    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    // Verificar propiedad (o admin)
    if (quote.provider.userId !== userId && req.user?.role !== 'ADMIN') {
       return res.status(403).json({ error: 'No autorizado para eliminar esta cotización' });
    }

    if (quote.status === 'ACCEPTED') {
      return res.status(400).json({ error: 'No se puede eliminar una cotización aceptada' });
    }

    await prisma.quote.delete({
      where: { id }
    });

    res.json({ message: 'Cotización eliminada' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Error al eliminar cotización' });
  }
});

export default router;
