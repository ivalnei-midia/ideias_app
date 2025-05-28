# IdeasApp

Uma aplicação fullstack para gerenciamento de ideias, desenvolvida com Node.js/Express no backend e HTML/CSS/JavaScript no frontend.

## Estrutura do Projeto

```
IdeasApp/
├── backend/
│   ├── routes/          # Rotas da API
│   ├── services/        # Lógica de negócio
│   ├── data/           # Arquivos de dados JSON
│   │   ├── ideas.json
│   │   └── users.json
│   ├── package.json
│   └── index.js        # Entrada do servidor
├── frontend/
│   ├── index.html      # Página principal
│   ├── styles.css      # Estilos CSS
│   └── script.js       # JavaScript do frontend
├── package.json        # Configuração principal
└── README.md
```

## Como executar

### 🚀 Método Mais Fácil (Recomendado)

**Opção 1: Arquivo Batch (Windows)**
```cmd
start-server.bat
```

**Opção 2: Script PowerShell**
```powershell
.\start-server.ps1
```

### 🔧 Método Manual

1. **Instalar dependências do backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Iniciar o servidor:**
   
   **Se o Node.js estiver no PATH:**
   ```bash
   cd backend
   node index.js
   ```
   
   **Se o Node.js não estiver no PATH:**
   ```powershell
   cd backend
   & "C:\Program Files\nodejs\node.exe" index.js
   ```

3. **Acessar a aplicação:**
   - **API:** http://localhost:3000
   - **Interface:** http://localhost:3000/app

### 🛠️ Solução de Problemas

**Problema: "node não é reconhecido"**
- Use o arquivo `start-server.bat` ou `start-server.ps1`
- Ou reinstale o Node.js de: https://nodejs.org

**Problema: "Erro de política de execução"**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Tecnologias Utilizadas

- **Backend:** Node.js, Express, CORS, Body-parser
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Dados:** JSON files (ideas.json, users.json)

## Funcionalidades

- Gerenciamento de ideias
- Interface web responsiva
- API RESTful
- Armazenamento em arquivos JSON

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request 