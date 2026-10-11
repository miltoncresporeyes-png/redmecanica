import nodemailer from "nodemailer";
import crypto from "node:crypto";
import { logger } from "../lib/logger.js";
import { Resend } from "resend";

const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  configuredPort: parseInt(process.env.SMTP_PORT || "587"),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  debugEnabled: process.env.SMTP_DEBUG === "true",
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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const createTransporter = (
  host: string,
  port: number,
  user?: string,
  pass?: string,
  debugEnabled = false,
) => {
  if (!user || !pass) {
    logger.warn(
      "Email service: No SMTP credentials found. Emails will be logged to console but not sent.",
    );
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

const getVerificationKey = () =>
  crypto
    .createHash("sha256")
    .update(
      process.env.EMAIL_VERIFICATION_SECRET ||
        process.env.ACCESS_TOKEN_SECRET ||
        "redmecanica-email-verification",
    )
    .digest();

export const encryptVerificationCode = (code: string) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getVerificationKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(code, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
};

export const decryptVerificationCode = (payload: string) => {
  const [ivPart, authTagPart, encryptedPart] = payload.split(".");

  if (!ivPart || !authTagPart || !encryptedPart) {
    throw new Error("Verification token malformed");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getVerificationKey(),
    Buffer.from(ivPart, "base64url"),
  );

  decipher.setAuthTag(Buffer.from(authTagPart, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, "base64url")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

export const sendVerificationCodeEmail = async (
  userEmail: string,
  userName: string,
  verificationCode: string,
) => {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1e3a8a; margin: 0; font-size: 24px; font-weight: 800;">RedMecánica</h1>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Notificaciones Oficiales</p>
      </div>
      <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">Verificación de correo electrónico</h2>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">Hola <strong>${escapeHtml(userName)}</strong>, recibimos tu solicitud de registro. Ingresa el siguiente código de seguridad para validar tu cuenta:</p>
      <div style="background-color: #f8fafc; border: 1px dashed #3b82f6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
        <span style="font-size: 26px; font-weight: 800; letter-spacing: 4px; color: #1d4ed8;">${escapeHtml(verificationCode)}</span>
      </div>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5;">Este código es de un solo uso y expira en 10 minutos. Si no intentaste crear una cuenta en RedMecánica, puedes desestimar este mensaje.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px;">
        <p style="color: #1e40af; font-size: 12px; margin: 0; line-height: 1.5;">
          <strong>¿Tienes dudas o necesitas asistencia?</strong><br>
          Este correo es generado por nuestra casilla automatizada <em>notificaciones@redmecanica.cl</em>. Para soporte, dudas o consultas comerciales, comunícate directamente con nuestro equipo a <a href="mailto:contacto@redmecanica.cl" style="color: #2563eb; font-weight: bold; text-decoration: underline;">contacto@redmecanica.cl</a> o a nuestro WhatsApp oficial +56 9 8341 4730.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: "Tu código de seguridad - RedMecánica",
    html,
    text: `Hola ${userName}.\n\nTu código de verificación para RedMecánica es: ${verificationCode} (expira en 10 minutos).\n\nEste correo se envía desde notificaciones@redmecanica.cl. Para cualquier consulta o asistencia, contáctanos a contacto@redmecanica.cl.`,
    from: `"RedMecánica Notificaciones" <${process.env.SMTP_USER || "notificaciones@redmecanica.cl"}>`,
    replyTo: "contacto@redmecanica.cl",
  });
};

export const sendWelcomeRegistrationEmail = async (
  userEmail: string,
  userName: string,
  userRole: "USER" | "MECHANIC" | "CLIENT" | "WORKSHOP" = "USER",
) => {
  const isProvider = userRole === "MECHANIC" || userRole === "WORKSHOP";
  const portalName = isProvider ? "Portal de Talleres y Mecánicos" : "RedMecánica Automotriz";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1e3a8a; margin: 0; font-size: 24px; font-weight: 800;">RedMecánica</h1>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Notificaciones Oficiales</p>
      </div>
      <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">¡Bienvenido a ${escapeHtml(portalName)}!</h2>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">Hola <strong>${escapeHtml(userName)}</strong>,</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        ${isProvider 
          ? "Tu cuenta de prestador ha sido registrada exitosamente. Ya puedes acceder a configurar tus comunas de atención, servicios y comenzar a recibir solicitudes de clientes."
          : "Tu cuenta de cliente ha sido registrada exitosamente. Ahora podrás cotizar con talleres mecánicos verificados, solicitar auxilio y agendar mantenciones con total transparencia."
        }
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://redmecanica.cl" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Ingresar a RedMecánica</a>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px;">
        <p style="color: #1e40af; font-size: 12px; margin: 0; line-height: 1.5;">
          <strong>¿Tienes alguna consulta o necesitas ayuda?</strong><br>
          Este aviso ha sido enviado automáticamente desde <em>notificaciones@redmecanica.cl</em>.<br>
          Cualquier duda, consulta técnica o requerimiento comercial, por favor escríbenos directamente a <a href="mailto:contacto@redmecanica.cl" style="color: #2563eb; font-weight: bold; text-decoration: underline;">contacto@redmecanica.cl</a> o a nuestro WhatsApp oficial +56 9 8341 4730.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: `¡Bienvenido a RedMecánica, ${userName}!`,
    html,
    text: `Hola ${userName}.\n\n¡Bienvenido a RedMecánica! Tu cuenta (${isProvider ? 'Prestador' : 'Cliente'}) ha sido registrada exitosamente.\n\nPuedes ingresar en https://redmecanica.cl\n\nEste correo fue enviado desde notificaciones@redmecanica.cl. Recuerda que para cualquier consulta debes escribirnos a contacto@redmecanica.cl.`,
    from: `"RedMecánica Notificaciones" <${process.env.SMTP_USER || "notificaciones@redmecanica.cl"}>`,
    replyTo: "contacto@redmecanica.cl",
  });
};

