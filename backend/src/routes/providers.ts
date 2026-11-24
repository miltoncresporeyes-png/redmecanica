import { Router } from 'express';
import { prisma } from '../db.js';
import { VISIBLE_PROVIDER_STATUSES, isProviderVisible } from '../lib/providerStatus.js';
import { verifyAccessToken } from '../utils/auth.js';
import { withUtc } from '../lib/pgJson.js';
import { PLATFORM_FEE_PERCENT } from '../config/pricing.js';
import { documentsLimiter, providerEventsLimiter } from '../middlewares/rateLimiter.js';
import { requireAuth as authenticateToken, AuthRequest } from '../middlewares/requireAuth.js';
import { effectivePlan, isPaidPlan, planCommuneLimit } from '../lib/plans.js';
import { validateTaxId } from '../utils/taxId.js';
import { getMarket, publicMarket } from '../config/markets.js';

const router = Router();



// Search providers by location and type
router.get('/search', async (req, res) => {
  try {
    const { lat, lng, type, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const rad = parseFloat((radius as string) || '10'); // km

    // Basic "bounding box" or approximate query since Prisma doesn't support PostGIS natively without raw SQL
    // 1 deg lat ~= 111km
    // 1 deg lng ~= 111km * cos(lat)
    const latDelta = rad / 111;
    const lngDelta = rad / (111 * Math.cos(latitude * (Math.PI / 180)));

    const whereClause: any = {
      // La vitrina gratuita (sin suscripcion) tambien es visible en el directorio.
      status: { in: [...VISIBLE_PROVIDER_STATUSES] },
      latitude: {
        gte: latitude - latDelta,
        lte: latitude + latDelta
      },
      longitude: {
        gte: longitude - lngDelta,
        lte: longitude + lngDelta
      }
    };

    if (type) {
      whereClause.type = type;
    }

    if (req.query.certified === 'true') {
      whereClause.emailVerified = true;
    }

    const providers = await prisma.serviceProvider.findMany({
      where: whereClause,
      include: { user: { select: { name: true } }, subscription: { select: { plan: true, status: true, endDate: true } } }
    });

    // Precise distance AND Specialty filtering
    const results = (providers as any[]).map(p => {
      if (!p.latitude || !p.longitude) return null;
      
      const dist = getDistanceFromLatLonInKm(latitude, longitude, p.latitude, p.longitude);
      
      // Filtro por especialidades (si se solicitan)
      if (req.query.specialties) {
        const searchSpecs = (req.query.specialties as string).split(',').map((s: string) => s.trim().toLowerCase());
        const providerSpecs = (p.specialties || '').split(',').map((s: string) => s.trim().toLowerCase());
        
        const matches = searchSpecs.some((s: string) => providerSpecs.includes(s));
        if (!matches) return null;
      }

      const { subscription, ...rest } = p;
      return { ...rest, plan: effectivePlan(subscription), distance: dist };
    })
    .filter(p => p !== null && p.distance <= rad)
    .sort((a, b) => ((a?.plan === 'FREE' ? 1 : 0) - (b?.plan === 'FREE' ? 1 : 0)) || (a?.distance || 0) - (b?.distance || 0));

    return res.json(results);
  } catch (error) {
    console.error("Error searching providers:", error);
    return res.status(500).json({ error: 'Failed to search providers' });
  }
});

// Helper function for Haversine distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}

// Campos de la vitrina que puede ver cualquiera. NUNCA: RUT, documentos (cedula, antecedentes), correo del dueño,
// patente del vehiculo ni el historial de trabajos.
const PUBLIC_PROFILE_SELECT = {
  id: true,
  userId: true,
  type: true,
  status: true,
  businessName: true,
  experience: true,
  bio: true,
  specialties: true,
  rating: true,
  completedJobs: true,
  trustScore: true,
  commune: true,
  region: true,
  address: true,
  phone: true,
  website: true,
  paymentMethods: true,
  latitude: true,
  longitude: true,
  emailVerified: true,
  phoneVerified: true,
  createdAt: true,
  user: { select: { name: true } },
  subscription: { select: { plan: true, status: true, endDate: true } },
} as const;

// Identifica (sin exigirlo) a quien consulta, para que el dueño o un administrador vean su vitrina aunque no sea publica.
const optionalViewer = async (req: any) => {
  const header = req.headers['authorization'];
  const token = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : '';
  const decoded = token ? verifyAccessToken(token) : null;
  if (!decoded) return null;
  return prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, role: true, status: true } });
};

