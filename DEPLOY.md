# Despliegue - RedMecanica

## Servicios Recomendados

| Servicio | Uso                                                           |
| -------- | ------------------------------------------------------------- |
| Frontend | Hosting estatico (Cloudflare Pages, Netlify, Hostinger, etc.) |
| Backend  | Railway                                                       |
| Database | Railway PostgreSQL                                            |
| Dominio  | .cl (NIC Chile)                                               |

---

## Backend (Railway)

1. Crear proyecto en Railway y conectar el repositorio.
2. Seleccionar el servicio backend (`backend/`).
3. Provisionar PostgreSQL dentro del mismo proyecto.
4. Configurar variables de entorno:

```env
PORT=3010
DATABASE_URL=postgres://...
ACCESS_TOKEN_SECRET=generar_string_aleatorio
REFRESH_TOKEN_SECRET=generar_string_aleatorio
FRONTEND_URL=https://tu-dominio.com
NODE_ENV=production
WEBPAY_COMMERCE_CODE=tu_codigo_comercio
WEBPAY_API_KEY=tu_api_key
WEBPAY_RETURN_URL=https://tu-dominio.com/payment/return
WEBPAY_FINAL_URL=https://tu-dominio.com/payment/final
```

5. Configurar comandos del servicio:
   - Build: `npm run build`
   - Start: `npm run start`
6. Ejecutar migraciones y seed desde shell del servicio:
   - `npx prisma migrate deploy`
   - `npx tsx prisma/seed.ts`

---

## Configuración de Correo (SMTP en Railway)

Para usar correos externos (ej. Hostinger o Gmail) en Railway, se deben configurar las siguientes variables de entorno:

- `SMTP_HOST`: ej. `smtp.hostinger.com`
- `SMTP_PORT`: Ej. `465` (SSL) o `587` (TLS)
- `SMTP_USER`: `tu_correo@tudominio.cl`
- `SMTP_PASS`: `tu_contraseña`

**Nota sobre fallos de conexión a Hostinger/Railway (Error -101 ESOCKET)**:
Railway puede presentar problemas de timeout en conexiones DNS para servidores que resuelvan direcciones IPv6 (como Hostinger usando Cloudflare) si el contenedor no tiene correctamente enrutada la salida a internet a través de IPv6. El backend ya está parcheado a nivel de código (`node:dns -> ipv4first`) para mitigar este comportamiento al forzar conexiones vía IPv4.

---

## Frontend

1. Conectar el repositorio en tu proveedor de hosting estatico.
2. Configurar:
   - Build command: `npm run build --prefix frontend`
   - Output directory: `frontend/dist`
3. Definir variable de entorno:
   - `VITE_API_URL=https://tu-backend.up.railway.app/api`

---

## Verificacion

- Frontend: `https://tu-dominio.cl`
- Backend API: `https://tu-backend.up.railway.app/api`
- Health: `https://tu-backend.up.railway.app/`

---

## Notas

- El sistema usa JWT y CORS por `FRONTEND_URL`.
- Railway asigna `PORT` automaticamente si no lo defines.
- Para produccion, usar credenciales reales de Webpay Plus.
