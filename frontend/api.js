// Serviço para comunicação com a API
class ApiService {
    constructor() {
        this.baseURL = '/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    // Método auxiliar para fazer requisições
    async request(method, endpoint, data = null, customHeaders = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = { ...this.defaultHeaders, ...customHeaders };

        const config = {
            method,
            headers
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
                throw new Error(errorData.error || `Erro ${response.status}`);
            }

            // Se é um arquivo (CSV), retornar como texto
            if (response.headers.get('content-type')?.includes('text/csv')) {
                return {
                    success: true,
                    data: await response.text(),
                    filename: response.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1]
                };
            }

            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    // ========== MÉTODOS PARA IDEIAS ==========

    // Buscar todas as ideias
    async getIdeas(filters = {}) {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                queryParams.append(key, value);
            }
        });

        const endpoint = `/ideas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.request('GET', endpoint);
    }

    // Buscar ideia por ID
    async getIdea(id) {
        return this.request('GET', `/ideas/${id}`);
    }

    // Criar nova ideia
    async createIdea(ideaData) {
        return this.request('POST', '/ideas', ideaData);
    }

    // Atualizar ideia
    async updateIdea(id, ideaData) {
        return this.request('PUT', `/ideas/${id}`, ideaData);
    }

    // Excluir ideia
    async deleteIdea(id) {
        return this.request('DELETE', `/ideas/${id}`);
    }

    // Alterar status da ideia
    async updateIdeaStatus(id, status) {
        return this.request('PATCH', `/ideas/${id}/status`, { status });
    }

    // Buscar estatísticas
    async getStats() {
        return this.request('GET', '/ideas/meta/stats');
    }

    // Buscar todas as tags
    async getTags() {
        return this.request('GET', '/ideas/meta/tags');
    }

    // ========== MÉTODOS PARA SERVIÇOS ==========

    // Migrar dados do localStorage
    async migrateFromLocalStorage(localStorageData) {
        return this.request('POST', '/services/migrate', { localStorageData });
    }

    // Exportar ideias
    async exportIdeas(format = 'json', filters = {}) {
        return this.request('POST', '/services/export', { format, filters });
    }

    // Busca avançada
    async advancedSearch(searchParams) {
        return this.request('POST', '/services/search', searchParams);
    }

    // Duplicar ideia
    async duplicateIdea(id) {
        return this.request('POST', `/services/duplicate/${id}`);
    }

    // Atualização em lote do status
    async bulkStatusUpdate(ideaIds, newStatus) {
        return this.request('POST', '/services/bulk-status', { ideaIds, newStatus });
    }

    // Estatísticas avançadas
    async getAdvancedStats(dateRange = {}) {
        const queryParams = new URLSearchParams();
        if (dateRange.start) queryParams.append('start', dateRange.start);
        if (dateRange.end) queryParams.append('end', dateRange.end);

        const endpoint = `/services/advanced-stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.request('GET', endpoint);
    }

    // ========== MÉTODOS AUXILIARES ==========

    // Verificar status da API
    async checkHealth() {
        return this.request('GET', '/health');
    }

    // Download de arquivo exportado
    async downloadExport(format, filters = {}) {
        try {
            const response = await this.exportIdeas(format, filters);
            
            if (format === 'csv' && response.filename) {
                // Criar e baixar arquivo CSV
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = response.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                return { success: true, message: 'Arquivo CSV baixado com sucesso!' };
            } else {
                // Para JSON, criar e baixar
                const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ideas_export_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                return { success: true, message: 'Arquivo JSON baixado com sucesso!' };
            }
        } catch (error) {
            throw new Error(`Erro ao baixar arquivo: ${error.message}`);
        }
    }

    // Verificar se a API está disponível
    async isApiAvailable() {
        try {
            await this.checkHealth();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Instância global do serviço
const apiService = new ApiService();

// Exportar para uso global
window.apiService = apiService; 