// GET /api/providers/recent - Vitrinas publicadas mas recientemente (para la portada). Publico.
// Solo vitrinas visibles y con lo minimo para mostrarse (nombre o presentacion, y comuna).
router.get('/recent', async (req, res) => {
  try {
    const limit = Math.min(12, Math.max(1, Number.parseInt(String(req.query.limit ?? '6'), 10) || 6));
    const providers = await prisma.serviceProvider.findMany({
      where: {
        status: { in: [...VISIBLE_PROVIDER_STATUSES] },
        commune: { not: null },
        OR: [{ businessName: { not: null } }, { bio: { not: null } }],
      },
      orderBy: [
        { submittedAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        type: true,
        status: true,
        businessName: true,
        bio: true,
        specialties: true,
        commune: true,
        region: true,
        rating: true,
        completedJobs: true,
        submittedAt: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });
    res.set('Cache-Control', 'public, max-age=60');
    return res.json({ providers });
  } catch (error) {
    console.error('Error fetching recent providers:', error);
    return res.status(500).json({ error: 'No se pudieron cargar las vitrinas nuevas' });
  }
});

// GET /api/providers/featured - "Anuncios destacados" de la portada. Publico.
// Primero las vitrinas con plan de pago vigente; si hay menos de `limit`, se completa con las publicadas mas recientemente.
router.get('/featured', async (req, res) => {
  try {
    const limit = Math.min(12, Math.max(1, Number.parseInt(String(req.query.limit ?? '5'), 10) || 5));
    const base = {
      status: { in: [...VISIBLE_PROVIDER_STATUSES] },
      commune: { not: null },
      OR: [{ businessName: { not: null } }, { bio: { not: null } }],
    };
    const select = {
      id: true, type: true, status: true, businessName: true, bio: true, specialties: true, commune: true, region: true,
      rating: true, completedJobs: true, submittedAt: true, createdAt: true, user: { select: { name: true } },
    } as const;
    const order = [{ submittedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }] as any;

    const paid = await prisma.serviceProvider.findMany({
      where: { ...base, subscription: { is: { status: 'ACTIVE', plan: { not: 'FREE' }, endDate: { gt: new Date() } } } },
      orderBy: order, take: limit, select,
    });
    let list = paid.map((p) => ({ ...p, featured: true }));
    if (list.length < limit) {
      const recent = await prisma.serviceProvider.findMany({
        where: { ...base, id: { notIn: list.map((p) => p.id) } },
        orderBy: order, take: limit - list.length, select,
      });
      list = list.concat(recent.map((p) => ({ ...p, featured: false })));
    }
    res.set('Cache-Control', 'public, max-age=60');
    return res.json({ providers: list });
  } catch (error) {
    console.error('Error fetching featured providers:', error);
    return res.status(500).json({ error: 'No se pudieron cargar los anuncios destacados' });
  }
});

// POST /api/providers/:id/events  { type: 'VIEW' | 'WHATSAPP' | 'CALL' }
// Publico (el cliente no necesita cuenta). Solo cuenta vitrinas visibles y no cuenta al propio dueño ni a administradores.
// Si la tabla de eventos aun no existe en la base, se ignora en silencio: nunca debe afectar la experiencia del cliente.
const EVENT_TYPES = ['VIEW', 'WHATSAPP', 'CALL'];
let eventsTableWarned = false;
router.post('/:id/events', providerEventsLimiter, async (req, res) => {
  try {
    const type = String(req.body?.type ?? '').toUpperCase();
    if (!EVENT_TYPES.includes(type)) return res.status(400).json({ error: 'Tipo de evento no válido' });

    const provider = await prisma.serviceProvider.findUnique({ where: { id: String(req.params.id) }, select: { id: true, userId: true, status: true } });
    if (!provider || !isProviderVisible(provider.status)) return res.status(204).end();

    const viewer = await optionalViewer(req);
    if (viewer && (viewer.id === provider.userId || viewer.role === 'ADMIN' || viewer.role === 'SUPER_ADMIN')) return res.status(204).end();

    try {
      await prisma.$executeRaw`INSERT INTO "ProviderEvent" ("id", "providerId", "type") VALUES (gen_random_uuid()::text, ${provider.id}, ${type})`;
    } catch (e: any) {
      if (!eventsTableWarned) {
        eventsTableWarned = true;
        console.warn('[events] No se pudo registrar el evento (¿falta aplicar prisma/manual/2026-11-24_provider_events.sql?):', String(e?.message).slice(0, 120));
      }
    }
    return res.status(204).end();
  } catch (error) {
    return res.status(204).end();
  }
});

// Get provider profile (publico)
router.get('/:id', async (req, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: req.params.id },
      select: PUBLIC_PROFILE_SELECT,
    });

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    // Vitrinas pausadas, suspendidas, rechazadas o sin publicar no se sirven al publico (el link directo tampoco).
    if (!isProviderVisible(provider.status)) {
      const viewer = await optionalViewer(req);
      const allowed = !!viewer && viewer.status !== 'SUSPENDED' && viewer.status !== 'DELETED' &&
        (viewer.id === provider.userId || viewer.role === 'ADMIN' || viewer.role === 'SUPER_ADMIN');
      if (!allowed) return res.status(404).json({ error: 'Provider not found' });
    }

    const { userId: _owner, subscription, ...publicProfile } = provider;
    return res.json({ ...publicProfile, plan: effectivePlan(subscription) });
  } catch (error) {
    console.error("Error fetching provider:", error);
    return res.status(500).json({ error: 'Failed to fetch provider' });
  }
});

