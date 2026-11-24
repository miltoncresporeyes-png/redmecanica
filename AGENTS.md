# RedMecánica — Contexto común

Este archivo lo leen todas las herramientas y agentes que trabajan en el proyecto (Claude Code, Codex, Cursor, etc.).
`CLAUDE.md` apunta aquí. Si algo de este archivo deja de ser cierto, **corrígelo en el mismo cambio** que lo invalida.

## 1. Objetivo del producto

RedMecánica es un **marketplace automotriz** (hoy en Chile, pensado para escalar a otros países). Conecta a
conductores con prestadores de servicios (mecánicos a domicilio, talleres, grúas y auxilio, seguros).

- **Cliente / conductor:** busca y compara vitrinas, y contacta **directo por WhatsApp o teléfono**, sin cuenta y sin pagar.
  Con cuenta además puede pedir cotizaciones, hacer seguimiento de servicios, guardar vehículos y ver facturas.
- **Prestador:** publica una **vitrina** (gratis), recibe solicitudes, cotiza, gestiona servicios, su horario y su cobertura.
- **Administrador:** modera prestadores, ve estadísticas reales y la auditoría.
- **Modelo de negocio:** **no se cobra comisión** por servicios ni contactos (`platformFeePercent = 0`). Se monetiza con
  planes de visibilidad para prestadores: Vitrina Gratis · Destacado ($15.000/mes o $150.000/año) · Taller Premium ($500.000/año) ·
  Empresarial (a convenir). Los beneficios de cada plan se definen **solo** en `frontend/src/config/plans.ts`.
- Sitio: <https://redmecanica.cl> · API: Railway (`backend-production-f294e.up.railway.app`; subdominio previsto
  `api.redmecanica.cl`, ver `docs/api-subdominio.md`).

### Reglas de negocio que no deben romperse
- **Honestidad de las promesas:** lo que un plan o una pantalla promete debe ser cierto y visible para el prestador.
  Si algo aún no existe, se rotula "Próximamente"; nunca como incluido. Sin reseñas, ratings ni métricas inventadas.
- **Estados del prestador** (`ServiceProvider.status`), definidos en `backend/src/lib/providerStatus.ts`:
  `PENDING` (sin publicar) → `ACTIVE` (publicada, sin verificar) → `APPROVED` (publicada y **verificada**);
  también `PAUSED` (la pausa el prestador), `SUSPENDED` (sanción de un administrador), `REJECTED`, `UNDER_REVIEW`.
  Es visible quien está `ACTIVE` o `APPROVED`. Un administrador puede suspender, rechazar o revocar.
- **Verificación estilo Alibaba:** con cédula y certificado de antecedentes presentados, la vitrina publicada pasa a
  `APPROVED` automáticamente; sin documentos queda publicada igual (solo aparece, sin insignia).
- **Plan efectivo** (`backend/src/lib/plans.ts`): un plan de pago solo cuenta si la suscripción está `ACTIVE` y no venció;
  si no, el prestador se trata como gratuito (orden, insignia, estadísticas, cupo de comunas: 1 / 3 / 10).
- **Anuncios Destacados** (portada): primero planes de pago vigentes; se completa con las últimas vitrinas publicadas hasta 5.
- Los clientes **nunca** pagan por buscar, comparar o contactar.

## 2. Stack tecnológico

Monorepo con npm workspaces: `backend`, `frontend`, `shared`. App móvil aparte en `mobile/`.

| Capa | Tecnología |
|---|---|
| Frontend web | React 19, Vite 6, TypeScript 5.8, Tailwind CSS 3, react-router 7, axios, lucide-react, react-helmet-async, i18next / react-i18next |
| Backend | Node 20+, Express 5, TypeScript 5.9, Zod 4, JWT, bcrypt, socket.io (chat/notificaciones) |
| Acceso a datos | Prisma 7 (`@prisma/adapter-pg`) + SQL crudo (`$queryRaw`) en rutas críticas |
| Base de datos | **PostgreSQL** (en Railway) |
| Compartido | `shared/` (tipos, esquemas y utilidades como el validador de RUT) |
| Móvil | Expo / React Native (`mobile/`) |
| Pagos | Webpay y Mercado Pago (Webpay requiere `WEBPAY_COMMERCE_CODE` y `WEBPAY_API_KEY`) |
| Autenticación | Correo + contraseña con verificación por OTP, Google Identity Services, recuperación de contraseña |
| Despliegue | Backend en **Railway** (`railway.json`, Nixpacks); frontend estático en **Hostinger** (despliegue por git) |

### Base de datos
- Esquema en `backend/prisma/schema.prisma`. Modelos principales: `User`, `ServiceProvider`, `Subscription`, `Vehicle`,
  `ServiceRequest`, `Quote`, `Job`, `Invoice`, `Review`, `Conversation`/`Message`, `Notification`, `ProviderCoverage`,
  `ProviderAvailability`, `ProviderEvent` (visitas y contactos), `ProviderHistory`, `AuditLog`.
- ⚠️ **La base local apunta a la misma base que producción.** No ejecutes escrituras, migraciones ni borrados contra ella
  sin autorización explícita del dueño del proyecto. Los cambios de esquema se entregan como SQL en
  `backend/prisma/manual/` (el despliegue **no** corre migraciones; se aplican a mano). Deben ser aditivos y con reversa.
- Al probar, no crees ni borres cuentas reales (p. ej. la del prestador J&K Mechanics).

