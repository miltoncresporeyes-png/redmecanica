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
    <h2>Verificación de correo - RedMecánica</h2>
    <p>Hola ${escapeHtml(userName)}, recibimos un registro reciente. Usa este código de 6 dígitos una sola vez para validar tu correo:</p>
    <p style="font-size: 18px; font-weight: 700; letter-spacing: 1px;">${escapeHtml(verificationCode)}</p>
    <p>El código expira en 10 minutos y el sistema lo almacena cifrado con AES para proteger tu privacidad.</p>
    <p>Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>
  `;

  return sendEmail({
    to: userEmail,
    subject: "Tu código de seguridad RedMecánica",
    html,
    text: `Hola ${userName}. Tu código de seguridad para RedMecánica es: ${verificationCode}. Expira en 10 minutos.`,
  });
};

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}) => {
  const from =
    options.from ||
    `"RedMecánica" <${process.env.SMTP_USER || "no-reply@redmecanica.cl"}>`;

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
) => {
  const html = `
    <h2>Gracias por registrarte en RedMecánica</h2>
    <p>¡Estamos preparando la plataforma! Te avisaremos por este correo cuando estemos en línea.</p>
    <p><strong>Número de ticket:</strong> ${escapeHtml(ticket)}</p>
    <p>Mientras tanto puedes seguirnos en nuestras redes sociales o contactarnos si tienes preguntas.</p>
  `;

  return sendEmail({
    to: userEmail,
    subject: "¡Gracias por tu interés! - RedMecánica",
    html,
    text: `Gracias por registrarte en RedMecánica. Te avisaremos cuando el servicio esté disponible. Tu ticket es: ${ticket}.`,
  });
};