// Register new provider (always bound to authenticated user)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { 
        type, businessName, experience, bio, vehicle, licensePlate, 
        latitude, longitude, 
        address, commune, region, phone, website, paymentMethods,
        rut, specialties, idDocumentUrl, backgroundCheckUrl
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Validate essential fields
    if (!type) {
        return res.status(400).json({ error: 'Falta campo obligatorio: tipo' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado para crear perfil de prestador' });
    }

    if (rut && !validateTaxId(rut)) {
        return res.status(400).json({ error: `El ${getMarket().taxId.label} ingresado no es válido` });
    }

    const cleanBusinessName = typeof businessName === 'string' ? businessName.trim().slice(0, 120) : '';
    const parsedExperience = experience === undefined || experience === null || experience === '' ? null : Number.parseInt(String(experience), 10);
    if (parsedExperience !== null && (!Number.isFinite(parsedExperience) || parsedExperience < 0 || parsedExperience > 80)) {
      return res.status(400).json({ error: 'Los años de experiencia deben estar entre 0 y 80' });
    }

    // Check if user already has a provider profile
    const existingProfile = await prisma.serviceProvider.findUnique({
        where: { userId }
    });

    // /auth/register crea un perfil placeholder (PENDING, sin submittedAt) para cuentas de prestador.
    // En ese caso el onboarding debe completarlo en vez de rechazarlo.
    const isPlaceholder = existingProfile && existingProfile.status === 'PENDING' && !existingProfile.submittedAt;

    if (existingProfile && !isPlaceholder) {
        return res.status(400).json({ error: "User is already a service provider" });
    }

    const profileData = {
        userId,
        type, // MECHANIC, WORKSHOP, TOWING, INSURANCE
        businessName: cleanBusinessName || null,
        experience: parsedExperience,
        bio,
        vehicle,
        licensePlate,
        latitude,
        longitude,
        address,
        commune,
        region,
        phone,
        website,
        paymentMethods,
        rut,
        specialties,
        idDocumentUrl,
        backgroundCheckUrl,
        submittedAt: new Date(),
        isDemo: false,
        status: "ACTIVE",
    };

    if (isPlaceholder) {
      const { userId: _omit, ...updateData } = profileData;
      const completed = await prisma.serviceProvider.update({
        where: { userId },
        data: updateData,
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      });
      return res.status(200).json(completed);
    }

    const newProvider = await prisma.serviceProvider.create({
      data: {
        userId,
        type, // MECHANIC, WORKSHOP, TOWING, INSURANCE
        bio,
        vehicle, 
        licensePlate,
        latitude,
        longitude,
        address,
        commune,
        region,
        phone,
        website,
        paymentMethods,
        rut,
        specialties,
        idDocumentUrl,
        backgroundCheckUrl,
        submittedAt: new Date(),
        isDemo: false,
        status: "ACTIVE" // Default to ACTIVE so they can get visibility once approved/linked
      },
      include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
      }
    });

    return res.status(201).json(newProvider);
  } catch (error: any) {
    console.error("Error registering provider:", error);
    // Devolver el mensaje de error real para debug
    const errorMessage = error?.message || error?.code || 'Unknown error';
    return res.status(500).json({ error: 'Failed to register provider', details: errorMessage });
  }
});

