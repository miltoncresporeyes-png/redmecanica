
import { Router } from 'express';
import { sendContactNotification, sendLaunchLeadNotification, sendLaunchLeadConfirmation } from '../services/email.js';
import { logger } from '../lib/logger.js';
import { prisma } from '../db.js';

const router = Router();

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

    // store lead in database, ignore duplicate constraint
    try {
      await prisma.launchLead.create({ data: { email } });
    } catch (prismaError: any) {
      // P2002 = unique constraint failed
      if (prismaError.code === 'P2002') {
        // already exists, we can continue but inform client
        logger.info({ email }, 'Lead already registered');
      } else {
        throw prismaError;
      }
    }

    // send notification to internal address
    await sendLaunchLeadNotification(email);

    // send confirmation to the user as well
    await sendLaunchLeadConfirmation(email);

    return res.status(200).json({ success: true, message: 'Registro completado.' });
  } catch (error: any) {
    logger.error({ error }, 'Error en ruta de leads');
    const message = error?.message || 'Hubo un error al procesar el registro.';
    return res.status(500).json({ error: message });
  }
});

export default router;
