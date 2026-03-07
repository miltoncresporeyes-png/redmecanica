"use strict";

const { Router } = require('express');
const { appendFile, mkdir } = require('fs/promises');
const { dirname, join } = require('path');
const {
  sendContactNotification,
  sendLaunchLeadNotification,
  sendLaunchLeadConfirmation,
} = require('../services/email.js');
const { logger } = require('../lib/logger.js');
const { prisma } = require('../db.js');

const router = Router();

const launchLeadsFallbackFile =
  process.env.LAUNCH_LEADS_FALLBACK_FILE || join(process.cwd(), 'tmp', 'launch-leads-fallback.jsonl');

const persistLaunchLeadFallback = async (email, reason) => {
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
  } catch (error) {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'El email no tiene un formato valido.' });
    }

    let queuedInFallback = false;

    try {
      await prisma.launchLead.create({ data: { email } });
    } catch (prismaError) {
      if (prismaError.code === 'P2002') {
        logger.info({ email }, 'Lead already registered');
      } else {
        logger.error({ email, prismaError }, 'Failed to save launch lead in database');

        try {
          await persistLaunchLeadFallback(email, prismaError?.message || 'database-write-failed');
          queuedInFallback = true;
          logger.warn({ email, launchLeadsFallbackFile }, 'Lead queued in fallback file');
        } catch (fallbackError) {
          logger.error({ email, prismaError, fallbackError }, 'Failed to persist launch lead fallback');
          throw prismaError;
        }
      }
    }

    void sendLaunchLeadNotification(email)
      .then(() => sendLaunchLeadConfirmation(email))
      .catch((emailError) => {
        logger.warn({ email, emailError }, 'Lead registrado pero envio de correo fallido');
      });

    if (queuedInFallback) {
      return res.status(202).json({
        success: true,
        queued: true,
        message: 'Registro recibido y en cola temporal. Lo sincronizaremos en breve.',
      });
    }

    return res.status(200).json({ success: true, message: 'Registro completado.' });
  } catch (error) {
    logger.error({ error }, 'Error en ruta de leads');
    const message = error?.message || 'Hubo un error al procesar el registro.';
    return res.status(500).json({ error: message });
  }
});

exports.default = router;