// Update provider profile
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const providerId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { id: providerId as string }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    const isOwner = provider.userId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para modificar este perfil' });
    }

    const { businessName, experience, bio, vehicle, licensePlate, status, latitude, longitude, address, commune, region, phone, website, specialties, paymentMethods } = req.body;

    if (status !== undefined && status !== provider.status && !isAdmin) {
      return res.status(403).json({ error: 'Acceso denegado: Solo administradores pueden cambiar el estado del proveedor' });
    }

    const updatedProvider = await prisma.serviceProvider.update({
      where: { id: providerId as string },
      data: {
        bio,
        vehicle,
        licensePlate,
        latitude,
        longitude,
        ...(businessName !== undefined && { businessName: String(businessName).trim().slice(0, 120) || null }),
        ...(experience !== undefined && { experience: experience === null || experience === '' ? null : Math.min(80, Math.max(0, Number.parseInt(String(experience), 10) || 0)) }),
        ...(address !== undefined && { address }),
        ...(commune !== undefined && { commune }),
        ...(region !== undefined && { region }),
        ...(phone !== undefined && { phone }),
        ...(website !== undefined && { website }),
        ...(specialties !== undefined && { specialties }),
        ...(paymentMethods !== undefined && { paymentMethods }),
        ...(isAdmin && status && { status })
      }
    });

    res.json(updatedProvider);
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ error: 'Failed to update provider' });
  }
});

// --- Documentos de verificacion ------------------------------------------------------------------------
const MAX_DOC_BYTES = 4 * 1024 * 1024;
const DATA_URL = /^data:(image\/jpeg|image\/png|image\/webp|application\/pdf);base64,([A-Za-z0-9+/]+={0,2})$/;

// Valida tipo declarado, tamaño y la FIRMA real del archivo (no basta con confiar en el "data:image/png").
const validateDocument = (value: unknown): { dataUrl: string } | { error: string } => {
  if (typeof value !== 'string' || !value) return { error: 'Archivo no válido' };
  const m = DATA_URL.exec(value);
  if (!m) return { error: 'Formato no permitido. Usa JPG, PNG, WEBP o PDF.' };
  const bytes = Buffer.from(m[2], 'base64');
  if (bytes.length === 0 || bytes.length > MAX_DOC_BYTES) return { error: 'El archivo pesa más de 4 MB.' };
  const mime = m[1];
  const head = bytes.subarray(0, 12);
  const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const isPng = head[0] === 0x89 && head.subarray(1, 4).toString() === 'PNG';
  const isWebp = head.subarray(0, 4).toString() === 'RIFF' && head.subarray(8, 12).toString() === 'WEBP';
  const isPdf = head.subarray(0, 4).toString() === '%PDF';
  const matches =
    (mime === 'image/jpeg' && isJpeg) || (mime === 'image/png' && isPng) || (mime === 'image/webp' && isWebp) || (mime === 'application/pdf' && isPdf);
  if (!matches) return { error: 'El contenido del archivo no coincide con su formato.' };
  return { dataUrl: value };
};

// PUT /api/providers/me/documents  { idDocumentUrl?, backgroundCheckUrl? }
// Solo el dueño. Al completar ambos, la vitrina publicada queda verificada automaticamente (el equipo puede revocarlo).
router.put('/me/documents', documentsLimiter, authenticateToken, async (req: AuthRequest, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({ where: { userId: req.user!.id } });
    if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });
    if (provider.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Tu cuenta está suspendida. Escribe a contacto@redmecanica.cl.' });
    }

    const data: { idDocumentUrl?: string; backgroundCheckUrl?: string } = {};
    for (const key of ['idDocumentUrl', 'backgroundCheckUrl'] as const) {
      if (req.body?.[key] === undefined) continue;
      const v = validateDocument(req.body[key]);
      if ('error' in v) {
        const label = key === 'idDocumentUrl' ? 'La cédula' : 'El certificado de antecedentes';
        return res.status(400).json({ error: `${label}: ${v.error}`, field: key });
      }
      data[key] = v.dataUrl;
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Adjunta al menos un documento.' });
    }

    const updated = await prisma.serviceProvider.update({
      where: { id: provider.id },
      data,
      select: { idDocumentUrl: true, backgroundCheckUrl: true },
    });
    await prisma.providerHistory.create({
      data: { providerId: provider.id, action: 'DOCUMENTS_UPLOADED', description: `Documentos subidos: ${Object.keys(data).join(', ')}` },
    });

    const hasId = !!updated.idDocumentUrl;
    const hasBg = !!updated.backgroundCheckUrl;
    // Verificacion automatica: con cedula y certificado de antecedentes la vitrina publicada queda verificada.
    // Una vitrina sin publicar (PENDING) se verifica al publicarla; pausada, rechazada o en revision no cambia de estado aqui.
    let status = provider.status;
    if (hasId && hasBg && provider.status === 'ACTIVE') {
      await prisma.serviceProvider.update({ where: { id: provider.id }, data: { status: 'APPROVED' } });
      await prisma.providerHistory.create({
        data: { providerId: provider.id, action: 'AUTO_VERIFIED', description: 'Verificada automáticamente al presentar cédula y certificado de antecedentes' },
      });
      status = 'APPROVED';
    }
    return res.json({
      hasIdDocument: hasId,
      hasBackgroundCheck: hasBg,
      status,
      message: status === 'APPROVED' && provider.status !== 'APPROVED'
        ? '¡Listo! Tu vitrina quedó verificada.'
        : hasId && hasBg
        ? (provider.status === 'PENDING' ? 'Documentos guardados. Tu vitrina quedará verificada al publicarla.' : 'Documentos guardados.')
        : 'Documento guardado. Falta el otro para completar la verificación.',
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    return res.status(500).json({ error: 'No se pudieron guardar los documentos' });
  }
});

