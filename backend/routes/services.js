const express = require('express');
const router = express.Router();
const ApiService = require('../services/apiService');

// POST /api/services/migrate - Migrar dados do localStorage
router.post('/migrate', async (req, res) => {
    try {
        const { localStorageData } = req.body;

        if (!localStorageData) {
            return res.status(400).json({
                success: false,
                error: 'Dados do localStorage são obrigatórios'
            });
        }

        const result = await ApiService.migrateFromLocalStorage(localStorageData);
        
        res.json({
            success: true,
            ...result,
            message: `${result.migrated} ideias migradas com sucesso`
        });
    } catch (error) {
        console.error('Erro na migração:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// POST /api/services/export - Exportar ideias
router.post('/export', async (req, res) => {
    try {
        const { format = 'json', filters = {} } = req.body;

        const result = await ApiService.exportIdeas(format, filters);
        
        // Configurar headers para download
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `ideas_export_${timestamp}.${format}`;
        
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(result.data);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.json(result);
        }
    } catch (error) {
        console.error('Erro na exportação:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// POST /api/services/search - Busca avançada
router.post('/search', async (req, res) => {
    try {
        const searchParams = req.body;
        const result = await ApiService.advancedSearch(searchParams);
        
        res.json(result);
    } catch (error) {
        console.error('Erro na busca avançada:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// POST /api/services/duplicate/:id - Duplicar ideia
router.post('/duplicate/:id', async (req, res) => {
    try {
        const result = await ApiService.duplicateIdea(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Erro ao duplicar ideia:', error);
        if (error.message === 'Ideia não encontrada') {
            return res.status(404).json({
                success: false,
                error: 'Ideia não encontrada'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// POST /api/services/bulk-status - Atualização em lote do status
router.post('/bulk-status', async (req, res) => {
    try {
        const { ideaIds, newStatus } = req.body;

        if (!ideaIds || !newStatus) {
            return res.status(400).json({
                success: false,
                error: 'IDs das ideias e novo status são obrigatórios'
            });
        }

        const result = await ApiService.bulkStatusUpdate(ideaIds, newStatus);
        res.json(result);
    } catch (error) {
        console.error('Erro na atualização em lote:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// GET /api/services/advanced-stats - Estatísticas avançadas
router.get('/advanced-stats', async (req, res) => {
    try {
        const dateRange = {
            start: req.query.start,
            end: req.query.end
        };

        const result = await ApiService.getAdvancedStats(dateRange);
        res.json(result);
    } catch (error) {
        console.error('Erro ao buscar estatísticas avançadas:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

module.exports = router; 