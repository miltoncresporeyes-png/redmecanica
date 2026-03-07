import nodemailer from 'nodemailer';
import { logger } from '../lib/logger.js';

const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  configuredPort: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  debugEnabled: process.env.SMTP_DEBUG === 'true',
});

/** Extrae los campos más relevantes de un error de nodemailer para logging. */
const extractSmtpError = (error: any) => ({
  code: error?.code,
  message: error?.message,
  response: error?.response,
  responseCode: error?.responseCode,
  command: error?.command,
});

/** Escapa caracteres especiales HTML para prevenir XSS en contenido de correos. */
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const createTransporter = (host: string, port: number, user?: string, pass?: string, debugEnabled = false) => {
  if (!user || !pass) {
    logger.warn('Email service: No SMTP credentials found. Emails will be logged to console but not sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    // Para port 587 (STARTTLS), forzar el upgrade TLS
    ...(port !== 465 && { requireTLS: true }),
    logger: debugEnabled,
    debug: debugEnabled,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    auth: {
      user,
      pass,
    },
    tls: {
      // no rechazar certificados invalidos para evitar ETIMEDOUT si TLS expira
      rejectUnauthorized: false,
    },
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
  const { host, configuredPort, user, pass, debugEnabled } = getSmtpConfig();
  const from = options.from || `"RedMecánica" <${process.env.SMTP_USER || 'no-reply@redmecanica.cl'}>`;
  
  const mailOptions = {
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const primaryTransporter = createTransporter(host, configuredPort, user, pass, debugEnabled);

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
      logger.error(
        { smtp: extractSmtpError(error), host, port: configuredPort },
        'Error sending email (non-retryable)',
      );
      throw error;
    }

    const fallbackPort = getFallbackPort(configuredPort);
    const fallbackTransporter = createTransporter(host, fallbackPort, user, pass, debugEnabled);

    if (!fallbackTransporter) {
      logger.error({ smtp: extractSmtpError(error) }, 'SMTP fallback unavailable');
      throw error;
    }

    logger.warn(
      { errorCode, host, configuredPort, fallbackPort },
      'SMTP primary failed, retrying with fallback port',
    );

    try {
      const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
      logger.info(`Email sent with fallback port ${fallbackPort}: ${fallbackInfo.messageId}`);
      return fallbackInfo;
    } catch (fallbackError: any) {
      logger.error(
        {
          primary: extractSmtpError(error),
          fallback: extractSmtpError(fallbackError),
          host,
          configuredPort,
          fallbackPort,
        },
        'Error sending email with primary and fallback SMTP ports',
      );
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
    <p><strong>De:</strong> ${escapeHtml(contactData.name)} &lt;${escapeHtml(contactData.email)}&gt;</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(contactData.phone || 'No proporcionado')}</p>
    <p><strong>Asunto:</strong> ${escapeHtml(contactData.subject)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(contactData.message).replace(/\n/g, '<br>')}</p>
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