// POST /api/providers/me/publish - Publicar una vitrina que aun no lo esta (exige los datos minimos)
router.post('/me/publish', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({ where: { userId: req.user!.id } });
    if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });
    if (provider.status === 'ACTIVE' || provider.status === 'APPROVED') {
      return res.json({ message: 'Tu vitrina ya está publicada', status: provider.status });
    }
    if (provider.status !== 'PENDING') {
      return res.status(400).json({ error: 'Esta vitrina no se puede publicar desde aquí. Escribe a contacto@redmecanica.cl.' });
    }
    const missing: string[] = [];
    if (!provider.businessName?.trim()) missing.push('nombre del negocio');
    if (!provider.phone?.trim()) missing.push('teléfono');
    if (!provider.commune?.trim()) missing.push('comuna');
    if (missing.length) {
      return res.status(400).json({ error: `Completa estos datos para publicar: ${missing.join(', ')}.`, missing });
    }
    // Con cedula y antecedentes presentados, la vitrina sale publicada y verificada.
    const verified = !!provider.idDocumentUrl && !!provider.backgroundCheckUrl;
    const nextStatus = verified ? 'APPROVED' : 'ACTIVE';
    await prisma.serviceProvider.update({
      where: { id: provider.id },
      data: { status: nextStatus, submittedAt: provider.submittedAt ?? new Date() },
    });
    await prisma.providerHistory.create({
      data: { providerId: provider.id, action: 'ACTIVATION', description: verified ? 'Vitrina publicada y verificada (documentos presentados)' : 'Vitrina publicada por el prestador' },
    });
    return res.json({ message: verified ? '¡Tu vitrina está publicada y verificada!' : '¡Tu vitrina ya está publicada!', status: nextStatus });
  } catch (error) {
    console.error('Error publishing provider:', error);
    return res.status(500).json({ error: 'No se pudo publicar la vitrina' });
  }
});

// POST /api/providers/me/pause - El prestador oculta su vitrina temporalmente (vacaciones, sin cupo, etc.)
router.post('/me/pause', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({ where: { userId: req.user!.id } });
    if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });
    if (provider.status === 'PAUSED') return res.json({ message: 'Tu vitrina ya estaba pausada', status: 'PAUSED' });
    if (provider.status !== 'ACTIVE' && provider.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Solo se puede pausar una vitrina publicada' });
    }

    await prisma.serviceProvider.update({ where: { id: provider.id }, data: { status: 'PAUSED' } });
    await prisma.providerHistory.create({
      data: { providerId: provider.id, action: 'PAUSED', description: 'Vitrina pausada por el prestador' },
    });
    return res.json({ message: 'Tu vitrina quedó oculta. Puedes reanudarla cuando quieras.', status: 'PAUSED' });
  } catch (error) {
    console.error('Error pausing provider:', error);
    return res.status(500).json({ error: 'No se pudo pausar la vitrina' });
  }
});

