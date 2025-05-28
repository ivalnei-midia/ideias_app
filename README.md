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

1. **Instalar dependências do backend:**
   ```bash
   npm run setup
   ```

2. **Iniciar o servidor:**
   ```bash
   npm start
   ```

3. **Para desenvolvimento (com auto-reload):**
   ```bash
   npm run dev
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