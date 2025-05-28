const Idea = require('../models/Idea');

class ApiService {
    // Migrar dados do localStorage para o banco de dados
    static async migrateFromLocalStorage(localStorageData) {
        try {
            if (!Array.isArray(localStorageData)) {
                throw new Error('Dados inválidos para migração');
            }

            const migratedIdeas = [];
            for (const ideaData of localStorageData) {
                // Converter formato do localStorage para formato do banco
                const dbIdea = {
                    title: ideaData.title,
                    description: ideaData.description,
                    category: ideaData.category,
                    priority: ideaData.priority,
                    tags: ideaData.tags || '',
                    status: 'ativa'
                };

                const newIdea = await Idea.create(dbIdea);
                migratedIdeas.push(newIdea);
            }

            return {
                success: true,
                migrated: migratedIdeas.length,
                data: migratedIdeas
            };
        } catch (error) {
            console.error('Erro na migração:', error);
            throw error;
        }
    }

    // Exportar ideias em diferentes formatos
    static async exportIdeas(format = 'json', filters = {}) {
        try {
            const ideas = await Idea.findAll(filters);
            
            switch (format.toLowerCase()) {
                case 'json':
                    return {
                        format: 'json',
                        data: ideas,
                        metadata: {
                            exportedAt: new Date().toISOString(),
                            count: ideas.length,
                            filters: filters
                        }
                    };
                
                case 'csv':
                    const csvHeaders = ['ID', 'Título', 'Descrição', 'Categoria', 'Prioridade', 'Tags', 'Status', 'Criado em', 'Atualizado em'];
                    const csvRows = ideas.map(idea => [
                        idea.id,
                        `"${idea.title.replace(/"/g, '""')}"`,
                        `"${(idea.description || '').replace(/"/g, '""')}"`,
                        idea.category,
                        idea.priority,
                        `"${(idea.tags || '').replace(/"/g, '""')}"`,
                        idea.status,
                        idea.created_at,
                        idea.updated_at
                    ]);
                    
                    const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
                    
                    return {
                        format: 'csv',
                        data: csvContent,
                        metadata: {
                            exportedAt: new Date().toISOString(),
                            count: ideas.length
                        }
                    };
                
                default:
                    throw new Error('Formato de exportação não suportado');
            }
        } catch (error) {
            console.error('Erro na exportação:', error);
            throw error;
        }
    }

    // Busca avançada com múltiplos filtros
    static async advancedSearch(searchParams) {
        try {
            const {
                keyword,
                categories = [],
                priorities = [],
                tags = [],
                dateRange = {},
                status = 'ativa'
            } = searchParams;

            // Construir filtros dinâmicos
            const filters = { status };

            if (keyword) {
                filters.keyword = keyword;
            }

            // Para múltiplas categorias e prioridades, precisamos fazer uma busca mais complexa
            let ideas = await Idea.findAll(filters);

            // Aplicar filtros adicionais
            if (categories.length > 0) {
                ideas = ideas.filter(idea => categories.includes(idea.category));
            }

            if (priorities.length > 0) {
                ideas = ideas.filter(idea => priorities.includes(idea.priority));
            }

            if (tags.length > 0) {
                ideas = ideas.filter(idea => {
                    if (!idea.tags) return false;
                    const ideaTags = idea.tags.split(',').map(tag => tag.trim().toLowerCase());
                    return tags.some(tag => ideaTags.includes(tag.toLowerCase()));
                });
            }

            // Filtro por data
            if (dateRange.start || dateRange.end) {
                ideas = ideas.filter(idea => {
                    const ideaDate = new Date(idea.created_at);
                    let inRange = true;

                    if (dateRange.start) {
                        inRange = inRange && ideaDate >= new Date(dateRange.start);
                    }

                    if (dateRange.end) {
                        inRange = inRange && ideaDate <= new Date(dateRange.end);
                    }

                    return inRange;
                });
            }

            return {
                success: true,
                data: ideas,
                count: ideas.length,
                searchParams
            };
        } catch (error) {
            console.error('Erro na busca avançada:', error);
            throw error;
        }
    }

    // Duplicar ideia
    static async duplicateIdea(ideaId) {
        try {
            const originalIdea = await Idea.findById(ideaId);
            
            if (!originalIdea) {
                throw new Error('Ideia não encontrada');
            }

            const duplicatedData = {
                title: `${originalIdea.title} (Cópia)`,
                description: originalIdea.description,
                category: originalIdea.category,
                priority: originalIdea.priority,
                tags: originalIdea.tags,
                status: 'ativa'
            };

            const duplicatedIdea = await Idea.create(duplicatedData);
            
            return {
                success: true,
                data: duplicatedIdea,
                message: 'Ideia duplicada com sucesso'
            };
        } catch (error) {
            console.error('Erro ao duplicar ideia:', error);
            throw error;
        }
    }

    // Arquivar/desarquivar ideias em lote
    static async bulkStatusUpdate(ideaIds, newStatus) {
        try {
            if (!Array.isArray(ideaIds) || ideaIds.length === 0) {
                throw new Error('Lista de IDs inválida');
            }

            if (!['ativa', 'arquivada', 'concluida'].includes(newStatus)) {
                throw new Error('Status inválido');
            }

            const updatedIdeas = [];
            const errors = [];

            for (const ideaId of ideaIds) {
                try {
                    const updatedIdea = await Idea.update(ideaId, { status: newStatus });
                    updatedIdeas.push(updatedIdea);
                } catch (error) {
                    errors.push({ ideaId, error: error.message });
                }
            }

            return {
                success: true,
                updated: updatedIdeas.length,
                errors: errors.length,
                data: updatedIdeas,
                errorDetails: errors
            };
        } catch (error) {
            console.error('Erro na atualização em lote:', error);
            throw error;
        }
    }

    // Estatísticas avançadas
    static async getAdvancedStats(dateRange = {}) {
        try {
            const basicStats = await Idea.getStats();
            
            // Aqui podemos adicionar mais estatísticas específicas
            // como tendências por período, tags mais usadas, etc.
            
            return {
                success: true,
                data: {
                    ...basicStats,
                    dateRange,
                    generatedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('Erro ao gerar estatísticas avançadas:', error);
            throw error;
        }
    }
}

module.exports = ApiService; 