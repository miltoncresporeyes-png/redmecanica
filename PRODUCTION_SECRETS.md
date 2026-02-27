# 🔐 Generador de Secrets para Producción

Este documento te ayuda a generar los valores secretos necesarios para el archivo `.env` de producción.

## 🎲 Generar JWT Secrets

Los secrets JWT deben ser strings aleatorios fuertes de al menos 64 caracteres.

### Opción 1: Node.js (Recomendado)

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ejecuta este comando DOS veces para obtener:

1. `ACCESS_TOKEN_SECRET`
2. `REFRESH_TOKEN_SECRET`

### Opción 2: OpenSSL (Linux/Mac)

```bash
openssl rand -hex 64
```

### Opción 3: PowerShell (Windows)

```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Opción 4: Generador Online

Usa cualquier generador de secrets confiable con 64+ caracteres.

⚠️ **IMPORTANTE**:

- NO compartas estos secrets con nadie
- NO los subas a Git
- Usa valores DIFERENTES en desarrollo y producción
- Guárdalos en un lugar seguro (gestor de contraseñas)

---

## 📊 Ejemplo de configuración completa

Aquí hay un ejemplo de cómo debería verse tu `.env` de producción:

```env
# Server
PORT=3010
NODE_ENV=production

# Database
DATABASE_URL="postgresql://redmecanica:LLZMPV9yO9BoT1UwiLqy1qTVxR8y4Bhr@dpg-d6dq873h46gs73d5jq20-a/redmecanica"

# JWT Secrets - REEMPLAZAR CON LOS GENERADOS
ACCESS_TOKEN_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
REFRESH_TOKEN_SECRET="z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8"

# Frontend
FRONTEND_URL="https://tudominio.com"

# Opcional - AI
GEMINI_API_KEY="AIzaSy..."

# Transbank Webpay (producción)
WEBPAY_COMMERCE_CODE="597055555532"
WEBPAY_API_KEY="579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
WEBPAY_RETURN_URL="https://tudominio.com/payment/return"
WEBPAY_FINAL_URL="https://tudominio.com/payment/final"

# Maps
MAPS_PROVIDER="mapbox"
MAPS_API_KEY="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example"
```

---

## 🔒 Seguridad - Checklist

- [ ] Los secrets JWT son diferentes entre desarrollo y producción
- [ ] Los secrets tienen al menos 64 caracteres
- [ ] La `DATABASE_URL` usa el usuario y contraseña correcto de PostgreSQL
- [ ] La `FRONTEND_URL` apunta al dominio correcto (sin `/` al final)
- [ ] Las credenciales de Webpay son las de PRODUCCIÓN (no integración)
- [ ] El archivo `.env` NO está en Git (verificar `.gitignore`)
- [ ] Tienes un backup seguro de estos valores

---

## 📝 Comandos útiles

### Verificar que .env NO esté en Git

```bash
git check-ignore backend/.env
# Debería mostrar: backend/.env
```

### Agregar .env al .gitignore (si no está)

```bash
echo "*.env" >> .gitignore
echo "*.env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### Verificar conexión a base de datos

```bash
cd backend
npx prisma db pull
# Si funciona, la conexión es correcta
```

---

## 🆘 Troubleshooting

### Error: "JWT secret must be at least 32 characters"

➡️ Genera un nuevo secret con mínimo 64 caracteres usando los comandos de arriba.

### Error: "Cannot connect to database"

➡️ Verifica:

1. PostgreSQL está corriendo: `sudo systemctl status postgresql`
2. El usuario existe: `sudo -u postgres psql -c "\du"`
3. La base de datos existe: `sudo -u postgres psql -c "\l"`
4. La contraseña es correcta
5. El puerto es 5432 (por defecto)

### Error: "CORS policy error"

➡️ Verifica que `FRONTEND_URL` en `.env` coincida EXACTAMENTE con tu dominio:

- ✅ Correcto: `https://tudominio.com`
- ❌ Incorrecto: `https://tudominio.com/`
- ❌ Incorrecto: `http://tudominio.com` (debe ser HTTPS)

---

## 🎯 Valores específicos por servicio

### Webpay Plus (Transbank)

**Modo Integración (pruebas)**:

```env
WEBPAY_COMMERCE_CODE="597055555532"
WEBPAY_API_KEY="579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
```

**Modo Producción**:

- Registrarse en: https://www.transbankdevelopers.cl/
- Solicitar credenciales de producción
- Proceso toma ~3-5 días hábiles
- Requiere:
  - RUT de empresa
  - Comprobante de inicio de actividades
  - Certificado de vigencia

### Mapbox

1. Crear cuenta en: https://account.mapbox.com/
2. Obtener token de acceso público
3. Copiar en `MAPS_API_KEY`

Token de prueba:

```env
MAPS_API_KEY="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example"
```

### Google AI (Gemini)

1. Crear proyecto en: https://console.cloud.google.com/
2. Habilitar Gemini API
3. Crear credencial (API Key)
4. Copiar en `GEMINI_API_KEY`

**IMPORTANTE**: Esta API tiene cuota gratuita limitada. Monitorear uso en:
https://console.cloud.google.com/billing

---

¡Todo listo para producción! 🚀
