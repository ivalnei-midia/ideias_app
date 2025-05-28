# Configuração do Git para o IdeasApp

## Pré-requisitos
Certifique-se de que o Git está instalado. Se não estiver, baixe em: https://git-scm.com/download/win

## Passos para inicializar o repositório Git

1. **Abra o terminal/PowerShell no diretório do projeto:**
   ```bash
   cd C:\PROJETOS\ideias_app
   ```

2. **Inicialize o repositório Git:**
   ```bash
   git init
   ```

3. **Configure seu nome e email (se ainda não configurou globalmente):**
   ```bash
   git config user.name "Seu Nome"
   git config user.email "seu.email@exemplo.com"
   ```

4. **Adicione todos os arquivos ao staging:**
   ```bash
   git add .
   ```

5. **Faça o commit inicial:**
   ```bash
   git commit -m "Initial commit: IdeasApp fullstack project setup"
   ```

6. **Opcional: Conectar com repositório remoto (GitHub, GitLab, etc.):**
   ```bash
   git remote add origin https://github.com/seuusuario/ideasapp.git
   git branch -M main
   git push -u origin main
   ```

## Comandos Git úteis para o projeto

- **Ver status dos arquivos:**
  ```bash
  git status
  ```

- **Ver histórico de commits:**
  ```bash
  git log --oneline
  ```

- **Criar uma nova branch:**
  ```bash
  git checkout -b nome-da-feature
  ```

- **Fazer commit de mudanças:**
  ```bash
  git add .
  git commit -m "Descrição das mudanças"
  ```

- **Fazer push das mudanças:**
  ```bash
  git push
  ```

## Estrutura atual do projeto
```
IdeasApp/
├── .gitignore          ✅ Criado
├── README.md           ✅ Criado
├── package.json        ✅ Criado
├── SETUP_GIT.md        ✅ Este arquivo
├── backend/
│   ├── routes/         ✅ Pasta criada (vazia)
│   ├── services/       ✅ Pasta criada (vazia)
│   ├── data/
│   │   ├── ideas.json  ✅ Criado (array vazio)
│   │   └── users.json  ✅ Criado (array vazio)
│   │   
│   ├── package.json    ✅ Criado
│   └── index.js        ✅ Servidor Express configurado
└── frontend/
    ├── index.html      ✅ Interface completa
    ├── styles.css      ✅ Estilos modernos
    └── script.js       ✅ Funcionalidades JavaScript
```

## Próximos passos após configurar o Git

1. Instalar dependências do backend: `npm run setup`
2. Iniciar o servidor: `npm start`
3. Acessar a aplicação em: http://localhost:3000
4. Começar a desenvolver novas features! 