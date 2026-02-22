#!/bin/bash

# Script de deployment automatizado para Hostinger
# Uso: ./deploy-hostinger.sh

set -e  # Detener en caso de error

echo "========================================="
echo "🚀 RedMecánica - Deploy a Hostinger"
echo "========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables - CONFIGURAR ESTAS VARIABLES
VPS_USER="tu_usuario"
VPS_HOST="tu-vps.hostinger.com"
VPS_PATH="/var/www/redmecanica"
DOMAIN="tudominio.com"

echo -e "${YELLOW}📋 Verificando configuración...${NC}"
echo "Usuario VPS: $VPS_USER"
echo "Host VPS: $VPS_HOST"
echo "Ruta en servidor: $VPS_PATH"
echo "Dominio: $DOMAIN"
echo ""

read -p "¿La configuración es correcta? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${RED}❌ Deployment cancelado. Edita las variables en el script.${NC}"
    exit 1
fi

# ============================================
# PARTE 1: BUILD DEL FRONTEND
# ============================================
echo ""
echo -e "${GREEN}🎨 PASO 1: Construyendo Frontend...${NC}"
cd frontend

# Verificar si existe .env.production
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  No existe .env.production. Creando desde .env.example...${NC}"
    cp .env.example .env.production
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edita frontend/.env.production con las variables correctas${NC}"
    read -p "Presiona ENTER cuando hayas editado el archivo..." 
fi

# Instalar dependencias y construir
echo "📦 Instalando dependencias..."
npm install

echo "🔨 Construyendo aplicación..."
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: No se generó la carpeta dist/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend construido exitosamente${NC}"
cd ..

# ============================================
# PARTE 2: SUBIR FRONTEND AL SERVIDOR
# ============================================
echo ""
echo -e "${GREEN}📤 PASO 2: Subiendo Frontend al servidor...${NC}"

# Comprimir frontend
echo "📦 Comprimiendo archivos..."
cd frontend/dist
tar -czf ../../frontend-build.tar.gz .
cd ../..

# Subir al servidor
echo "🚀 Subiendo al servidor..."
scp frontend-build.tar.gz $VPS_USER@$VPS_HOST:/tmp/

# Descomprimir en el servidor
echo "📂 Descomprimiendo en servidor..."
ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
cd /tmp
mkdir -p /var/www/redmecanica/frontend
tar -xzf frontend-build.tar.gz -C /var/www/redmecanica/frontend/
rm frontend-build.tar.gz
echo "✅ Frontend desplegado"
ENDSSH

# Limpiar archivo local
rm frontend-build.tar.gz

echo -e "${GREEN}✅ Frontend subido correctamente${NC}"

# ============================================
# PARTE 3: SUBIR BACKEND AL SERVIDOR
# ============================================
echo ""
echo -e "${GREEN}⚙️  PASO 3: Preparando Backend...${NC}"

# Verificar .env.production del backend
if [ ! -f backend/.env.production ]; then
    echo -e "${YELLOW}⚠️  No existe backend/.env.production${NC}"
    echo -e "${YELLOW}⚠️  Deberás crear este archivo manualmente en el servidor${NC}"
fi

# Comprimir backend (excluyendo node_modules y otros)
echo "📦 Comprimiendo backend..."
cd backend
tar -czf ../backend-build.tar.gz \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='logs' \
    --exclude='.env' \
    --exclude='.env.local' \
    .
cd ..

# Subir al servidor
echo "🚀 Subiendo backend al servidor..."
scp backend-build.tar.gz $VPS_USER@$VPS_HOST:/tmp/

# Descomprimir y configurar en el servidor
echo "📂 Configurando backend en servidor..."
ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
cd /tmp
mkdir -p /var/www/redmecanica/backend
tar -xzf backend-build.tar.gz -C /var/www/redmecanica/backend/
rm backend-build.tar.gz

cd /var/www/redmecanica/backend

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --production

# Crear directorio de logs
mkdir -p logs

echo "✅ Backend desplegado"
ENDSSH

# Limpiar archivo local
rm backend-build.tar.gz

echo -e "${GREEN}✅ Backend subido correctamente${NC}"

# ============================================
# PARTE 4: INSTRUCCIONES FINALES
# ============================================
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Deployment completado${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}📝 PASOS SIGUIENTES (ejecutar en el servidor):${NC}"
echo ""
echo "1. Conectarse al servidor:"
echo "   ssh $VPS_USER@$VPS_HOST"
echo ""
echo "2. Configurar variables de entorno del backend:"
echo "   cd /var/www/redmecanica/backend"
echo "   nano .env"
echo "   (Pegar contenido de .env.production y actualizar valores)"
echo ""
echo "3. Ejecutar migraciones de base de datos:"
echo "   npx prisma migrate deploy"
echo "   npx prisma db seed"
echo ""
echo "4. Iniciar/reiniciar backend con PM2:"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo ""
echo "5. Verificar que todo esté corriendo:"
echo "   pm2 status"
echo "   pm2 logs"
echo ""
echo -e "${YELLOW}📋 Verificación:${NC}"
echo "Frontend: https://$DOMAIN"
echo "Backend: https://$DOMAIN/api"
echo ""
echo -e "${GREEN}🎉 ¡Listo para producción!${NC}"
