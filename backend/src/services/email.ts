
import nodemailer from 'nodemailer';
import { logger } from '../lib/logger.js';

// Configuración del trasportador
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    logger.warn('Email service: No SMTP credentials found. Emails will be logged to console but not sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user,
      pass,
    },
  });
};

const transporter = createTransporter();

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

  if (!transporter) {
    // if no SMTP credentials are configured we used to log and pretend the email
    // was sent. in production this hides configuration mistakes, so fail fast.
    logger.error('SMTP transporter not available – check SMTP_USER/SMTP_PASS environment variables');
    throw new Error('SMTP not configured');
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error: any) {
    logger.error({ error }, 'Error sending email');
    throw error;
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
