
import { Router } from 'express';
import { appendFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { sendContactNotification, sendLaunchLeadNotification, sendLaunchLeadConfirmation } from '../services/email.js';
import { logger } from '../lib/logger.js';
import { prisma } from '../db.js';

const router = Router();

const launchLeadsFallbackFile =
  process.env.LAUNCH_LEADS_FALLBACK_FILE || join(process.cwd(), 'tmp', 'launch-leads-fallback.jsonl');

const persistLaunchLeadFallback = async (email: string, reason: string) => {
  await mkdir(dirname(launchLeadsFallbackFile), { recursive: true });
  await appendFile(
    launchLeadsFallbackFile,
    `${JSON.stringify({ email, reason, createdAt: new Date().toISOString() })}\n`,
    'utf8'
  );
};

router.post('/message', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios.' });
    }

    await sendContactNotification({ name, email, phone, subject, message });

    return res.status(200).json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (error: any) {
    logger.error({ error }, 'Error en ruta de contacto');
    return res.status(500).json({ error: 'Hubo un error al enviar el mensaje.' });
  }
});

router.post('/launch-lead', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    // simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'El email no tiene un formato válido.' });
    }

    let queuedInFallback = false;

    // store lead in database, ignore duplicate constraint
    try {
      await prisma.launchLead.create({ data: { email } });
    } catch (prismaError: any) {
      // P2002 = unique constraint failed
      if (prismaError.code === 'P2002') {
        // already exists, we can continue but inform client
        logger.info({ email }, 'Lead already registered');
      } else {
        logger.error({ email, prismaError }, 'Failed to save launch lead in database');

        try {
          await persistLaunchLeadFallback(email, prismaError?.message || 'database-write-failed');
          queuedInFallback = true;
          logger.warn({ email, launchLeadsFallbackFile }, 'Lead queued in fallback file');
        } catch (fallbackError: any) {
          logger.error({ email, prismaError, fallbackError }, 'Failed to persist launch lead fallback');
          throw prismaError;
        }
      }
    }

    void (async () => {
      try {
        await sendLaunchLeadNotification(email);
        await sendLaunchLeadConfirmation(email);
      } catch (emailError: any) {
        logger.warn({ email, emailError }, 'Lead registrado pero envio de correo fallido');
      }
    })();

    if (queuedInFallback) {
      return res.status(202).json({
        success: true,
        queued: true,
        message: 'Registro recibido y en cola temporal. Lo sincronizaremos en breve.'
      });
    }

    return res.status(200).json({ success: true, message: 'Registro completado.' });
  } catch (error: any) {
    logger.error({ error }, 'Error en ruta de leads');
    const message = error?.message || 'Hubo un error al procesar el registro.';
    return res.status(500).json({ error: message });
  }
});

export default router;