### Puertos y entorno local
- Backend: **3011** (`PORT=3011`; el puerto 3000 lo usa otro proyecto del equipo). Frontend dev: **5290**, con proxy a `/api`.
- Variables: `backend/.env` (no se versiona), `backend/.env.example`, `frontend/.env.local`.
  Variables relevantes: `GOOGLE_CLIENT_ID`, `FRONTEND_URL`, `COOKIE_SAMESITE`, `DEFAULT_MARKET`, `VITE_API_URL`.
- Nunca imprimas, copies ni subas secretos, tokens ni credenciales.

### Comandos
```
npm install                       # todo el monorepo
npm run build:backend             # shared + prisma generate + tsc
npm run build:frontend            # shared + vite build
npm start                         # backend compilado (dist/server.js)
cd frontend && npm run dev        # vite en :5290
cd frontend && npx tsc --noEmit   # tipos del frontend
cd backend  && npx tsc --noEmit   # tipos del backend
```
Antes de dar algo por terminado: compila ambos lados y revisa el flujo en el navegador cuando haya cambios de interfaz.

## 3. Estructura

```
backend/src/
  routes/        endpoints Express (auth, providers, jobs, quotes, payments, admin, coverage, ...)
  lib/           reglas de negocio puras: providerStatus, plans, pgJson, passwordReset
  config/        markets.ts (configuración por país), pricing.ts
  middlewares/   requireAuth, rateLimiter, errorHandler
  services/      email, geolocalización
  utils/         auth (JWT, cookies), taxId (documento tributario por país)
frontend/src/
  pages/         pantallas públicas y admin
  features/      módulos por dominio (providers, jobs, auth, account, chat, notifications)
  components/    UI compartida y landing
  config/        market.ts (mercado), plans.ts (beneficios de planes)
  i18n/          es.json, en.json
  lib/           http (axios), apiBase, cache (SWR en localStorage), trackProvider
  utils/         money, documentFile
```

## 4. Reglas de estilo

### Idioma y tono
- **Todo texto visible al usuario va en español** (Chile), claro y directo, tuteando. El código, los identificadores y los
  mensajes de commit técnicos también pueden ir en español; sé consistente con el archivo que editas.
- Textos nuevos o migrados usan `t('clave')` con `frontend/src/i18n/{es,en}.json`. Para vocabulario por país usa el mercado
  (`useMarket()`: `zoneLabel`, `taxIdLabel`, `documents`) en vez de escribir "comuna", "RUT" o "Cédula" a mano.
- Dinero: siempre `formatMoney()` (`utils/money.ts`); la moneda y el locale salen del mercado. Nada de `$` + `toLocaleString` suelto en código nuevo.

### Diseño (frontend)
- **Tailwind con tokens**, no colores ni radios sueltos: `primary` (azul), `accent` (ámbar), `rounded-control`, `rounded-card`,
  y las clases de componentes `.btn-primary`, `.btn-cta`, `.btn-ghost`, `.btn-whatsapp`, `.btn-dark`, `.input-market`, `.card-market`.
  Definidos en `frontend/src/index.css` y `frontend/tailwind.config.js`.
- **Móvil primero:** la mayoría del tráfico es móvil. Objetivos táctiles de al menos 44 px, sin scroll horizontal.
- **Información justa y precisa:** una pantalla = una tarea. En el panel del prestador, 4 destinos (Inicio, Solicitudes, Mi negocio, Cuenta);
  muestra solo lo que requiere acción. No agregues métricas ni secciones de relleno.
- **Accesibilidad:** HTML semántico, `aria-label`/`aria-labelledby`, foco visible, contraste suficiente, `sr-only` donde corresponda.
- La vitrina pública debe verse **completa sin scroll en escritorio**; lo que la alargaría (reputación, similares) va debajo.
- Íconos: `lucide-react`. Sin emojis como íconos funcionales en código nuevo.

### Código
- TypeScript estricto; no uses `any` en código nuevo salvo donde ya es el patrón (respuestas SQL crudas).
- Validación de entrada con **Zod** en el backend; nunca confíes en datos del cliente (la verificación del token de Google,
  los roles y los montos se validan en el servidor).
- **Rendimiento del panel:** una sola consulta SQL con `jsonb_build_object` en vez de muchas consultas Prisma
  (Prisma 7 con adapter-pg no hace joins en `include`). Usa `withUtc()` (`lib/pgJson.ts`) para devolver timestamps con `Z`.
  El frontend muestra el último panel en caché (`lib/cache.ts`) y refresca en segundo plano.
- **Llamadas a la API:** siempre por `lib/http.ts` o `services/api.ts` (usan `lib/apiBase.ts`). El hosting estático **no** sirve `/api`.
- Las respuestas públicas **no** exponen datos privados (hash de contraseña, correo, documentos, `userId` ajeno). Usa `select` explícito.
- Los documentos de verificación no se devuelven nunca al público; hoy se guardan como data URL en Postgres (deuda: moverlos a almacenamiento de objetos).
- Seguridad: limitadores de tasa en endpoints públicos, errores sin filtrar detalles internos, cookies de sesión `httpOnly`
  (`SameSite=None; Secure` en producción hasta tener el subdominio propio de la API).
- Mensajes de error al usuario: en español, accionables, sin jerga técnica.

### Cambios y colaboración
- **No hagas commit ni push sin que te lo pidan.** Cuando lo pidan: mensaje en español con el tipo (`feat`, `fix`, ...) y el porqué.
  Prefiere ramas para cambios grandes; `main` despliega.
- No toques `.claude/`, `.env*` ni archivos de secretos en commits.
- Cambios de base de datos: SQL manual aditivo en `backend/prisma/manual/` con su reversa en comentario; avisa que debe aplicarse a mano.
- Documentación: este archivo y `docs/` son la fuente de verdad. Los `.md` sueltos de la raíz son históricos y pueden estar desactualizados.