export const NOTIFICATIONS_EMAIL = process.env.SMTP_USER || "notificaciones@redmecanica.cl";
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contacto@redmecanica.cl";

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}) => {
  const from =
    options.from ||
    `"RedMecánica Notificaciones" <${NOTIFICATIONS_EMAIL}>`;
  const replyTo = options.replyTo || CONTACT_EMAIL;

  // In development/test environments or for RFC 2606 test domains (.test, .example), log and bypass real delivery
  if (options.to.endsWith('.test') || options.to.endsWith('.example') || process.env.NODE_ENV === 'test') {
    logger.info(`[Email Service] Simulación de envío exitoso a dominio de prueba: ${options.to} (${options.subject})`);
    return { messageId: `mock-${Date.now()}` };
  }

  // Use Resend HTTP API if configured (avoids SMTP port blockages in production)
  if (process.env.RESEND_API_KEY) {
    try {
      logger.info("Using Resend API to send email");
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const response = await resend.emails.send({
        from,
        to: [options.to],
        subject: options.subject,
        html: options.html || options.text || "",
        text: options.text || "",
      });

      if (response.error) {
        logger.error({ error: response.error }, "Resend API returned error");
        throw new Error(response.error.message);
      }

      logger.info(`Email sent via Resend successfully: ${response.data?.id}`);
      return response.data;
    } catch (resendError: any) {
      logger.warn(
        { resendError: resendError?.message || resendError },
        "Resend failed, falling back to standard SMTP"
      );
    }
  }

  const { host, configuredPort, user, pass, debugEnabled } = getSmtpConfig();

  const mailOptions = {
    from,
    replyTo,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const primaryTransporter = createTransporter(
    host,
    configuredPort,
    user,
    pass,
    debugEnabled,
  );

  if (!primaryTransporter) {
    // if no SMTP credentials are configured we used to log and pretend the email
    // was sent. in production this hides configuration mistakes, so fail fast.
    logger.error(
      "SMTP transporter not available – check SMTP_USER/SMTP_PASS environment variables",
    );
    throw new Error("SMTP not configured");
  }


  try {
    const info = await primaryTransporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error: any) {
    const errorCode = error?.code;
    const retryable =
      errorCode === "ETIMEDOUT" ||
      errorCode === "ECONNREFUSED" ||
      errorCode === "ESOCKET";

    if (!retryable) {
      logger.error(
        { smtp: extractSmtpError(error), host, port: configuredPort },
        "Error sending email (non-retryable)",
      );
      throw error;
    }

    const fallbackPort = getFallbackPort(configuredPort);
    const fallbackTransporter = createTransporter(
      host,
      fallbackPort,
      user,
      pass,
      debugEnabled,
    );

    if (!fallbackTransporter) {
      logger.error(
        { smtp: extractSmtpError(error) },
        "SMTP fallback unavailable",
      );
      throw error;
    }

    logger.warn(
      { errorCode, host, configuredPort, fallbackPort },
      "SMTP primary failed, retrying with fallback port",
    );

    try {
      const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
      logger.info(
        `Email sent with fallback port ${fallbackPort}: ${fallbackInfo.messageId}`,
      );
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
        "Error sending email with primary and fallback SMTP ports",
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
  const adminEmail = "contacto@redmecanica.cl";

  const html = `
    <h2>Nuevo mensaje de contacto - RedMecánica</h2>
    <p><strong>De:</strong> ${escapeHtml(contactData.name)} &lt;${escapeHtml(contactData.email)}&gt;</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(contactData.phone || "No proporcionado")}</p>
    <p><strong>Asunto:</strong> ${escapeHtml(contactData.subject)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(contactData.message).replace(/\n/g, "<br>")}</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[Contacto Web] ${contactData.subject}: ${contactData.name}`,
    html,
    text: `Nuevo mensaje de ${contactData.name} (${contactData.email})\nAsunto: ${contactData.subject}\n\nMensaje:\n${contactData.message}`,
  });
};

export const sendLaunchLeadNotification = async (
  email: string,
  ticket: string,
) => {
  const adminEmail = "contacto@redmecanica.cl";

  const html = `
    <h2>Nuevo registro de preventa - RedMecánica</h2>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Ticket:</strong> ${escapeHtml(ticket)}</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🚀 Nuevo Lead Lanzamiento [${ticket}]`,
    html,
    text: `Nuevo registro de preventa\nEmail: ${email}\nTicket: ${ticket}`,
  });
};

