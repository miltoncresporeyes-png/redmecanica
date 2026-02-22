@echo off
REM RedMecanica - Windows Deploy Script
REM Usage: deploy.cmd [component]
REM Example: deploy.cmd all

setlocal

set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "NC=[0m"

set COMPONENT=%1
if "%COMPONENT%"=="" set COMPONENT=all

echo %BLUE%🚀 RedMecanica Deploy Script%NC%
echo Component: %COMPONENT%
echo.

if "%COMPONENT%"=="all" goto all
if "%COMPONENT%"=="frontend" goto frontend
if "%COMPONENT%"=="backend" goto backend
if "%COMPONENT%"=="help" goto help
echo Unknown component: %COMPONENT%
goto help

:all
echo %YELLOW%Installing dependencies...%NC%
call npm install
call npm install --prefix frontend
call npm install --prefix backend
echo %GREEN%✓ Dependencies installed%NC%
echo.

echo %YELLOW%Building frontend...%NC%
cd frontend
call npm run build
cd ..
echo %GREEN%✓ Frontend built%NC%
echo.

echo %YELLOW%Building backend...%NC%
cd backend
call npx prisma generate
cd ..
echo %GREEN%✓ Backend built%NC%
echo.

echo %GREEN%🎉 Build complete!%NC%
echo.
echo Next steps:
echo 1. Push code to GitHub
echo 2. Connect to Vercel (frontend) and Render (backend)
echo 3. Configure environment variables
echo 4. Run database migrations
goto end

:frontend
echo %YELLOW%Installing frontend dependencies...%NC%
call npm install --prefix frontend
echo %GREEN%✓ Dependencies installed%NC%
echo.

echo %YELLOW%Building frontend...%NC%
cd frontend
call npm run build
cd ..
echo %GREEN%✓ Frontend built%NC%

echo.
echo To deploy to Vercel:
echo 1. Push code to GitHub
echo 2. Import project in Vercel
echo 3. Configure VITE_API_URL
echo 4. Deploy
goto end

:backend
echo %YELLOW%Installing backend dependencies...%NC%
call npm install --prefix backend
echo %GREEN%✓ Dependencies installed%NC%
echo.

echo %YELLOW%Building backend...%NC%
cd backend
call npx prisma generate
cd ..
echo %GREEN%✓ Backend built%NC%

echo.
echo To deploy to Render:
echo 1. Push code to GitHub
echo 2. Create PostgreSQL in Render
echo 3. Create Web Service in Render
echo 4. Configure environment variables:
echo    - DATABASE_URL
echo    - ACCESS_TOKEN_SECRET
echo    - REFRESH_TOKEN_SECRET
echo    - WEBPAY_COMMERCE_CODE (optional)
echo    - WEBPAY_API_KEY (optional)
echo 5. Deploy
goto end

:help
echo Usage: deploy.cmd [component]
echo.
echo Components:
echo   all       - Full build (default)
echo   frontend  - Build only frontend
echo   backend   - Build only backend
echo.
echo Examples:
echo   deploy.cmd
echo   deploy.cmd frontend

:end
echo.
pause
