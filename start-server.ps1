Write-Host "🚀 Iniciando IdeasApp Server..." -ForegroundColor Green
Write-Host ""

# Navegar para a pasta backend
Set-Location -Path "$PSScriptRoot\backend"

# Verificar se Node.js está disponível
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
    Write-Host "🌐 Servidor será iniciado em: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📱 Interface em: http://localhost:3000/app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
    Write-Host ""
    
    # Iniciar o servidor
    node index.js
}
catch {
    Write-Host "❌ Node.js não encontrado no PATH" -ForegroundColor Red
    Write-Host "Tentando usar caminho completo..." -ForegroundColor Yellow
    
    $nodePath = "C:\Program Files\nodejs\node.exe"
    if (Test-Path $nodePath) {
        Write-Host "✅ Node.js encontrado em: $nodePath" -ForegroundColor Green
        & $nodePath index.js
    }
    else {
        Write-Host "❌ Node.js não encontrado" -ForegroundColor Red
        Write-Host "Por favor, instale o Node.js de: https://nodejs.org" -ForegroundColor Yellow
    }
}

Read-Host "Pressione Enter para sair" 