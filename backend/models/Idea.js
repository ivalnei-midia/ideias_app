const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Idea {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.title = data.title;
        this.description = data.description;
        this.category = data.category;
        this.priority = data.priority;
        this.tags = data.tags || '';
        this.status = data.status || 'ativa';
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Criar nova ideia
    static create(ideaData) {
        return new Promise((resolve, reject) => {
            const idea = new Idea(ideaData);
            const query = `
                INSERT INTO ideas (id, title, description, category, priority, tags, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.run(query, [
                idea.id,
                idea.title,
                idea.description,
                idea.category,
                idea.priority,
                idea.tags,
                idea.status
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Buscar a ideia criada com as datas
                    Idea.findById(idea.id)
                        .then(resolve)
                        .catch(reject);
                }
            });
        });
    }

    // Buscar todas as ideias
    static findAll(filters = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM ideas WHERE 1=1';
            const params = [];

            // Aplicar filtros
            if (filters.category && filters.category !== 'todas') {
                query += ' AND category = ?';
                params.push(filters.category);
            }

            if (filters.priority) {
                query += ' AND priority = ?';
                params.push(filters.priority);
            }

            if (filters.status) {
                query += ' AND status = ?';
                params.push(filters.status);
            }

            if (filters.keyword) {
                query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
                const keyword = `%${filters.keyword}%`;
                params.push(keyword, keyword, keyword);
            }

            // Ordenação
            query += ' ORDER BY updated_at DESC';

            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Buscar ideia por ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM ideas WHERE id = ?';
            
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Atualizar ideia
    static update(id, updateData) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE ideas 
                SET title = ?, description = ?, category = ?, priority = ?, 
                    tags = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            db.run(query, [
                updateData.title,
                updateData.description,
                updateData.category,
                updateData.priority,
                updateData.tags || '',
                updateData.status || 'ativa',
                id
            ], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Ideia não encontrada'));
                } else {
                    // Buscar a ideia atualizada
                    Idea.findById(id)
                        .then(resolve)
                        .catch(reject);
                }
            });
        });
    }

    // Excluir ideia
    static delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM ideas WHERE id = ?';
            
            db.run(query, [id], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Ideia não encontrada'));
                } else {
                    resolve({ deleted: true, id: id });
                }
            });
        });
    }

    // Buscar estatísticas
    static getStats() {
        return new Promise((resolve, reject) => {
            const queries = {
                total: 'SELECT COUNT(*) as count FROM ideas WHERE status = "ativa"',
                byCategory: 'SELECT category, COUNT(*) as count FROM ideas WHERE status = "ativa" GROUP BY category',
                byPriority: 'SELECT priority, COUNT(*) as count FROM ideas WHERE status = "ativa" GROUP BY priority',
                recent: 'SELECT COUNT(*) as count FROM ideas WHERE status = "ativa" AND created_at >= datetime("now", "-7 days")'
            };

            const stats = {};
            let completed = 0;
            const total = Object.keys(queries).length;

            Object.entries(queries).forEach(([key, query]) => {
                if (key === 'byCategory' || key === 'byPriority') {
                    db.all(query, [], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            stats[key] = rows;
                            completed++;
                            if (completed === total) {
                                resolve(stats);
                            }
                        }
                    });
                } else {
                    db.get(query, [], (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            stats[key] = row.count;
                            completed++;
                            if (completed === total) {
                                resolve(stats);
                            }
                        }
                    });
                }
            });
        });
    }

    // Buscar tags únicas
    static getAllTags() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT DISTINCT tags FROM ideas WHERE tags IS NOT NULL AND tags != ""';
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const allTags = new Set();
                    rows.forEach(row => {
                        if (row.tags) {
                            const tags = row.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                            tags.forEach(tag => allTags.add(tag));
                        }
                    });
                    resolve(Array.from(allTags).sort());
                }
            });
        });
    }
}

module.exports = Idea; 