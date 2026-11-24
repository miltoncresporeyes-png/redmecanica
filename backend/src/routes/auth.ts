import { Router } from 'express';
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken, passwordFingerprint } from '../utils/auth.js';
import { requireAuth as authenticateToken, AuthRequest } from '../middlewares/requireAuth.js';
import crypto from 'node:crypto';
import { signupLimiter, forgotPasswordEmailLimiter, forgotPasswordIpLimiter } from '../middlewares/rateLimiter.js';
import { withUtc } from '../lib/pgJson.js';
import { createResetToken, peekResetSubject, verifyResetToken, appBaseUrl } from '../lib/passwordReset.js';
import { OAuth2Client } from 'google-auth-library';
import {
  sendWelcomeRegistrationEmail,
  sendVerificationCodeEmail,
  sendPasswordResetEmail,
  encryptVerificationCode,
  decryptVerificationCode,
} from '../services/email.js';

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

const sanitizeUser = (user: any) => {
  const { password: _p, emailVerificationToken: _t, emailVerificationExpiresAt: _e, ...safe } = user;
  return safe;
};

// Un solo formato de correo en TODOS los flujos (registro, login, OTP, Google, recuperacion).
const normalizeEmail = (v: unknown) => String(v ?? '').trim().toLowerCase();
const findUserByEmail = (email: string) =>
  prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } }, orderBy: { createdAt: 'asc' } });

// Intentos fallidos de OTP por cuenta (en memoria): tras 5 se invalida el codigo y hay que pedir uno nuevo.
const OTP_MAX_ATTEMPTS = 5;
const otpFailures = new Map<string, number>();

const issueOtp = () => {
  const code = crypto.randomInt(100000, 1000000).toString();
  return {
    code,
    token: encryptVerificationCode(code),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  };
};

const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const router = Router();

