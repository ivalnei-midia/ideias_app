const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Importar configuração do banco de dados
require('./config/database');

// Importar rotas
const ideasRoutes = require('./routes/ideas');
const servicesRoutes = require('./routes/services');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middlewares
app.use(cors({
    origin: NODE_ENV === 'production' ? 
        function(origin, callback) {
            // Permitir requests sem origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            
            // Lista de origens permitidas em produção
            const allowedOrigins = [
                /https:\/\/.*\.onrender\.com$/,  // Qualquer subdomínio do Render
                /https:\/\/.*\.vercel\.app$/,    // Vercel
                /https:\/\/.*\.netlify\.app$/,   // Netlify
                /https:\/\/.*\.railway\.app$/    // Railway
            ];
            
            // Verificar se a origem está na lista permitida
            const isAllowed = allowedOrigins.some(pattern => {
                if (pattern instanceof RegExp) {
                    return pattern.test(origin);
                }
                return origin === pattern;
            });
            
            if (isAllowed) {
                callback(null, true);
            } else {
                console.log(`CORS: Origin não permitida: ${origin}`);
                callback(null, true); // Temporariamente permitir todas em produção para debug
            }
        } :
        ['http://localhost:3000', 'http://127.0.0.1:3000']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api/ideas', ideasRoutes);
app.use('/api/services', servicesRoutes);

// Rota básica
app.get('/', (req, res) => {
    res.json({ 
        message: 'IdeasApp API v2.0',
        status: 'online',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Rota para verificar status da API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected',
        environment: NODE_ENV
    });
});

// Rota para servir o frontend
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rota catch-all para servir o frontend para qualquer rota que não seja da API
app.get('*', (req, res, next) => {
    // Se a rota começar com /api, prosseguir para o middleware de erro 404
    if (req.path.startsWith('/api')) {
        return next();
    }
    
    // Caso contrário, servir o frontend
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        success: false,
        error: NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message
    });
});

// Middleware para rotas não encontradas (apenas para APIs)
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Rota da API não encontrada',
        path: req.originalUrl
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 IdeasApp Backend v2.0 iniciado!`);
    console.log(`📊 Ambiente: ${NODE_ENV}`);
    console.log(`📡 Servidor rodando na porta ${PORT}`);
    if (NODE_ENV === 'development') {
        console.log(`🌐 Acesse: http://localhost:${PORT}`);
        console.log(`🎨 Frontend: http://localhost:${PORT}/app`);
        console.log(`🔗 API: http://localhost:${PORT}/api/health`);
        console.log(`\n📡 Endpoints disponíveis:`);
        console.log(`   GET    /api/health                - Status da API`);
        console.log(`   GET    /api/ideas                 - Listar ideias`);
        console.log(`   POST   /api/ideas                 - Criar ideia`);
        console.log(`   GET    /api/ideas/:id             - Buscar ideia`);
        console.log(`   PUT    /api/ideas/:id             - Atualizar ideia`);
        console.log(`   DELETE /api/ideas/:id             - Excluir ideia`);
        console.log(`   GET    /api/ideas/meta/stats      - Estatísticas`);
        console.log(`   GET    /api/ideas/meta/tags       - Listar tags`);
        console.log(`   POST   /api/services/migrate      - Migrar localStorage`);
        console.log(`   POST   /api/services/export       - Exportar ideias`);
        console.log(`   POST   /api/services/search       - Busca avançada`);
    }
    console.log(`\n💾 Banco de dados SQLite configurado e pronto!`);
}); 