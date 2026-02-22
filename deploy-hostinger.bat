@echo off
REM Script de deployment para Windows - Hostinger
REM Uso: deploy-hostinger.bat

echo =========================================
echo RedMecanica - Deploy a Hostinger
echo =========================================
echo.

REM Variables - CONFIGURAR ESTAS VARIABLES
set VPS_USER=tu_usuario
set VPS_HOST=tu-vps.hostinger.com
set VPS_PATH=/var/www/redmecanica
set DOMAIN=tudominio.com

echo Verificando configuracion...
echo Usuario VPS: %VPS_USER%
echo Host VPS: %VPS_HOST%
echo Ruta en servidor: %VPS_PATH%
echo Dominio: %DOMAIN%
echo.

pause

REM ============================================
REM PARTE 1: BUILD DEL FRONTEND
REM ============================================
echo.
echo [PASO 1] Construyendo Frontend...
cd frontend

if not exist .env.production (
    echo ADVERTENCIA: No existe .env.production
    echo Creando desde .env.example...
    copy .env.example .env.production
    echo IMPORTANTE: Edita frontend\.env.production con las variables correctas
    pause
)

echo Instalando dependencias...
call npm install

echo Construyendo aplicacion...
call npm run build

if not exist "dist" (
    echo ERROR: No se genero la carpeta dist
    pause
    exit /b 1
)

echo Frontend construido exitosamente
cd ..

REM ============================================
REM PARTE 2: COMPRIMIR ARCHIVOS
REM ============================================
echo.
echo [PASO 2] Comprimiendo archivos...

REM Comprimir frontend (requiere 7-Zip o WinRAR)
echo Comprimiendo frontend...
cd frontend\dist
tar -czf ..\..\frontend-build.tar.gz .
cd ..\..

REM Comprimir backend
echo Comprimiendo backend...
cd backend
tar -czf ..\backend-build.tar.gz --exclude=node_modules --exclude=dist --exclude=logs --exclude=.env --exclude=.env.local .
cd ..

echo.
echo =========================================
echo Archivos listos para subir
echo =========================================
echo.
echo Los siguientes archivos estan listos:
echo - frontend-build.tar.gz
echo - backend-build.tar.gz
echo.
echo PASOS SIGUIENTES (manual):
echo.
echo 1. Subir archivos al servidor via SFTP/SCP:
echo    - Frontend: frontend-build.tar.gz a /tmp/
echo    - Backend: backend-build.tar.gz a /tmp/
echo.
echo 2. Conectarse al servidor SSH:
echo    ssh %VPS_USER%@%VPS_HOST%
echo.
echo 3. Descomprimir archivos en el servidor:
echo    cd /tmp
echo    mkdir -p %VPS_PATH%/frontend
echo    mkdir -p %VPS_PATH%/backend
echo    tar -xzf frontend-build.tar.gz -C %VPS_PATH%/frontend/
echo    tar -xzf backend-build.tar.gz -C %VPS_PATH%/backend/
echo    rm frontend-build.tar.gz backend-build.tar.gz
echo.
echo 4. Instalar dependencias del backend:
echo    cd %VPS_PATH%/backend
echo    npm install --production
echo.
echo 5. Configurar .env del backend:
echo    nano .env
echo    (Pegar contenido de .env.production y actualizar)
echo.
echo 6. Ejecutar migraciones:
echo    npx prisma migrate deploy
echo    npx prisma db seed
echo.
echo 7. Iniciar con PM2:
echo    pm2 start ecosystem.config.js
echo    pm2 save
echo.
echo Verificacion:
echo Frontend: https://%DOMAIN%
echo Backend: https://%DOMAIN%/api
echo.
pause
