@echo off
echo Iniciando IdeasApp Server...
echo.

cd /d "%~dp0backend"

if exist "C:\Program Files\nodejs\node.exe" (
    echo Node.js encontrado em: C:\Program Files\nodejs\node.exe
    "C:\Program Files\nodejs\node.exe" index.js
) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
    echo Node.js encontrado em: C:\Program Files (x86)\nodejs\node.exe
    "C:\Program Files (x86)\nodejs\node.exe" index.js
) else (
    echo Tentando usar node do PATH...
    node index.js
)

pause 