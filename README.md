# IdeasApp - Gerenciador de Ideias 💡

Um aplicativo web moderno para capturar, organizar e desenvolver suas melhores ideias. Agora com sistema completo de armazenamento API!

## ✨ Funcionalidades

### 🎯 Funcionalidades Principais
- ✅ **Gerenciamento completo de ideias** (Criar, Ler, Atualizar, Excluir)
- ✅ **Sistema híbrido de armazenamento** (API + localStorage fallback)
- ✅ **Migração automática** de dados do localStorage para a API
- ✅ **Filtros avançados** por categoria e palavra-chave
- ✅ **Visualizações flexíveis** (Grade e Lista)
- ✅ **Interface responsiva** e moderna
- ✅ **Categorização inteligente** com ícones
- ✅ **Sistema de prioridades** (Alta, Média, Baixa)

### 🚀 Novas Funcionalidades de Armazenamento
- ✅ **API REST completa** com SQLite
- ✅ **Migração automática** de dados existentes
- ✅ **Sistema de backup** (localStorage como fallback)
- ✅ **Exportação de dados** (JSON e CSV)
- ✅ **Busca avançada** com múltiplos filtros
- ✅ **Estatísticas detalhadas** das ideias
- ✅ **Sistema de tags** personalizadas
- ✅ **Duplicação de ideias** 
- ✅ **Operações em lote** (atualização de status)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com Grid e Flexbox
- **JavaScript ES6+** - Lógica da aplicação
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Inter)

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **UUID** - Geração de IDs únicos
- **CORS** - Controle de acesso
- **Body Parser** - Processamento de dados

## 📦 Estrutura do Projeto

```
ideias_app/
├── frontend/
│   ├── index.html          # Interface principal
│   ├── styles.css          # Estilos CSS
│   ├── script.js           # Lógica da aplicação
│   └── api.js              # Serviço de comunicação com API
├── backend/
│   ├── index.js            # Servidor principal
│   ├── config/
│   │   └── database.js     # Configuração do banco
│   ├── models/
│   │   └── Idea.js         # Modelo de dados das ideias
│   ├── routes/
│   │   ├── ideas.js        # Rotas CRUD das ideias
│   │   └── services.js     # Rotas de serviços avançados
│   ├── services/
│   │   └── apiService.js   # Serviços de negócio
│   ├── data/
│   │   ├── .gitkeep        # Mantém diretório no Git
│   │   └── ideas.db        # Banco SQLite (criado automaticamente)
│   └── package.json        # Dependências do backend
├── README.md
├── package.json            # Configuração principal
└── scripts/                # Scripts de inicialização
```

## 🚀 Como Usar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn

### Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd ideias_app
```

2. **Instale as dependências do backend:**
```bash
cd backend
npm install
```

3. **Inicie o servidor:**
```bash
npm start
# ou para desenvolvimento:
npm run dev
```

4. **Acesse a aplicação:**
- Interface: http://localhost:3000/app
- API: http://localhost:3000/api/health
- Backend: http://localhost:3000

### Scripts Disponíveis

No diretório `backend/`:
- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com nodemon)

## 📡 API Endpoints

### Ideias (CRUD)
- `GET /api/ideas` - Listar todas as ideias
- `POST /api/ideas` - Criar nova ideia
- `GET /api/ideas/:id` - Buscar ideia específica
- `PUT /api/ideas/:id` - Atualizar ideia
- `DELETE /api/ideas/:id` - Excluir ideia
- `PATCH /api/ideas/:id/status` - Atualizar status da ideia

### Metadados
- `GET /api/ideas/meta/stats` - Estatísticas das ideias
- `GET /api/ideas/meta/tags` - Listar todas as tags

### Serviços Avançados
- `POST /api/services/migrate` - Migrar dados do localStorage
- `POST /api/services/export` - Exportar ideias (JSON/CSV)
- `POST /api/services/search` - Busca avançada
- `POST /api/services/duplicate/:id` - Duplicar ideia
- `POST /api/services/bulk-status` - Atualização em lote

### Sistema
- `GET /api/health` - Status da API

## 💾 Sistema de Armazenamento

### Modo Híbrido
O IdeasApp possui um sistema híbrido inteligente:

1. **Modo API (Preferencial)**: Quando o servidor está disponível
   - Dados armazenados no banco SQLite
   - Sincronização em tempo real
   - Funcionalidades avançadas disponíveis

2. **Modo localStorage (Fallback)**: Quando o servidor não está disponível
   - Dados armazenados localmente no navegador
   - Funcionalidades básicas mantidas
   - Migração automática quando servidor retorna

### Migração Automática
- Na primeira inicialização com API disponível, os dados do localStorage são automaticamente migrados
- O processo é transparente e não requer ação do usuário
- Os dados locais são preservados como backup

## 🎨 Funcionalidades de Interface

### Filtros e Busca
- **Busca por palavra-chave**: Procura em títulos, descrições e tags
- **Filtro por categoria**: Tecnologia, Negócio, Pessoal, Criativo, Outro
- **Busca avançada**: Múltiplos filtros combinados (API)

### Visualizações
- **Modo Grade**: Cards organizados em grid responsivo
- **Modo Lista**: Visualização compacta em lista

### Categorias Disponíveis
- 🔧 **Tecnologia**: Ideias relacionadas a tech e inovação
- 💼 **Negócio**: Oportunidades de negócio e empreendedorismo
- 👤 **Pessoal**: Desenvolvimento pessoal e vida
- 🎨 **Criativo**: Projetos artísticos e criativos
- 📝 **Outro**: Outras categorias

### Níveis de Prioridade
- 🔴 **Alta**: Ideias urgentes e importantes
- 🟡 **Média**: Ideias importantes mas não urgentes
- 🟢 **Baixa**: Ideias para o futuro

## 🔄 Próximos Passos Implementados

- ✅ **Integração com API real** (substituiu localStorage)
- ✅ **Sistema de tags personalizadas**
- ✅ **Busca avançada com filtros múltiplos**
- ✅ **Exportação de ideias** (PDF/JSON)
- 🔲 **Modo escuro toggle**
- 🔲 **Colaboração em tempo real**

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Status do Projeto

**Versão Atual**: 2.0.0 - Sistema de Armazenamento Completo

**Status**: ✅ Funcional com API completa e sistema híbrido

**Última Atualização**: Dezembro 2024