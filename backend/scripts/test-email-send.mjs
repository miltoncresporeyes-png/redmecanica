/**
 * Script de prueba de despacho real de correos electrónicos
 * Prueba 1: Notificación de Bienvenida/Registro de Usuario (desde notificaciones@redmecanica.cl hacia contacto@redmecanica.cl)
 * Prueba 2: Notificación de Mensaje de Contacto Web (recibida en contacto@redmecanica.cl)
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { 
  sendWelcomeRegistrationEmail, 
  sendContactNotification, 
  NOTIFICATIONS_EMAIL, 
  CONTACT_EMAIL 
} from '../src/services/email.js';

async function runEmailTests() {
  console.log('====================================================');
  console.log('   PRUEBA DE DESPACHO DE CORREOS - REDMECÁNICA       ');
  console.log('====================================================');
  console.log(`Remitente por defecto (Notificaciones): ${NOTIFICATIONS_EMAIL}`);
  console.log(`Buzón de Atención / Consultas (Contacto): ${CONTACT_EMAIL}`);
  console.log(`Host SMTP: ${process.env.SMTP_HOST || 'smtp.hostinger.com'}:${process.env.SMTP_PORT || '465'}`);
  console.log('----------------------------------------------------');

  // Test 1: Correo de Bienvenida de Usuario (Enviado desde notificaciones@redmecanica.cl)
  // Se envía a contacto@redmecanica.cl para verificar recepción real en la bandeja
  console.log('\n[1/2] Enviando correo de prueba de Registro/Bienvenida a contacto@redmecanica.cl...');
  try {
    const res1 = await sendWelcomeRegistrationEmail(
      'contacto@redmecanica.cl',
      'Equipo RedMecánica (Test Registro)',
      'CLIENT'
    );
    console.log('✅ [ÉXITO] Correo de bienvenida despachado correctamente:', res1);
  } catch (err) {
    console.error('❌ [ERROR] Falló envío de correo de bienvenida:', err.message);
  }

  // Test 2: Correo de Notificación de Contacto Web
  console.log('\n[2/2] Enviando correo de prueba de Formulario de Contacto Web a contacto@redmecanica.cl...');
  try {
    const res2 = await sendContactNotification({
      name: 'Cliente Prueba Test',
      email: 'notificaciones@redmecanica.cl',
      phone: '+56 9 8341 4730',
      subject: 'Consulta Técnica de Marketplace',
      message: 'Este es un mensaje de prueba automática para verificar que el buzón contacto@redmecanica.cl recibe las consultas con el remitente configurado.'
    });
    console.log('✅ [ÉXITO] Correo de contacto despachado correctamente:', res2);
  } catch (err) {
    console.error('❌ [ERROR] Falló envío de correo de contacto:', err.message);
  }

  console.log('\n====================================================');
  console.log('   PRUEBAS FINALIZADAS                             ');
  console.log('====================================================');
}

runEmailTests();