// POST /api/providers/me/resume - Reanudar una vitrina pausada por el propio prestador
router.post('/me/resume', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({ where: { userId: req.user!.id } });
    if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });
    if (provider.status !== 'PAUSED') {
      return res.status(400).json({ error: provider.status === 'SUSPENDED'
        ? 'Tu cuenta fue suspendida por un administrador. Escribe a contacto@redmecanica.cl.'
        : 'Tu vitrina no está pausada' });
    }

    // Vuelve al estado previo: verificada si ya fue revisada, publicada si no.
    const restored = provider.reviewedAt ? 'APPROVED' : 'ACTIVE';
    await prisma.serviceProvider.update({ where: { id: provider.id }, data: { status: restored } });
    await prisma.providerHistory.create({
      data: { providerId: provider.id, action: 'RESUMED', description: 'Vitrina reanudada por el prestador' },
    });
    return res.json({ message: 'Tu vitrina volvió a estar visible.', status: restored });
  } catch (error) {
    console.error('Error resuming provider:', error);
    return res.status(500).json({ error: 'No se pudo reanudar la vitrina' });
  }
});

// POST /api/providers/me/resubmit - Un prestador rechazado corrige sus datos y pide una nueva revision
router.post('/me/resubmit', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({ where: { userId: req.user!.id } });
    if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });
    if (provider.status !== 'REJECTED') {
      return res.status(400).json({ error: 'Solo una vitrina rechazada se puede reenviar a revisión' });
    }
    await prisma.serviceProvider.update({
      where: { id: provider.id },
      data: { status: 'UNDER_REVIEW', submittedAt: new Date() },
    });
    await prisma.providerHistory.create({
      data: { providerId: provider.id, action: 'RESUBMITTED', description: 'Vitrina reenviada a revisión por el prestador' },
    });
    return res.json({ message: 'Enviamos tu vitrina a una nueva revisión.', status: 'UNDER_REVIEW' });
  } catch (error) {
    console.error('Error resubmitting provider:', error);
    return res.status(500).json({ error: 'No se pudo reenviar la vitrina' });
  }
});

router.get('/me/quotes', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;
        const provider = await prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });

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

        return res.json(quotes);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener cotizaciones' });
    }
});

