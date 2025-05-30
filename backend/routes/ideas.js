const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// GET /api/ideas/meta/stats - Estatísticas das ideias (deve vir antes de /:id)
router.get('/meta/stats', async (req, res) => {
    try {
        const stats = await Idea.getStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET /api/ideas/meta/tags - Listar todas as tags (deve vir antes de /:id)
router.get('/meta/tags', async (req, res) => {
    try {
        const tags = await Idea.getAllTags();
        
        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Erro ao buscar tags:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET /api/ideas - Listar todas as ideias com filtros opcionais
router.get('/', async (req, res) => {
    console.log('📋 LISTANDO IDEIAS');
    console.log('   Query params:', req.query);
    
    try {
        const filters = {
            category: req.query.category,
            priority: req.query.priority,
            status: req.query.status || 'ativa',
            keyword: req.query.keyword
        };

        console.log('🔍 Filtros aplicados:', filters);
        const ideas = await Idea.findAll(filters);
        console.log(`✅ ${ideas.length} ideias encontradas`);
        
        res.json({
            success: true,
            data: ideas,
            count: ideas.length
        });
    } catch (error) {
        console.error('❌ ERRO AO BUSCAR IDEIAS:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET /api/ideas/:id - Buscar uma ideia específica
router.get('/:id', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        
        if (!idea) {
            return res.status(404).json({
                success: false,
                error: 'Ideia não encontrada'
            });
        }

        res.json({
            success: true,
            data: idea
        });
    } catch (error) {
        console.error('Erro ao buscar ideia:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// POST /api/ideas - Criar nova ideia
router.post('/', async (req, res) => {
    console.log('📝 CRIANDO NOVA IDEIA');
    console.log('   Body recebido:', req.body);
    console.log('   Headers:', req.headers);
    
    try {
        const { title, description, category, priority, tags } = req.body;

        // Validação básica
        if (!title || !title.trim()) {
            console.log('❌ Validação falhou: título vazio');
            return res.status(400).json({
                success: false,
                error: 'Título é obrigatório'
            });
        }

        if (!category) {
            console.log('❌ Validação falhou: categoria vazia');
            return res.status(400).json({
                success: false,
                error: 'Categoria é obrigatória'
            });
        }

        if (!priority) {
            console.log('❌ Validação falhou: prioridade vazia');
            return res.status(400).json({
                success: false,
                error: 'Prioridade é obrigatória'
            });
        }

        const ideaData = {
            title: title.trim(),
            description: description ? description.trim() : '',
            category,
            priority,
            tags: tags || ''
        };

        console.log('✅ Dados validados, criando no banco:', ideaData);
        const newIdea = await Idea.create(ideaData);
        console.log('✅ Ideia criada com sucesso:', newIdea);
        
        res.status(201).json({
            success: true,
            data: newIdea,
            message: 'Ideia criada com sucesso'
        });
    } catch (error) {
        console.error('❌ ERRO AO CRIAR IDEIA:', error);
        console.error('   Stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// PUT /api/ideas/:id - Atualizar ideia existente
router.put('/:id', async (req, res) => {
    try {
        const { title, description, category, priority, tags, status } = req.body;

        // Validação básica
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Título é obrigatório'
            });
        }

        if (!category) {
            return res.status(400).json({
                success: false,
                error: 'Categoria é obrigatória'
            });
        }

        if (!priority) {
            return res.status(400).json({
                success: false,
                error: 'Prioridade é obrigatória'
            });
        }

        const updateData = {
            title: title.trim(),
            description: description ? description.trim() : '',
            category,
            priority,
            tags: tags || '',
            status: status || 'ativa'
        };

        const updatedIdea = await Idea.update(req.params.id, updateData);
        
        res.json({
            success: true,
            data: updatedIdea,
            message: 'Ideia atualizada com sucesso'
        });
    } catch (error) {
        if (error.message === 'Ideia não encontrada') {
            return res.status(404).json({
                success: false,
                error: 'Ideia não encontrada'
            });
        }

        console.error('Erro ao atualizar ideia:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// DELETE /api/ideas/:id - Excluir ideia
router.delete('/:id', async (req, res) => {
    try {
        await Idea.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Ideia excluída com sucesso'
        });
    } catch (error) {
        if (error.message === 'Ideia não encontrada') {
            return res.status(404).json({
                success: false,
                error: 'Ideia não encontrada'
            });
        }

        console.error('Erro ao excluir ideia:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// PATCH /api/ideas/:id/status - Alterar status da ideia
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['ativa', 'arquivada', 'concluida'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Status inválido. Deve ser: ativa, arquivada ou concluida'
            });
        }

        const updatedIdea = await Idea.update(req.params.id, { status });
        
        res.json({
            success: true,
            data: updatedIdea,
            message: 'Status atualizado com sucesso'
        });
    } catch (error) {
        if (error.message === 'Ideia não encontrada') {
            return res.status(404).json({
                success: false,
                error: 'Ideia não encontrada'
            });
        }

        console.error('Erro ao atualizar status:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router; 