// POST /api/auth/register
router.post('/register', signupLimiter, async (req, res) => {
  try {
    const { password, name, role } = req.body;
    const email = normalizeEmail(req.body?.email);

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar formato de email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'provider' ? 'MECHANIC' : 'USER';
    const otp = issueOtp();

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: userRole,
                emailVerified: false,
                emailVerificationToken: otp.token,
                emailVerificationExpiresAt: otp.expiresAt,
            }
        });

        if (userRole === 'MECHANIC') {
            await tx.serviceProvider.create({
                data: {
                    userId: user.id,
                    status: 'PENDING',
                    isDemo: false
                }
            });
        }

        return user;
    });

    // El registro NO emite sesión: requiere validar el OTP enviado al correo.
    let emailSent = true;
    try {
      await sendVerificationCodeEmail(result.email, result.name || 'usuario', otp.code);
    } catch (emailErr: any) {
      emailSent = false;
      console.warn(`[AUTH] No se pudo enviar el OTP a ${result.email}:`, emailErr.message);
    }

    res.status(201).json({
      message: emailSent
        ? 'Te enviamos un código de verificación al correo'
        : 'Cuenta creada, pero no pudimos enviar el código. Solicita uno nuevo.',
      user: sanitizeUser(result),
      requiresEmailVerification: true,
      verificationExpiresAt: otp.expiresAt,
      emailSent,
    });

  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body?.email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      include: {
        serviceProvider: true
      },
      orderBy: { createdAt: 'asc' }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if ((user as any).status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Tu cuenta ha sido suspendida. Contacta a soporte para más detalles.' });
    }

    if ((user as any).status === 'DELETED') {
      return res.status(401).json({ error: 'Esta cuenta ha sido dada de baja.' });
    }

    // Cuentas con OTP pendiente (registro nuevo sin verificar) no pueden iniciar sesión.
    // Las cuentas previas (sin token pendiente) no se ven afectadas.
    if (!(user as any).emailVerified && (user as any).emailVerificationToken) {
      return res.status(403).json({
        error: 'Debes verificar tu correo con el código enviado antes de iniciar sesión',
        requiresEmailVerification: true,
      });
    }

    // Verificar password
    // Nota: El seed original usa passwords planos o hashes simples.
    let validPassword = false;
    if (user.password.startsWith('$2b$')) {
        validPassword = await bcrypt.compare(password, user.password);
    } else {
        validPassword = user.password === password; // Legacy plain text support for seed
    }

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const tokens = generateTokens(user.id, user.password);

    // Configurar cookie httpOnly
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true en prod
      sameSite: 'lax', // o 'strict' según necesidades
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    const userWithoutPassword = sanitizeUser(user);

    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token: tokens.accessToken
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/auth/verify-email  { email, code }
router.post('/verify-email', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const code = String(req.body?.code ?? req.body?.verificationCode ?? '').trim();
    if (!email || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Email y código de 6 dígitos son requeridos' });
    }

    const user = await findUserByEmail(email);
    const invalid = () => res.status(400).json({ error: 'Código incorrecto o expirado' });
    if (!user || user.emailVerified || !user.emailVerificationToken || !user.emailVerificationExpiresAt) {
      return invalid();
    }
    if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: 'Tu código expiró. Solicita uno nuevo', expired: true });
    }

    let expected: string;
    try {
      expected = decryptVerificationCode(user.emailVerificationToken);
    } catch {
      return invalid();
    }
    const a = Buffer.from(expected);
    const b = Buffer.from(code);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      const failures = (otpFailures.get(user.id) ?? 0) + 1;
      if (failures >= OTP_MAX_ATTEMPTS) {
        // Demasiados intentos: el codigo expira de inmediato y se debe pedir uno nuevo (reenvio permitido).
        otpFailures.delete(user.id);
        await prisma.user.update({ where: { id: user.id }, data: { emailVerificationExpiresAt: new Date() } });
        return res.status(429).json({ error: 'Demasiados intentos fallidos. Solicita un código nuevo.', expired: true });
      }
      otpFailures.set(user.id, failures);
      return invalid();
    }
    otpFailures.delete(user.id);

    const verified = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
      },
    });

    const tokens = generateTokens(verified.id, verified.password);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    void (async () => {
      try {
        await sendWelcomeRegistrationEmail(verified.email, verified.name || 'usuario', verified.role as any);
      } catch (emailErr: any) {
        console.warn(`[AUTH] No se pudo enviar el correo de bienvenida a ${verified.email}:`, emailErr.message);
      }
    })();

    res.json({
      message: 'Correo verificado exitosamente',
      user: sanitizeUser(verified),
      token: tokens.accessToken,
    });
  } catch (error) {
    console.error('Error in verify-email:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/auth/resend-verification  { email }
router.post('/resend-verification', signupLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const generic = { message: 'Si la cuenta está pendiente de verificación, enviamos un nuevo código.' };
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const user = await findUserByEmail(email);
    if (!user || user.emailVerified || !user.emailVerificationToken || !user.emailVerificationExpiresAt) {
      return res.json(generic); // no revelar si la cuenta existe
    }

    const issuedAt = user.emailVerificationExpiresAt.getTime() - OTP_TTL_MS;
    if (Date.now() - issuedAt < OTP_RESEND_COOLDOWN_MS) {
      return res.status(429).json({ error: 'Espera un minuto antes de pedir otro código' });
    }

    const otp = issueOtp();
    otpFailures.delete(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: otp.token, emailVerificationExpiresAt: otp.expiresAt },
    });
    try {
      await sendVerificationCodeEmail(user.email, user.name || 'usuario', otp.code);
    } catch (emailErr: any) {
      console.warn(`[AUTH] No se pudo reenviar el OTP a ${user.email}:`, emailErr.message);
      return res.status(502).json({ error: 'No pudimos enviar el correo. Inténtalo nuevamente.' });
    }
    res.json({ ...generic, verificationExpiresAt: otp.expiresAt });
  } catch (error) {
    console.error('Error in resend-verification:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET /api/auth/google/config - indica al frontend si el acceso con Google esta disponible
router.get('/google/config', (_req, res) => {
  res.json({ enabled: Boolean(googleClient), clientId: googleClient ? GOOGLE_CLIENT_ID : null });
});

// POST /api/auth/google  { credential, role? }
// Inicia sesion o registra con una cuenta de Google. El ID token se verifica en el servidor
// (firma, audiencia y email verificado); nunca se confia en datos enviados por el cliente.
router.post('/google', async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(503).json({ error: 'El acceso con Google no está disponible por ahora' });
    }

    const credential = typeof req.body?.credential === 'string' ? req.body.credential : '';
    if (!credential) {
      return res.status(400).json({ error: 'Credencial de Google requerida' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ error: 'No pudimos validar tu cuenta de Google. Inténtalo nuevamente.' });
    }

    const email = payload?.email?.trim().toLowerCase();
    if (!payload || !email || payload.email_verified !== true) {
      return res.status(400).json({ error: 'Tu cuenta de Google no tiene un correo verificado' });
    }

    let user: any = await findUserByEmail(email);
    let isNewUser = false;

    if (user) {
      if (user.status === 'SUSPENDED') {
        return res.status(403).json({ error: 'Tu cuenta ha sido suspendida. Contacta a soporte para más detalles.' });
      }
      if (user.status === 'DELETED') {
        return res.status(401).json({ error: 'Esta cuenta ha sido dada de baja.' });
      }
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Las cuentas de administrador deben ingresar con correo y contraseña' });
      }
      // Google ya verificó el correo: se da por válido y se cancela cualquier OTP pendiente.
      if (!user.emailVerified) {
        // Cuenta sin verificar: pudo haberla creado un tercero con ese correo y una contraseña que conoce
        // (pre-secuestro). Al vincular Google se descarta esa contraseña para que solo la persona real acceda.
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
            emailVerified: true,
            emailVerifiedAt: new Date(),
            emailVerificationToken: null,
            emailVerificationExpiresAt: null,
          },
        });
      }
    } else {
      // Cuenta nueva: nunca se crea sin que la persona haya elegido el tipo de cuenta.
      if (req.body?.role !== 'provider' && req.body?.role !== 'client') {
        return res.json({ needsRole: true, email, name: payload.name || email.split('@')[0] });
      }
      isNewUser = true;
      const userRole = req.body.role === 'provider' ? 'MECHANIC' : 'USER';
      // Cuenta sin contraseña utilizable: se fija un hash aleatorio (el acceso es solo por Google
      // hasta que la persona use "Olvidé mi contraseña").
      const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

      user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email,
            password: randomPassword,
            name: payload!.name || email.split('@')[0],
            role: userRole,
            emailVerified: true,
            emailVerifiedAt: new Date(),
          },
        });
        if (userRole === 'MECHANIC') {
          await tx.serviceProvider.create({
            data: { userId: created.id, status: 'PENDING', isDemo: false },
          });
        }
        return created;
      });

      void (async () => {
        try {
          await sendWelcomeRegistrationEmail(user.email, user.name || 'usuario', user.role as any);
        } catch (emailErr: any) {
          console.warn(`[AUTH] No se pudo enviar el correo de bienvenida a ${user.email}:`, emailErr.message);
        }
      })();
    }

    const tokens = generateTokens(user.id, user.password);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(isNewUser ? 201 : 200).json({
      message: isNewUser ? 'Cuenta creada con Google' : 'Login exitoso',
      user: sanitizeUser(user),
      token: tokens.accessToken,
      isNewUser,
    });
  } catch (error) {
    console.error('Error in google auth:', error);
    res.status(500).json({ error: 'Error al iniciar sesión con Google' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    // Cookie httpOnly, o el cuerpo como alternativa (clientes sin cookies, p. ej. la app movil)
    const refreshToken = req.cookies.refresh_token || (typeof req.body?.refreshToken === 'string' ? req.body.refreshToken : '');
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token requerido' });

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return res.status(403).json({ error: 'Refresh token inválido o expirado' });

    // El token debe seguir valiendo para ese usuario: cuenta activa y misma contraseña con la que se emitio.
    const owner = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!owner || owner.status === 'DELETED' || owner.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Sesión no válida' });
    }
    if (decoded.pv && decoded.pv !== passwordFingerprint(owner.password)) {
      return res.status(403).json({ error: 'La sesión venció porque cambió la contraseña. Inicia sesión nuevamente.' });
    }

    const tokens = generateTokens(owner.id, owner.password);

    // Actualizar cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ token: tokens.accessToken });
  } catch (error) {
    console.error('Error in refresh:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('refresh_token');
  res.json({ message: 'Logout exitoso' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
     const userId = req.user?.id;
     if (!userId) return res.status(401).json({ error: 'No autenticado' });

     // Validar que el usuario aún exista con todos los datos
     // Una sola consulta (esta llamada se hace en cada carga de pagina) y sin los documentos del prestador
     // (cedula/antecedentes en base64) ni hashes/tokens.
     const rows = await prisma.$queryRaw<Array<{ data: any }>>`
       SELECT (to_jsonb(u) - 'password' - 'emailVerificationToken' - 'emailVerificationExpiresAt')
         || jsonb_build_object('serviceProvider',
              (SELECT to_jsonb(sp) - 'idDocumentUrl' - 'backgroundCheckUrl' - 'certificationUrl' - 'insuranceUrl' - 'municipalPermitUrl'
               FROM "ServiceProvider" sp WHERE sp."userId" = u.id)) AS data
       FROM "User" u WHERE u.id = ${userId} LIMIT 1`;

     const user = rows?.[0]?.data ? withUtc(rows[0].data) : null;
     if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

     res.set('Cache-Control', 'private, no-store');
     res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo perfil' });
  }
});

// POST /api/auth/forgot-password  { email }
// Siempre responde igual exista o no la cuenta (no permite descubrir correos registrados).
router.post('/forgot-password', forgotPasswordIpLimiter, forgotPasswordEmailLimiter, async (req, res) => {
  const generic = {
    message: 'Si el correo está registrado en RedMecánica, recibirás las instrucciones para restablecer tu contraseña.',
  };
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Ingresa un correo electrónico válido' });
    }

    const user = await findUserByEmail(email);
    if (user && user.status !== 'DELETED' && user.status !== 'SUSPENDED') {
      const link = `${appBaseUrl()}/restablecer?token=${encodeURIComponent(createResetToken(user))}`;
      try {
        await sendPasswordResetEmail(user.email, user.name || 'usuario', link);
      } catch (mailErr: any) {
        // No se revela al cliente: la respuesta es la misma. Queda en el log del servidor.
        console.warn(`[AUTH] No se pudo enviar el correo de recuperación a ${user.email}:`, mailErr.message);
      }
    }
    return res.json(generic);
  } catch (error) {
    console.error('Error in forgot-password:', error);
    return res.json(generic);
  }
});