// --- PANEL DEL PRESTADOR EN UNA SOLA CONSULTA ---
// El panel necesitaba 4 endpoints y ~25 consultas SQL en serie (cada una ~200 ms hacia la base en Railway), lo que
// tardaba varios segundos incluso con pocos datos. Aqui todo se arma dentro de Postgres y viaja en UN solo viaje.
// Las fechas de Postgres (timestamp sin zona) salen sin "Z": se normalizan a UTC para que el navegador no las desplace.
router.get('/me/panel', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const firstDayOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();

    // Contactos y visitas de los ultimos 14 dias (7 actuales + 7 anteriores). Si la tabla aun no existe: null.
    const engagementPromise = prisma.$queryRaw<Array<{ type: string; recent: bigint; previous: bigint }>>`
      SELECT e."type",
             COUNT(*) FILTER (WHERE e."createdAt" >= NOW() - INTERVAL '7 days') AS recent,
             COUNT(*) FILTER (WHERE e."createdAt" <  NOW() - INTERVAL '7 days') AS previous
      FROM "ProviderEvent" e JOIN "ServiceProvider" sp ON sp.id = e."providerId"
      WHERE sp."userId" = ${userId} AND e."createdAt" >= NOW() - INTERVAL '14 days'
      GROUP BY e."type"`.then((r) => r).catch(() => null);

    const rows = await prisma.$queryRaw<Array<{ data: any }>>`
      WITH p AS (SELECT * FROM "ServiceProvider" WHERE "userId" = ${userId} LIMIT 1)
      SELECT jsonb_build_object(
        'provider', (
          SELECT to_jsonb(p) - 'idDocumentUrl' - 'backgroundCheckUrl' - 'certificationUrl' - 'insuranceUrl' - 'municipalPermitUrl'
            || jsonb_build_object(
              'user', (SELECT jsonb_build_object('name', u.name, 'email', u.email) FROM "User" u WHERE u.id = p."userId"),
              'subscription', (SELECT to_jsonb(s) FROM "Subscription" s WHERE s."providerId" = p.id),
              'history', COALESCE((SELECT jsonb_agg(to_jsonb(h) ORDER BY h."createdAt" DESC)
                                   FROM (SELECT * FROM "ProviderHistory" WHERE "providerId" = p.id ORDER BY "createdAt" DESC LIMIT 10) h), '[]'::jsonb),
              'coveredCommunes', (SELECT COUNT(*) FROM "ProviderCoverage" c WHERE c."providerId" = p.id AND c.active = true),
              'hasIdDocument', ("idDocumentUrl" IS NOT NULL),
              'hasBackgroundCheck', ("backgroundCheckUrl" IS NOT NULL)
            )
          FROM p
        ),
        'openRequestsCount', (
          SELECT COUNT(*) FROM "Job" oj
          WHERE oj.status IN ('PENDING', 'SEARCHING', 'QUOTING')
            AND oj."customerId" <> ${userId}
            AND NOT EXISTS (SELECT 1 FROM "Quote" oq WHERE oq."jobId" = oj.id AND oq."providerId" = (SELECT id FROM p))
        ),
        'stats', (
          SELECT jsonb_build_object(
            'totalJobs', COUNT(*),
            'closedJobs', COUNT(*) FILTER (WHERE j.status = 'CLOSED'),
            'totalEarnings', COALESCE(SUM(j."estimatedCost") FILTER (WHERE j.status = 'CLOSED'), 0),
            'monthEarnings', COALESCE(SUM(j."estimatedCost") FILTER (WHERE j.status = 'CLOSED' AND j."completedAt" >= ${firstDayOfMonth}::timestamp), 0)
          )
          FROM "Job" j WHERE j."providerId" = (SELECT id FROM p)
        ),
        'jobs', COALESCE((
          SELECT jsonb_agg(x.row ORDER BY x."createdAt" DESC) FROM (
            SELECT j."createdAt",
                   to_jsonb(j) || jsonb_build_object('request',
                     to_jsonb(r) || jsonb_build_object(
                       'user', jsonb_build_object('name', u.name, 'email', u.email),
                       'vehicle', to_jsonb(v),
                       'service', to_jsonb(sv))) AS row
            FROM "Job" j
            JOIN "ServiceRequest" r ON r.id = j."requestId"
            JOIN "User" u ON u.id = r."userId"
            LEFT JOIN "Vehicle" v ON v.id = r."vehicleId"
            LEFT JOIN "Service" sv ON sv.id = r."serviceId"
            WHERE j."providerId" = (SELECT id FROM p)
            ORDER BY j."createdAt" DESC LIMIT 200
          ) x), '[]'::jsonb),
        'quotes', COALESCE((
          SELECT jsonb_agg(x.row ORDER BY x."createdAt" DESC) FROM (
            SELECT q."createdAt",
                   to_jsonb(q) || jsonb_build_object('job',
                     to_jsonb(j) || jsonb_build_object('request',
                       to_jsonb(r) || jsonb_build_object(
                         'user', jsonb_build_object('name', u.name),
                         'vehicle', to_jsonb(v),
                         'service', to_jsonb(sv)))) AS row
            FROM "Quote" q
            JOIN "Job" j ON j.id = q."jobId"
            JOIN "ServiceRequest" r ON r.id = j."requestId"
            JOIN "User" u ON u.id = r."userId"
            LEFT JOIN "Vehicle" v ON v.id = r."vehicleId"
            LEFT JOIN "Service" sv ON sv.id = r."serviceId"
            WHERE q."providerId" = (SELECT id FROM p)
            ORDER BY q."createdAt" DESC LIMIT 200
          ) x), '[]'::jsonb),
        'invoices', COALESCE((
          SELECT jsonb_agg(to_jsonb(i) ORDER BY i."createdAt" DESC)
          FROM (SELECT * FROM "Invoice" WHERE "providerId" = (SELECT id FROM p) ORDER BY "createdAt" DESC LIMIT 100) i
        ), '[]'::jsonb)
      ) AS data
    `;

    const engagementRows = await engagementPromise;
    const data = withUtc(rows?.[0]?.data);
    if (!data?.provider) return res.status(404).json({ error: 'Perfil de proveedor no encontrado' });

    // El contacto del cliente solo se entrega cuando el trabajo ya fue confirmado (cotizacion aceptada).
    const PRE_CONFIRMATION = ['PENDING', 'SEARCHING', 'QUOTING', 'COMPARING_QUOTES', 'CANCELLED'];
    const jobs = (data.jobs || []).map((j: any) =>
      PRE_CONFIRMATION.includes(j.status) && j.request?.user
        ? { ...j, request: { ...j.request, user: { name: j.request.user.name } } }
        : j
    );

    const provider = { ...data.provider, _count: { jobs: data.stats?.totalJobs ?? 0 } };
    // Solo un prestador publicado puede cotizar: si no lo esta, no hay "solicitudes nuevas" que mostrarle.
    const canQuoteNow = provider.status === 'ACTIVE' || provider.status === 'APPROVED';
    const totalJobs = data.stats?.totalJobs ?? 0;
    const closedCount = data.stats?.closedJobs ?? 0;

    res.set('Cache-Control', 'private, no-store');
    return res.json({
      dashboard: {
        provider,
        stats: {
          totalEarnings: Number(data.stats?.totalEarnings) || 0,
          monthEarnings: Number(data.stats?.monthEarnings) || 0,
          completedJobs: closedCount,
          totalJobs,
          avgRating: provider.rating,
          responseTime: null,
          completionRate: totalJobs > 0 ? Math.round((closedCount / totalJobs) * 100) : null,
        },
      },
      jobs,
      quotes: data.quotes || [],
      invoices: data.invoices || [],
      openRequestsCount: canQuoteNow ? Number(data.openRequestsCount) || 0 : 0,
      limits: { communes: planCommuneLimit(provider.subscription) },
      plan: effectivePlan(provider.subscription),
      engagementLocked: !isPaidPlan(provider.subscription),
      engagement: (() => {
        if (!isPaidPlan(provider.subscription)) return null; // estadisticas: incluidas en planes de pago
        if (!engagementRows) return null; // tabla de eventos no disponible todavia
        const pick = (t: string) => engagementRows.find((r) => r.type === t);
        const n = (v: any) => Number(v) || 0;
        return {
          views: n(pick('VIEW')?.recent),
          contacts: n(pick('WHATSAPP')?.recent) + n(pick('CALL')?.recent),
          previousViews: n(pick('VIEW')?.previous),
          previousContacts: n(pick('WHATSAPP')?.previous) + n(pick('CALL')?.previous),
        };
      })(),
      config: { platformFeePercent: PLATFORM_FEE_PERCENT, market: publicMarket(getMarket()) },
    });
  } catch (error) {
    console.error('Panel error:', error);
    return res.status(500).json({ error: 'Error al cargar el panel' });
  }
});

