import nodemailer from 'nodemailer';
import { logger } from '../lib/logger.js';

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const configuredPort = parseInt(process.env.SMTP_PORT || '587');
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

const createTransporter = (port: number) => {
  if (!user || !pass) {
    logger.warn('Email service: No SMTP credentials found. Emails will be logged to console but not sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    logger: true,
    debug: true,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    auth: {
      user,
      pass,
    },
    tls: {
      // no rechazar certificados invalidos para evitar ETIMEDOUT si TLS expira 
      rejectUnauthorized: false
    }
  });
};

const getFallbackPort = (port: number): number => {
  if (port === 465) return 587;
  if (port === 587) return 465;
  return 587;
};

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}) => {
  const from = options.from || `"RedMecánica" <${process.env.SMTP_USER || 'no-reply@redmecanica.cl'}>`;
  
  const mailOptions = {
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const primaryTransporter = createTransporter(configuredPort);

  if (!primaryTransporter) {
    // if no SMTP credentials are configured we used to log and pretend the email
    // was sent. in production this hides configuration mistakes, so fail fast.
    logger.error('SMTP transporter not available – check SMTP_USER/SMTP_PASS environment variables');
    throw new Error('SMTP not configured');
  }

  try {
    const info = await primaryTransporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error: any) {
    const errorCode = error?.code;
    const retryable = errorCode === 'ETIMEDOUT' || errorCode === 'ECONNREFUSED' || errorCode === 'ESOCKET';

    if (!retryable) {
      logger.error({ error }, 'Error sending email');
      throw error;
    }

    const fallbackPort = getFallbackPort(configuredPort);
    const fallbackTransporter = createTransporter(fallbackPort);

    if (!fallbackTransporter) {
      logger.error({ error }, 'SMTP fallback unavailable');
      throw error;
    }

    logger.warn({ errorCode, configuredPort, fallbackPort }, 'SMTP primary failed, retrying with fallback port');

    try {
      const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
      logger.info(`Email sent with fallback port ${fallbackPort}: ${fallbackInfo.messageId}`);
      return fallbackInfo;
    } catch (fallbackError: any) {
      logger.error({ error, fallbackError }, 'Error sending email with primary and fallback SMTP ports');
      throw fallbackError;
    }
  }
};

export const sendContactNotification = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) => {
  const adminEmail = 'contacto@redmecanica.cl';
  
  const html = `
    <h2>Nuevo mensaje de contacto - RedMecánica</h2>
    <p><strong>De:</strong> ${contactData.name} <${contactData.email}></p>
    <p><strong>Teléfono:</strong> ${contactData.phone || 'No proporcionado'}</p>
    <p><strong>Asunto:</strong> ${contactData.subject}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${contactData.message.replace(/\n/g, '<br>')}</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[Contacto Web] ${contactData.subject}: ${contactData.name}`,
    html,
    text: `Nuevo mensaje de ${contactData.name} (${contactData.email})\nAsunto: ${contactData.subject}\n\nMensaje:\n${contactData.message}`
  });
};

export const sendLaunchLeadNotification = async (email: string) => {
  const adminEmail = 'contacto@redmecanica.cl';
  
  const html = `
    <h2>Nuevo registro de preventa - RedMecánica</h2>
    <p>Email: ${email}</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🚀 Nuevo Lead Lanzamiento: ${email}`,
    html,
    text: `Nuevo registro de preventa: ${email}`
  });
};

export const sendLaunchLeadConfirmation = async (userEmail: string) => {
  const html = `
    <h2>Gracias por registrarte en RedMecánica</h2>
    <p>¡Estamos preparando la plataforma! Te avisaremos por este correo cuando estemos en línea.</p>
    <p>Mientras tanto puedes seguirnos en nuestras redes sociales o contactarnos si tienes preguntas.</p>
  `;

  return sendEmail({
    to: userEmail,
    subject: '¡Gracias por tu interés! - RedMecánica',
    html,
    text: `Gracias por registrarte en RedMecánica. Te avisaremos cuando el servicio esté disponible.`
  });
};
