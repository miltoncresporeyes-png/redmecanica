# 📦 Archivos de Deployment - RedMecánica para Hostinger

## ✅ Todo Listo para Producción

He preparado todos los archivos necesarios para deployar RedMecánica en Hostinger. Aquí está el resumen completo:

---

## 📂 Archivos Creados

### 📘 Documentación

| Archivo                     | Descripción                                  | Prioridad           |
| --------------------------- | -------------------------------------------- | ------------------- |
| **HOSTINGER_DEPLOY.md**     | 📖 Guía completa paso a paso (120+ líneas)   | ⭐⭐⭐ LEER PRIMERO |
| **DEPLOY_QUICK_START.md**   | 🚀 Inicio rápido (resumen ejecutivo)         | ⭐⭐⭐              |
| **DEPLOYMENT_CHECKLIST.md** | ✅ Lista de verificación pre/post deployment | ⭐⭐                |
| **PRODUCTION_SECRETS.md**   | 🔐 Cómo generar secrets seguros              | ⭐⭐                |

### ⚙️ Configuración Frontend

| Archivo                    | Descripción                                      |
| -------------------------- | ------------------------------------------------ |
| `frontend/.env.production` | Variables de entorno de producción               |
| `frontend/.htaccess`       | Configuración Apache (routing, cache, seguridad) |

### ⚙️ Configuración Backend

| Archivo                       | Descripción                               |
| ----------------------------- | ----------------------------------------- |
| `backend/.env.production`     | Template de variables de producción       |
| `backend/ecosystem.config.js` | Configuración PM2 para process management |

### 🔧 Scripts de Automatización

| Archivo                | Plataforma | Descripción               |
| ---------------------- | ---------- | ------------------------- |
| `build-frontend.bat`   | Windows    | Build rápido del frontend |
| `deploy-hostinger.bat` | Windows    | Deployment automático     |
| `deploy-hostinger.sh`  | Linux/Mac  | Deployment automático     |
| `generate-secrets.js`  | Node.js    | Generador de JWT secrets  |

### 🔒 Seguridad

| Archivo      | Descripción                             |
| ------------ | --------------------------------------- |
| `.gitignore` | Previene subir archivos sensibles a Git |

---

## 🎯 Flujo de Deployment Recomendado

### Para Hosting Compartido (Solo Frontend Estático)

```
1. Editar frontend/.env.production
   └─> Configurar VITE_API_URL

2. Ejecutar: build-frontend.bat
   └─> Genera: frontend/dist/

3. Subir contenido de dist/ vía:
   - File Manager (web)
   - FTP/SFTP
   - SSH

4. ✅ Frontend online!
```

### Para VPS (Frontend + Backend)

```
1. Leer: HOSTINGER_DEPLOY.md
   └─> Guía completa de 8 partes

2. Preparar archivos localmente
   ├─> Frontend: build-frontend.bat
   └─> Backend: ya está listo

3. Ejecutar: deploy-hostinger.bat
   ├─> Comprime archivos
   ├─> Sube al servidor
   └─> Instrucciones finales

4. Configurar en servidor:
   ├─> Instalar PostgreSQL
   ├─> Configurar .env
   ├─> Ejecutar migraciones
   ├─> Iniciar con PM2
   └─> Configurar Nginx

5. ✅ App completa online!
```

---

## 📋 Variables de Entorno Necesarias

### Frontend

```env
VITE_API_URL=https://api.tudominio.com/api
VITE_GOOGLE_AI_API_KEY=tu_key_opcional
```

### Backend

```env
# Básicas (OBLIGATORIAS)
PORT=3010
NODE_ENV=production
DATABASE_URL="postgresql://..."
ACCESS_TOKEN_SECRET="generar_64_chars"
REFRESH_TOKEN_SECRET="generar_64_chars"
FRONTEND_URL="https://tudominio.com"

# Opcionales
GEMINI_API_KEY=""
WEBPAY_COMMERCE_CODE=""
WEBPAY_API_KEY=""

# Email SMTP (requerido para que los formularios de contacto y suscripción funcionen)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_usuario_smtp
SMTP_PASS=tu_contrasena_smtp
SMTP_FROM="RedMecánica <no-reply@redmecanica.cl>"

# Asegúrate de que FRONTEND_URL incluya el dominio desde el cual se llamará la API, ej.:
# FRONTEND_URL="https://www.redmecanica.cl"
MAPS_API_KEY=""
```

**💡 Tip**: Ejecuta `node generate-secrets.js` para generar los JWT secrets automáticamente.

---

## ✅ Checklist Antes de Empezar

- [ ] Cuenta de Hostinger activa
- [ ] Dominio registrado y apuntando a Hostinger
- [ ] Acceso SSH al VPS (si usas VPS)
- [ ] Credenciales de PostgreSQL (si usas VPS)
- [ ] ~15-30 minutos disponibles para el deployment

---

## 🚀 Comandos Rápidos

### Construir Frontend

```bash
cd frontend
npm run build
```

### Generar Secrets

```bash
node generate-secrets.js
```

### Deployment Completo (Windows)

```bash
deploy-hostinger.bat
```

### Deployment Completo (Linux/Mac)

```bash
chmod +x deploy-hostinger.sh
./deploy-hostinger.sh
```