// --- DASHBOARD FOR AUTHENTICATED PROVIDER ---
router.get('/me/dashboard', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      include: {
        subscription: true,
        history: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: {
          select: { jobs: true }
        }
      }
    });

    if (!provider) return res.status(404).json({ error: 'Perfil de proveedor no encontrado' });

    // Calcular ganancias reales de jobs completados
    const earnings = await prisma.job.aggregate({
      where: {
        providerId: provider.id,
        status: 'CLOSED'
      },
      _sum: {
        estimatedCost: true
      }
    });

    // Ganancias del mes actual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEarnings = await prisma.job.aggregate({
      where: {
        providerId: provider.id,
        status: 'CLOSED',
        completedAt: { gte: firstDayOfMonth }
      },
      _sum: {
        estimatedCost: true
      }
    });

    // Tasa de finalización real: trabajos cerrados sobre total asignado
    const closedCount = await prisma.job.count({
      where: {
        providerId: provider.id,
        status: 'CLOSED'
      }
    });

    const totalJobs = provider._count.jobs || 0;

    return res.json({
      provider,
      stats: {
        totalEarnings: earnings._sum.estimatedCost || 0,
        monthEarnings: monthEarnings._sum.estimatedCost || 0,
        completedJobs: closedCount,
        totalJobs,
        avgRating: provider.rating,
        responseTime: null, // Se calculará cuando exista historial real de respuestas
        completionRate: totalJobs > 0 ? Math.round((closedCount / totalJobs) * 100) : null
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ error: 'Error al cargar dashboard' });
  }
});

router.get('/me/invoices', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const provider = await prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });

    const invoices = await prisma.invoice.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(invoices);
  } catch (error) {
    console.error("Invoices error:", error);
    return res.status(500).json({ error: 'Error al obtener facturas' });
  }
});

router.get('/me/jobs', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;
        const provider = await prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });

        const jobs = await prisma.job.findMany({
            where: { providerId: provider.id },
            include: {
                request: {
                    include: {
                        user: { select: { name: true, email: true } },
                        vehicle: true,
                        service: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // El contacto del cliente solo se entrega cuando el trabajo ya fue confirmado (cotizacion aceptada).
        const PRE_CONFIRMATION = ['PENDING', 'SEARCHING', 'QUOTING', 'COMPARING_QUOTES', 'CANCELLED'];
        const safeJobs = jobs.map((j: any) =>
          PRE_CONFIRMATION.includes(j.status) && j.request?.user
            ? { ...j, request: { ...j.request, user: { name: j.request.user.name } } }
            : j
        );

        return res.json(safeJobs);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener trabajos' });
    }
});

export default router;
