@echo off
echo.
echo ========================================
echo    🚀 IdeasApp - Iniciando Servidor
echo ========================================
echo.

cd /d "%~dp0backend"

echo Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo Por favor, instale o Node.js de: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo ✅ Node.js encontrado!
echo 🌐 Servidor será iniciado em: http://localhost:3000
echo 📱 Interface em: http://localhost:3000/app
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

node index.js

pause 