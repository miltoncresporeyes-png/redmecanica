# 🚀 RedMecánica - Deployment Rápido a Hostinger

## 📋 Resumen

Este proyecto está listo para deplegar en Hostinger con los siguientes archivos preparados:

### 📂 Archivos de Configuración

| Archivo                        | Propósito                             |
| ------------------------------ | ------------------------------------- |
| `HOSTINGER_DEPLOY.md`          | ⭐ **Guía completa paso a paso**      |
| `DEPLOYMENT_CHECKLIST.md`      | Lista de verificación                 |
| `PRODUCTION_SECRETS.md`        | Cómo generar secrets seguros          |
| `build-frontend.bat`           | Script rápido para construir frontend |
| `deploy-hostinger.bat` / `.sh` | Scripts de deployment automático      |

---

## ⚡ Inicio Rápido

### 1️⃣ Preparar Frontend (5 minutos)

```bash
# 1. Editar variables de producción
# Abrir: frontend/.env.production
# Configurar: VITE_API_URL con tu dominio

# 2. Construir frontend
cd frontend
npm install
npm run build

# 3. Los archivos están en: frontend/dist/
```

### 2️⃣ Subir a Hostinger

**Opción A: File Manager (Web)**

1. Acceder al File Manager de Hostinger
2. Ir a `public_html/`
3. Subir TODO el contenido de `frontend/dist/`
4. ¡Listo! Tu sitio está online 🎉

**Opción B: FTP/SFTP**

1. Conectar con FileZilla o WinSCP
2. Subir contenido de `frontend/dist/` a `public_html/`

**Opción C: SSH (Avanzado)**

```bash
# Usar script automático
./deploy-hostinger.sh
```

### 3️⃣ Configurar Backend (VPS)

Si tienes VPS de Hostinger:

```bash
# Conectar a VPS
ssh usuario@tu-vps.hostinger.com

# Instalar Node.js y PostgreSQL
# (Ver HOSTINGER_DEPLOY.md para detalles)

# Subir backend y configurar
# (Seguir pasos en HOSTINGER_DEPLOY.md)
```

---

## 📚 Documentación Completa

👉 **Lee `HOSTINGER_DEPLOY.md`** para instrucciones detalladas sobre:

- Configuración de VPS
- Instalación de PostgreSQL
- Configuración de PM2
- Setup de Nginx
- Certificados SSL
- Troubleshooting

---

## 🔑 Variables de Entorno Importantes

### Frontend (`.env.production`)

```env
VITE_API_URL=https://api.tudominio.com/api
VITE_GOOGLE_AI_API_KEY=tu_key_aqui
```

### Backend (`.env` en servidor)

```env
DATABASE_URL=postgresql://redmecanica:LLZMPV9yO9BoT1UwiLqy1qTVxR8y4Bhr@dpg-d6dq873h46gs73d5jq20-a/redmecanica
ACCESS_TOKEN_SECRET="secret_64_chars"
REFRESH_TOKEN_SECRET="otro_secret_64_chars"
FRONTEND_URL="https://tudominio.com"
```

👉 Ver `PRODUCTION_SECRETS.md` para generar secrets seguros.

---

## ✅ Checklist Rápido

- [ ] Variables de entorno configuradas
- [ ] Frontend construido (`npm run build`)
- [ ] Archivos subidos a Hostinger
- [ ] `.htaccess` en la raíz
- [ ] Sitio web carga correctamente
- [ ] HTTPS configurado

👉 Ver `DEPLOYMENT_CHECKLIST.md` para lista completa.

---

## 🆘 Ayuda

- **Guía completa**: `HOSTINGER_DEPLOY.md`
- **Problemas comunes**: Ver sección "Troubleshooting" en la guía
- **Soporte Hostinger**: Panel de control → Support

---

## 🏗️ Estructura del Proyecto

```
RedMecanica/
├── frontend/              # React + Vite
│   ├── dist/             # 📦 Build de producción (subir esto)
│   ├── .env.production   # Variables de producción
│   └── .htaccess         # Configuración Apache
├── backend/              # Node.js + Express
│   ├── .env.production   # Template de variables
│   └── ecosystem.config.js  # Configuración PM2
└── HOSTINGER_DEPLOY.md   # ⭐ Guía principal
```

---

## 🎯 Próximos Pasos

1. ✅ **Leer**: `HOSTINGER_DEPLOY.md`
2. ✅ **Configurar**: Variables de entorno
3. ✅ **Construir**: Frontend con `npm run build`
4. ✅ **Subir**: Archivos a Hostinger
5. ✅ **Verificar**: Sitio funcionando

---

¡Buena suerte con el deployment! 🚀
