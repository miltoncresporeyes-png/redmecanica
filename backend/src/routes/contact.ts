import { Router } from 'express';
import crypto from 'node:crypto';
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

const buildLeadTicket = (lead: { id: string; createdAt: Date }) => {
  const createdAt = new Date(lead.createdAt);
  const yyyy = createdAt.getFullYear();
  const mm = String(createdAt.getMonth() + 1).padStart(2, '0');
  const dd = String(createdAt.getDate()).padStart(2, '0');
  const token = lead.id.replace(/-/g, '').slice(0, 8).toUpperCase();
  return `RM-LEAD-${yyyy}${mm}${dd}-${token}`;
};

const buildTemporaryTicket = () => `RM-LEAD-TMP-${Date.now().toString(36).toUpperCase()}`;

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
    const rawEmail = req.body?.email as string | undefined;
    const email = rawEmail?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    // simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'El email no tiene un formato válido.' });
    }

    let existingLead = await prisma.launchLead.findUnique({ where: { email } });

    if (existingLead) {
      // Si el lead es antiguo y no tiene código, se lo generamos y actualizamos.
      if (!existingLead.discountCode) {
        const newDiscountCode = `RM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        existingLead = await prisma.launchLead.update({ 
          where: { email }, 
          data: { discountCode: newDiscountCode } 
        });
      }

      return res.status(200).json({
        success: true,
        duplicate: true,
        ticket: buildLeadTicket(existingLead),
        message: 'Este correo ya se encuentra registrado en nuestra lista de lanzamiento.'
      });
    }

    let queuedInFallback = false;
    let createdLead: { id: string; email: string; createdAt: Date; discountCode: string | null } | null = null;
    const discountCode = `RM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // store lead in database
    try {
      createdLead = await prisma.launchLead.create({ data: { email, discountCode } });
    } catch (prismaError: any) {
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

    const ticket = createdLead ? buildLeadTicket(createdLead) : buildTemporaryTicket();

    void (async () => {
      try {
        await sendLaunchLeadNotification(email, ticket);
        await sendLaunchLeadConfirmation(email, ticket, discountCode);
      } catch (emailError: any) {
        logger.warn({ email, ticket, emailError }, 'Lead registrado pero envio de correo fallido');
      }
    })();

    if (queuedInFallback) {
      return res.status(202).json({
        success: true,
        queued: true,
        ticket,
        message: 'Registro recibido y en cola temporal. Lo sincronizaremos en breve.'
      });
    }

    return res.status(200).json({ success: true, ticket, message: `Registro completado. Tu número de ticket es ${ticket}.` });
  } catch (error: any) {
    logger.error({ error }, 'Error en ruta de leads');
    const message = error?.message || 'Hubo un error al procesar el registro.';
    return res.status(500).json({ error: message });
  }
});

export default router;
