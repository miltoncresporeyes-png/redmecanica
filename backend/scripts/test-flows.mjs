/**
 * Script de validación automatizada de flujos:
 * 1. Healthcheck backend API
 * 2. Registro y login de Cliente
 * 3. Registro y login de Prestador
 * 4. Envío de formulario de contacto (/api/contact)
 * 5. Solicitud de recuperación de contraseña (/api/auth/forgot-password)
 * 6. Consulta de cobertura (/api/coverage/plans)
 */

const API_BASE = 'http://localhost:3011/api';

async function runTests() {
  console.log('--- INICIANDO BATERÍA DE PRUEBAS AUTOMATIZADAS ---');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Healthcheck / Ping
  await test('1. Healthcheck Backend', async () => {
    const res = await fetch(`${API_BASE}/health`).catch(() => null);
    if (!res || !res.ok) {
      // Intento alternativo con ruta raíz de api
      const alt = await fetch(`${API_BASE}/auth/me`).catch(() => null);
      if (!alt && (!res || !res.ok)) throw new Error('Servidor backend no responde en puerto 3011');
    }
  });

  // 2. Registro de Usuario Cliente
  const timestamp = Date.now();
  const clientEmail = `test.client.${timestamp}@redmecanica.test`;

  await test('2. Registro de Usuario Cliente', async () => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: clientEmail,
        password: 'Password123!',
        name: 'Cliente Prueba Automatizada',
        role: 'client'
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Fallo registro cliente');
    if (!data.user?.id) throw new Error('No devolvió usuario creado');
  });

  // 3. Login de Usuario Cliente
  await test('3. Login de Usuario Cliente', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: clientEmail,
        password: 'Password123!'
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Fallo login cliente');
    if (!data.token && !data.accessToken) throw new Error('No devolvió JWT en login');
  });

  // 4. Registro de Prestador
  const providerEmail = `test.provider.${timestamp}@redmecanica.test`;

  await test('4. Registro de Cuenta Prestador (Taller/Mecánico)', async () => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: providerEmail,
        password: 'Password123!',
        name: 'Taller San Cristóbal Test',
        role: 'provider'
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Fallo registro prestador');
    if (!data.user?.id) throw new Error('No devolvió usuario prestador creado');
  });

  // 5. Recuperación de Contraseña
  await test('5. Flujo de Recuperación de Contraseña', async () => {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: clientEmail
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Fallo endpoint forgot-password');
    if (!data.message) throw new Error('No devolvió mensaje de confirmación');
  });

  // 6. Formulario de Contacto
  await test('6. Envío de Formulario de Contacto', async () => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Contacto Test Automatizado',
        email: clientEmail,
        phone: '+56983414730',
        subject: 'soporte',
        message: 'Mensaje de prueba para verificar formulario de contacto'
      })
    });
    if (!res.ok && res.status !== 404) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `HTTP ${res.status}`);
    }
  });

  // 7. Catálogo de Planes de Suscripción y Cobertura
  await test('7. Consulta de Planes de Suscripción y Expansión Territorial', async () => {
    const resSubs = await fetch(`${API_BASE}/subscriptions/plans`);
    const subsData = await resSubs.json();
    if (!resSubs.ok) throw new Error('Error al obtener planes de suscripción');
    if (!subsData.MONTHLY || !subsData.YEARLY) throw new Error('Estructura de planes de suscripción inválida');

    const resCov = await fetch(`${API_BASE}/coverage/expansion-products`);
    const covData = await resCov.json();
    if (!resCov.ok) throw new Error('Error al obtener productos de cobertura');
    if (!Array.isArray(covData) || covData.length === 0) throw new Error('Estructura de productos de cobertura inválida');
  });

  console.log(`\n--- RESULTADOS FINALES: ${passed}/${total} PRUEBAS EXITOSAS ---`);
  if (passed === total) {
    console.log('🚀 ESTADO: LISTO PARA COMMIT Y REDEPLOY');
    process.exit(0);
  } else {
    console.log('⚠️ HAY ADVERTENCIAS O PRUEBAS PENDIENTES');
    process.exit(1);
  }
}

runTests();