export const sendLaunchLeadConfirmation = async (
  userEmail: string,
  ticket: string,
  discountCode?: string,
) => {
  const html = `
    <h2>Gracias por registrarte en RedMecánica</h2>
    <p>¡Estamos preparando la plataforma! Te avisaremos por este correo cuando estemos en línea.</p>
    <p><strong>Número de ticket:</strong> ${escapeHtml(ticket)}</p>
    ${discountCode ? `
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <h3 style="margin-top: 0; color: #1f2937;">Tu Código de Descuento Exclusivo</h3>
      <p style="margin-bottom: 10px;">Guarda este código seguro generado para ti. Úsalo cuando lancemos la plataforma para obtener beneficios:</p>
      <div style="background-color: #ffffff; border: 2px dashed #3b82f6; padding: 10px; font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 2px;">
        ${escapeHtml(discountCode)}
      </div>
    </div>
    ` : ''}
    <p>Mientras tanto puedes seguirnos en nuestras redes sociales o contactarnos si tienes preguntas.</p>
  `;

  return sendEmail({
    to: userEmail,
    subject: "¡Gracias por tu interés! - RedMecánica",
    html,
    text: `Gracias por registrarte en RedMecánica. Te avisaremos cuando el servicio esté disponible. Tu ticket es: ${ticket}.${discountCode ? `\nTu código de descuento exclusivo es: ${discountCode}` : ''}`,
  });
};
