const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.join(__dirname, '../data/ideas.db');

// Criar instância do banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        initializeDatabase();
    }
});

// Inicializar tabelas do banco de dados
function initializeDatabase() {
    // Tabela de ideias
    db.run(`
        CREATE TABLE IF NOT EXISTS ideas (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            priority TEXT NOT NULL,
            tags TEXT,
            status TEXT DEFAULT 'ativa',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela ideas:', err.message);
        } else {
            console.log('Tabela ideas criada/verificada com sucesso.');
        }
    });

    // Tabela de categorias personalizadas (para futuras expansões)
    db.run(`
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            color TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela categories:', err.message);
        } else {
            console.log('Tabela categories criada/verificada com sucesso.');
            insertDefaultCategories();
        }
    });
}

// Inserir categorias padrão
function insertDefaultCategories() {
    const defaultCategories = [
        { id: 'tecnologia', name: 'Tecnologia', color: '#4ECDC4' },
        { id: 'negocio', name: 'Negócio', color: '#45B7D1' },
        { id: 'pessoal', name: 'Pessoal', color: '#96CEB4' },
        { id: 'criativo', name: 'Criativo', color: '#FFEAA7' },
        { id: 'educacao', name: 'Educação', color: '#DDA0DD' },
        { id: 'saude', name: 'Saúde', color: '#98D8C8' }
    ];

    defaultCategories.forEach(category => {
        db.run(`
            INSERT OR IGNORE INTO categories (id, name, color)
            VALUES (?, ?, ?)
        `, [category.id, category.name, category.color]);
    });
}

module.exports = db; 