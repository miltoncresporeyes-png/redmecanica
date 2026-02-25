# 🚀 Guía de Deployment en Hostinger - RedMecánica

## Resumen de Arquitectura

- **Frontend**: Archivos estáticos (build de React/Vite) en hosting compartido/VPS
- **Backend**: Node.js Application en VPS/Cloud Hosting
- **Database**: PostgreSQL (externa o en el mismo VPS)

---

## 📋 Pre-requisitos

1. **Cuenta Hostinger** con:
   - Hosting Cloud/VPS (para backend Node.js)
   - Hosting Web (para frontend estático) o usar el mismo VPS
   - Acceso a PostgreSQL database

2. **Acceso SSH** al servidor

3. **Node.js** instalado en el servidor (v18 o superior)

---

## 🎨 PARTE 1: Preparar Frontend (Build Local)

### 1.1 Configurar Variables de Entorno de Producción

Crear archivo `frontend/.env.production`:

```env
VITE_API_URL=https://api.tudominio.com/api
VITE_GOOGLE_AI_API_KEY=tu_google_ai_key_aqui
```

### 1.2 Construir Frontend para Producción

```bash
cd frontend
npm install
npm run build
```

Esto generará la carpeta `frontend/dist/` con todos los archivos estáticos optimizados.

### 1.3 Archivos Generados

Verifica que existan:

- `dist/index.html`
- `dist/assets/` (CSS, JS, imágenes)

---

## 🌐 PARTE 2: Subir Frontend a Hostinger

### Opción A: Hosting Web (Compartido)

1. **Acceder a File Manager** en Hostinger

2. **Subir archivos**:
   - Ir a `public_html/` (o carpeta raíz de tu dominio)
   - Eliminar contenido actual (index.html por defecto)
   - Subir TODO el contenido de `frontend/dist/`

3. **Crear archivo `.htaccess`** para React Router:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Habilitar compresión Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Caché del navegador
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Seguridad
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Forzar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Opción B: VPS (mismo servidor que backend)

1. **Conectar por SSH**:

```bash
ssh usuario@tu-vps.hostinger.com
```

2. **Crear directorio para frontend**:

```bash
mkdir -p /var/www/redmecanica/frontend
```

3. **Subir archivos** (desde tu PC local):

```bash
scp -r frontend/dist/* usuario@tu-vps:/var/www/redmecanica/frontend/
```

4. **Configurar Nginx** (crear `/etc/nginx/sites-available/redmecanica`):

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    root /var/www/redmecanica/frontend;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Frontend - React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

5. **Habilitar sitio y recargar Nginx**:

```bash
sudo ln -s /etc/nginx/sites-available/redmecanica /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ⚙️ PARTE 3: Preparar Backend para Producción

### 3.1 Actualizar package.json

Verificar que tenga el script de build correcto:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "start:ts": "node --loader tsx src/server.ts",
    "migrate": "prisma migrate deploy",
    "seed": "prisma db seed"
  }
}
```

### 3.2 Crear archivo de configuración TypeScript para build

Verificar `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.3 Crear archivo .env de producción

**NO subir este archivo a Git**. Crear manualmente en el servidor:

`backend/.env` (en producción):

```env
# Server
PORT=3010
NODE_ENV=production

# Database (PostgreSQL)
DATABASE_URL="postgresql://redmecanica:LLZMPV9yO9BoT1UwiLqy1qTVxR8y4Bhr@dpg-d6dq873h46gs73d5jq20-a/redmecanica?schema=public"

# JWT Secrets (GENERAR VALORES FUERTES)
ACCESS_TOKEN_SECRET="TU_SECRET_FUERTE_ALEATORIO_MIN_64_CHARS"
REFRESH_TOKEN_SECRET="TU_OTRO_SECRET_FUERTE_ALEATORIO_MIN_64_CHARS"

# Frontend URL (para CORS)
FRONTEND_URL="https://tudominio.com"

# Gemini AI (opcional)
GEMINI_API_KEY="tu_api_key_si_la_tienes"

# Webpay Plus (Transbank) - Producción
WEBPAY_COMMERCE_CODE="tu_codigo_comercio"
WEBPAY_API_KEY="tu_api_key_transbank"
WEBPAY_RETURN_URL="https://tudominio.com/payment/return"
WEBPAY_FINAL_URL="https://tudominio.com/payment/final"

# Maps
MAPS_PROVIDER="mapbox"
MAPS_API_KEY="tu_mapbox_token"
```

---

## 🚀 PARTE 4: Subir Backend a Hostinger VPS

### 4.1 Conectar por SSH

```bash
ssh usuario@tu-vps.hostinger.com
```

### 4.2 Instalar Node.js (si no está instalado)

```bash
# Usando NVM (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### 4.3 Instalar PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4.4 Crear Base de Datos

```bash
sudo -u postgres psql

# Dentro de psql:
CREATE DATABASE redmecanica;
CREATE USER redmecanica_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE redmecanica TO redmecanica_user;
\q
```

### 4.5 Clonar o Subir el Backend

**Opción A: Desde Git**

```bash
cd /var/www
git clone https://github.com/tu-usuario/redmecanica.git
cd redmecanica/backend
```

