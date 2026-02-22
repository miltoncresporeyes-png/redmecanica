@echo off
REM Script rapido para construir el frontend
echo =========================================
echo Construyendo Frontend para Produccion
echo =========================================
echo.

cd frontend

echo [1/3] Verificando .env.production...
if not exist .env.production (
    echo ERROR: No existe .env.production
    echo Por favor crea el archivo frontend\.env.production con:
    echo   VITE_API_URL=https://api.tudominio.com/api
    echo   VITE_GOOGLE_AI_API_KEY=tu_key
    pause
    exit /b 1
)

echo [2/3] Instalando dependencias...
call npm install

echo [3/3] Construyendo aplicacion...
call npm run build

if not exist "dist" (
    echo ERROR: Build fallo - no se genero dist/
    pause
    exit /b 1
)

echo.
echo =========================================
echo BUILD EXITOSO
echo =========================================
echo.
echo Archivos generados en: frontend\dist\
echo.
echo Proximos pasos:
echo 1. Copia el archivo .htaccess a frontend\dist\
echo 2. Sube TODO el contenido de frontend\dist\ a Hostinger
echo.

REM Copiar .htaccess a dist
if exist .htaccess (
    copy .htaccess dist\.htaccess
    echo .htaccess copiado a dist\
)

echo.
echo Listo para subir a Hostinger!
pause