// POST /api/auth/reset-password  { token, password }
router.post('/reset-password', forgotPasswordIpLimiter, async (req, res) => {
  try {
    const token = String(req.body?.token ?? '');
    const password = String(req.body?.password ?? '');
    const invalid = () => res.status(400).json({ error: 'El enlace no es válido o ya venció. Solicita uno nuevo.' });

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'La contraseña debe tener entre 8 y 128 caracteres' });
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ error: 'La contraseña debe incluir letras y números' });
    }

    const subject = peekResetSubject(token);
    if (!subject) return invalid();
    const user = await prisma.user.findUnique({ where: { id: subject } });
    if (!user || user.status === 'DELETED' || user.status === 'SUSPENDED') return invalid();
    if (!verifyResetToken(token, user)) return invalid();

    // Cambiar el hash invalida este mismo enlace (y cualquier otro emitido antes). Llegar por correo prueba
    // que la persona controla la direccion: se da por verificada y se cancela cualquier OTP pendiente.
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(password, 10),
        emailVerified: true,
        emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
      },
    });

    const tokens = generateTokens(updated.id, updated.password);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: 'Contraseña actualizada', user: sanitizeUser(updated), token: tokens.accessToken });
  } catch (error) {
    console.error('Error in reset-password:', error);
    return res.status(500).json({ error: 'No se pudo restablecer la contraseña' });
  }
});

export default router;