**Opción B: Subir manualmente**

```bash
# Desde tu PC local
cd backend
tar -czf backend.tar.gz .
scp backend.tar.gz usuario@tu-vps:/var/www/redmecanica/

# En el servidor
cd /var/www/redmecanica
tar -xzf backend.tar.gz
rm backend.tar.gz
```

### 4.6 Instalar Dependencias

```bash
cd /var/www/redmecanica/backend
npm install --production
```

### 4.7 Configurar Variables de Entorno

```bash
nano .env
# Pegar la configuración de producción del paso 3.3
# Ctrl+O para guardar, Ctrl+X para salir
```

### 4.8 Ejecutar Migraciones

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 4.9 Probar Backend

```bash
npm run start:ts
# Debería iniciar sin errores
# Ctrl+C para detener
```

---

## 🔄 PARTE 5: Configurar PM2 (Mantener Backend Corriendo)

### 5.1 Instalar PM2

```bash
npm install -g pm2
```

### 5.2 Crear archivo de configuración PM2

`backend/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "redmecanica-backend",
      script: "src/server.ts",
      interpreter: "node",
      interpreter_args: "--loader tsx",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3010,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
    },
  ],
};
```

### 5.3 Iniciar con PM2

```bash
cd /var/www/redmecanica/backend
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5.4 Comandos útiles PM2

```bash
pm2 status                  # Ver estado
pm2 logs                    # Ver logs
pm2 restart redmecanica-backend  # Reiniciar
pm2 stop redmecanica-backend     # Detener
pm2 monit                   # Monitor en tiempo real
```

---

## 🌐 PARTE 6: Configurar Nginx como Reverse Proxy

### 6.1 Editar configuración Nginx

```bash
sudo nano /etc/nginx/sites-available/redmecanica
```

Actualizar para incluir el backend:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    # Frontend - React App
    root /var/www/redmecanica/frontend;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # API Backend (Node.js)
    location /api {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io (WebSockets)
    location /socket.io {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend - React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 6.2 Recargar Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 PARTE 7: Configurar SSL/HTTPS (Certbot)

### 7.1 Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Obtener Certificado SSL

```bash
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

Seguir las instrucciones. Certbot configurará automáticamente Nginx para HTTPS.

### 7.3 Verificar Auto-renovación

```bash
sudo certbot renew --dry-run
```

---

## ✅ PARTE 8: Verificación Final

### 8.1 Verificar Frontend

Visitar: `https://tudominio.com`

- Debería cargar la página principal
- Sin errores en consola del navegador

### 8.2 Verificar Backend

```bash
curl https://tudominio.com/api
# Debería responder con mensaje del servidor
```

### 8.3 Verificar Base de Datos

```bash
sudo -u postgres psql -d redmecanica -c "SELECT COUNT(*) FROM \"User\";"
# Debería mostrar el número de usuarios
```

### 8.4 Verificar Logs

```bash
# Backend
pm2 logs redmecanica-backend

# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔧 Mantenimiento y Actualizaciones

### Actualizar el Backend

```bash
cd /var/www/redmecanica/backend
git pull origin main  # Si usas Git
npm install --production
npx prisma migrate deploy
pm2 restart redmecanica-backend
```

### Actualizar el Frontend

```bash
# En tu PC local
cd frontend
npm run build

# Subir al servidor
scp -r dist/* usuario@tu-vps:/var/www/redmecanica/frontend/
```

### Backup de Base de Datos

```bash
# Crear backup
sudo -u postgres pg_dump redmecanica > backup_$(date +%Y%m%d).sql

# Restaurar backup
sudo -u postgres psql redmecanica < backup_20260217.sql
```

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar conexión
sudo -u postgres psql -d redmecanica
```

### Error: "502 Bad Gateway"

```bash
# Verificar que el backend esté corriendo
pm2 status

# Reiniciar backend
pm2 restart redmecanica-backend

# Verificar logs
pm2 logs
```

### Error: "CORS Policy"

Verificar en `backend/.env`:

```env
FRONTEND_URL="https://tudominio.com"  # Sin / al final
```

Reiniciar backend después de cambios.

---

## 📊 Monitoreo

### Instalar htop para monitoreo de recursos

```bash
sudo apt install htop
htop
```

### Ver uso de disco

```bash
df -h
```

### Ver uso de memoria

```bash
free -h
```

---

## 🎯 Checklist Final

- [ ] Frontend construido y subido
- [ ] `.htaccess` o Nginx configurado para React Router
- [ ] Backend corriendo con PM2
- [ ] PostgreSQL instalado y base de datos creada
- [ ] Migraciones ejecutadas
- [ ] Variables de entorno configuradas
- [ ] Nginx configurado como reverse proxy
- [ ] SSL/HTTPS configurado con Certbot
- [ ] Verificación de frontend funcionando
- [ ] Verificación de backend respondiendo
- [ ] Logs sin errores críticos
- [ ] Backup de base de datos configurado

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `pm2 logs` y `/var/log/nginx/error.log`
2. Verifica las variables de entorno
3. Asegúrate de que todos los servicios estén corriendo
4. Contacta al soporte de Hostinger si es un problema de infraestructura

---

¡Deployment completado! 🎉