---

## 📊 Estructura de Archivos

```
RedMecanica/
│
├── 📘 DOCUMENTACIÓN
│   ├── HOSTINGER_DEPLOY.md          ⭐ Guía principal
│   ├── DEPLOY_QUICK_START.md        🚀 Inicio rápido
│   ├── DEPLOYMENT_CHECKLIST.md      ✅ Lista verificación
│   ├── PRODUCTION_SECRETS.md        🔐 Generar secrets
│   └── SUMMARY.md                   📋 Este archivo
│
├── 🎨 FRONTEND
│   ├── dist/                        📦 Build (NO en Git)
│   ├── .env.production              🔧 Variables producción
│   └── .htaccess                    ⚙️  Config Apache
│
├── ⚙️  BACKEND
│   ├── .env.production              🔧 Template variables
│   └── ecosystem.config.js          📝 Config PM2
│
├── 🔧 SCRIPTS
│   ├── build-frontend.bat           🪟 Build Windows
│   ├── deploy-hostinger.bat         🪟 Deploy Windows
│   ├── deploy-hostinger.sh          🐧 Deploy Linux/Mac
│   └── generate-secrets.js          🔑 Generar secrets
│
└── 🔒 SEGURIDAD
    └── .gitignore                   🚫 Archivos ignorados
```

---

## 🎓 Recomendaciones

### Si es tu primer deployment:

1. ✅ Lee **HOSTINGER_DEPLOY.md** completo (15 minutos)
2. ✅ Usa **DEPLOYMENT_CHECKLIST.md** como guía
3. ✅ Empieza solo con el frontend (más simple)
4. ✅ Agrega el backend después cuando te sientas cómodo

### Si tienes experiencia:

1. ✅ Lee **DEPLOY_QUICK_START.md** (3 minutos)
2. ✅ Ejecuta `deploy-hostinger.bat` o `.sh`
3. ✅ Sigue las instrucciones en pantalla

---

## 🆘 Si Tienes Problemas

### Frontend no carga

- ✅ Verifica que `.htaccess` esté en la raíz
- ✅ Revisa permisos de archivos (644)
- ✅ Verifica logs de Nginx/Apache

### Backend no responde

- ✅ Verifica que PM2 esté corriendo: `pm2 status`
- ✅ Revisa logs: `pm2 logs`
- ✅ Verifica variables de entorno

### Error de CORS

- ✅ Verifica `FRONTEND_URL` en backend `.env`
- ✅ Debe coincidir EXACTAMENTE con el dominio

### Error de base de datos

- ✅ Verifica que PostgreSQL esté corriendo
- ✅ Verifica `DATABASE_URL` en `.env`
- ✅ Ejecuta migraciones: `npx prisma migrate deploy`

👉 **Más soluciones**: Ver sección "Troubleshooting" en `HOSTINGER_DEPLOY.md`

---

## 📞 Recursos de Ayuda

| Recurso                  | Link/Ubicación                      |
| ------------------------ | ----------------------------------- |
| Documentación Hostinger  | Panel de control → Tutorials        |
| Soporte Hostinger        | Panel de control → Support          |
| Transbank Developers     | https://www.transbankdevelopers.cl/ |
| Mapbox                   | https://account.mapbox.com/         |
| NIC Chile (dominios .cl) | https://www.nic.cl                  |

---

## 🎉 Próximos Pasos

1. **Ahora**: Lee `DEPLOY_QUICK_START.md` (3 min)
2. **Después**: Lee `HOSTINGER_DEPLOY.md` completo (15 min)
3. **Luego**: Configura variables de entorno
4. **Finalmente**: Ejecuta deployment

---

## 📝 Notas Finales

### ✅ Lo que ESTÁ listo:

- ✅ Toda la documentación
- ✅ Scripts de deployment
- ✅ Configuraciones de producción
- ✅ Archivos .htaccess y PM2
- ✅ Generador de secrets
- ✅ Checklists de verificación

### ⚠️ Lo que DEBES hacer:

- ⚠️ Editar `frontend/.env.production` con tu dominio
- ⚠️ Crear `backend/.env` en el servidor con valores reales
- ⚠️ Configurar credenciales de base de datos
- ⚠️ Generar JWT secrets (usar `generate-secrets.js`)
- ⚠️ Configurar dominio DNS apuntando a Hostinger

### 🔐 IMPORTANTE - Seguridad:

- 🚫 **NUNCA** subir archivos `.env` a Git
- 🚫 **NUNCA** compartir JWT secrets
- ✅ Usar HTTPS en producción
- ✅ Generar secrets únicos para producción
- ✅ Mantener credenciales en gestor de contraseñas

---

## ⏱️ Tiempo Estimado

- **Setup inicial**: 30-45 minutos
- **Build y upload**: 10-15 minutos
- **Configuración servidor**: 30-60 minutos
- **Verificación y ajustes**: 15-30 minutos

**Total**: ~2 horas para primera vez

---

## ✨ Todo está listo!

Tienes todo lo necesario para deployar RedMecánica en Hostinger.

**Empieza con**: `DEPLOY_QUICK_START.md`

¡Buena suerte! 🚀

---

_Última actualización: Febrero 2026_
