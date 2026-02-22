# 🚀 Despliegue - RedMecánica

## Servicios Recomendados

| Servicio | Uso | Costo |
|----------|-----|-------|
| **Frontend** | Vercel | Gratis |
| **Backend** | Render | Gratis |
| **Database** | Render PostgreSQL | Gratis |
| **Dominio** | .cl (NIC Chile) | ~$15/año |

---

## Frontend (Vercel)

1. **Subir a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Conectar a Vercel**:
   - Ir a https://vercel.com
   - Importar repositorio
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Variables de entorno en Vercel**:
   - `VITE_API_URL`: URL del backend (ej: https://redmecanica-backend.onrender.com/api)

---

## Backend (Render)

1. **Crear Web Service**:
   - Ir a https://render.com
   - New → Web Service
   - Conectar repositorio GitHub
   - Build command: `npm install`
   - Start command: `npm run start`

2. **Crear PostgreSQL**:
   - New → PostgreSQL
   - Copiar URL de conexión

3. **Variables de entorno**:
   ```
   PORT=3010
   DATABASE_URL=postgres://...
   ACCESS_TOKEN_SECRET=generar_string_aleatorio
   REFRESH_TOKEN_SECRET=generar_string_aleatorio
   FRONTEND_URL=https://tu-dominio.vercel.app
   NODE_ENV=production
   ```

4. **Ejecutar migrate y seed**:
   - En Render, abrir shell del servicio
   - `npx prisma migrate deploy`
   - `npx tsx prisma/seed.ts`

---

## Dominio Personalizado

1. Comprar dominio en NIC Chile
2. Configurar DNS en Vercel (A record)
3. HTTPS automático (incluido)

---

## Verificación

- Frontend: https://tu-dominio.cl
- Backend: https://tu-backend.onrender.com/api
- Health: https://tu-backend.onrender.com/

---

## Notas

- El sistema usa autenticación JWT con cookies httpOnly
- CORS configurado para permitir el frontend
- Para producción real, configurar Webpay Plus (Transbank)

---

## 🔐 Configuración de Webpay Plus

### Obtener Credenciales

1. Ir a https://www.transbankdevelopers.cl/
2. Crear cuenta de desarrollador
3. Solicitar cuenta comercial Webpay Plus
4. Obtener códigos de integración:
   - `commerceCode`: Código de comercio
   - `apiKey`: Clave secreta

### Configuración en Producción

Agregar variables de entorno en Render:
```
WEBPAY_COMMERCE_CODE=tu_codigo_comercio
WEBPAY_API_KEY=tu_api_key
WEBPAY_RETURN_URL=https://tu-dominio.com/payment/return
WEBPAY_FINAL_URL=https://tu-dominio.com/payment/final
```

### Modo Prueba

El sistema funciona en modo simulación sin credenciales reales.
Para probar el flujo completo, usa las credenciales de integración de Transbank.

### Comisiones Webpay

- Tarifa: 2.95% + $100 por transacción
- Depósito: D+1 (al día siguiente)
- No hay costo de setup ni mantención mensual
