Write-Host "🚀 Iniciando IdeasApp Server..." -ForegroundColor Green
Write-Host ""

# Navegar para a pasta backend
Set-Location -Path "$PSScriptRoot\backend"

# Tentar encontrar o Node.js
$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe"
)

$nodeFound = $false

foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        Write-Host "✅ Node.js encontrado em: $path" -ForegroundColor Green
        Write-Host "🌐 Servidor será iniciado em: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "📱 Interface em: http://localhost:3000/app" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
        Write-Host ""
        
        & $path index.js
        $nodeFound = $true
        break
    }
}

if (-not $nodeFound) {
    Write-Host "❌ Node.js não encontrado nos caminhos padrão" -ForegroundColor Red
    Write-Host "Tentando usar 'node' do PATH..." -ForegroundColor Yellow
    
    try {
        node index.js
    }
    catch {
        Write-Host "❌ Erro: Node.js não está instalado ou não está no PATH" -ForegroundColor Red
        Write-Host "Por favor, instale o Node.js de: https://nodejs.org" -ForegroundColor Yellow
    }
}

Read-Host "Pressione Enter para sair" 