// Estado da aplicação
let ideas = [];
let currentFilter = 'todas';
let currentKeyword = '';
let currentView = 'grid';
let isEditMode = false;
let isApiMode = false; // Flag para determinar se estamos usando API ou localStorage

// Elementos DOM
const ideaForm = document.getElementById('ideaForm');
const ideasContainer = document.getElementById('ideasContainer');
const categoryFilter = document.getElementById('categoryFilter');
const keywordFilter = document.getElementById('keywordFilter');
const ideaModal = document.getElementById('ideaModal');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const cancelIdea = document.getElementById('cancelIdea');
const btnAddIdea = document.getElementById('btnAddIdea');
const fabAddIdea = document.getElementById('fabAddIdea');
const totalIdeasStat = document.getElementById('totalIdeas');
const filteredIdeasStat = document.getElementById('filteredIdeas');
const viewBtns = document.querySelectorAll('.view-btn');

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async function() {
    console.log('IdeasApp carregado!');
    await initializeApp();
    setupEventListeners();
});

// Inicializar aplicação
async function initializeApp() {
    try {
        console.log('🚀 Inicializando IdeasApp...');
        console.log('🌐 URL atual:', window.location.href);
        console.log('🔗 URL base da API:', apiService.baseURL);
        
        // Se não estamos em localhost, sempre tentar usar API primeiro
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log('🔧 Modo produção detectado - priorizando API');
            isApiMode = true;
            
            try {
                await migrateLocalStorageToApi();
                await loadIdeasFromApi();
                console.log('✅ API funcionando perfeitamente!');
            } catch (error) {
                console.error('❌ Erro na API, mas continuando no modo API:', error);
                // Mesmo com erro, continuar tentando usar API
                // pois em produção devemos sempre tentar a API
                renderIdeas(); // Renderizar vazio se necessário
                updateStats();
            }
        } else {
            // Localhost - verificação normal
            const apiAvailable = await apiService.isApiAvailable();
            
            if (apiAvailable) {
                console.log('✅ API disponível - Modo API ativado');
                isApiMode = true;
                await migrateLocalStorageToApi();
                await loadIdeasFromApi();
            } else {
                console.log('⚠️ API não disponível - Usando localStorage');
                console.log('🔍 Tentativa de conexão com:', apiService.baseURL + '/health');
                isApiMode = false;
                loadIdeasFromLocalStorage();
            }
        }
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        
        // Em produção, sempre tentar API mesmo com erro
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log('🔄 Forçando modo API em produção...');
            isApiMode = true;
            renderIdeas();
            updateStats();
        } else {
            isApiMode = false;
            loadIdeasFromLocalStorage();
        }
    }
}

// Migrar dados do localStorage para a API (apenas na primeira vez)
async function migrateLocalStorageToApi() {
    try {
        const localData = localStorage.getItem('ideasApp_ideas');
        const migrationFlag = localStorage.getItem('ideasApp_migrated');
        
        if (localData && !migrationFlag) {
            console.log('🔄 Migrando dados do localStorage para a API...');
            const localIdeas = JSON.parse(localData);
            
            if (localIdeas.length > 0) {
                const result = await apiService.migrateFromLocalStorage(localIdeas);
                console.log(`✅ ${result.migrated} ideias migradas com sucesso!`);
                
                // Marcar como migrado
                localStorage.setItem('ideasApp_migrated', 'true');
                showSuccessMessage(`${result.migrated} ideias migradas com sucesso para o servidor!`);
            }
        }
    } catch (error) {
        console.error('Erro na migração:', error);
        showErrorMessage('Erro ao migrar dados. Continuando no modo offline.');
    }
}

// ========== MÉTODOS DE CARREGAMENTO ==========

// Carregar ideias da API
async function loadIdeasFromApi() {
    try {
        const filters = {
            category: currentFilter !== 'todas' ? currentFilter : undefined,
            keyword: currentKeyword || undefined
        };

        const response = await apiService.getIdeas(filters);
        ideas = response.data || [];
        renderIdeas();
        updateStats();
    } catch (error) {
        console.error('Erro ao carregar ideias da API:', error);
        showErrorMessage('Erro ao carregar ideias do servidor.');
        // Fallback para localStorage
        isApiMode = false;
        loadIdeasFromLocalStorage();
    }
}

// Carregar ideias do localStorage (fallback)
function loadIdeasFromLocalStorage() {
    try {
        const savedIdeas = localStorage.getItem('ideasApp_ideas');
        if (savedIdeas) {
            ideas = JSON.parse(savedIdeas);
        } else {
            // Ideias de exemplo para demonstração
            ideas = [
                {
                    id: '1',
                    title: 'App de Receitas Inteligente',
                    description: 'Um aplicativo que sugere receitas baseadas nos ingredientes disponíveis na geladeira.',
                    category: 'tecnologia',
                    priority: 'alta',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'Curso Online de Programação',
                    description: 'Criar um curso completo de programação web para iniciantes.',
                    category: 'negocio',
                    priority: 'media',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ];
            saveIdeasToLocalStorage();
        }
        renderIdeas();
        updateStats();
    } catch (error) {
        console.error('Erro ao carregar ideias:', error);
        showErrorMessage('Erro ao carregar ideias.');
    }
}

// ========== MÉTODOS DE SALVAMENTO ==========

// Salvar ideias (API ou localStorage)
async function saveIdea(ideaData, ideaId = null) {
    console.log('💾 SALVANDO IDEIA:', { ideaData, ideaId, isApiMode });
    
    try {
        if (isApiMode) {
            console.log('🔗 Tentando salvar via API...');
            console.log('   URL da API:', apiService.baseURL);
            console.log('   Dados a salvar:', ideaData);
            
            if (ideaId) {
                // Atualizar ideia existente
                console.log('✏️ Atualizando ideia existente:', ideaId);
                const response = await apiService.updateIdea(ideaId, ideaData);
                console.log('✅ Resposta da atualização:', response);
                showSuccessMessage('Ideia atualizada com sucesso!');
                return response.data;
            } else {
                // Criar nova ideia
                console.log('➕ Criando nova ideia...');
                const response = await apiService.createIdea(ideaData);
                console.log('✅ Resposta da criação:', response);
                showSuccessMessage('Ideia criada com sucesso!');
                return response.data;
            }
        } else {
            console.log('💿 Salvando no localStorage...');
            // Modo localStorage
            if (ideaId) {
                const ideaIndex = ideas.findIndex(i => i.id === ideaId);
                if (ideaIndex !== -1) {
                    ideas[ideaIndex] = { ...ideas[ideaIndex], ...ideaData, updated_at: new Date().toISOString() };
                    console.log('✅ Ideia atualizada no localStorage');
                }
            } else {
                const newIdea = {
                    id: Date.now().toString(),
                    ...ideaData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                ideas.push(newIdea);
                console.log('✅ Nova ideia adicionada ao localStorage:', newIdea);
            }
            saveIdeasToLocalStorage();
            showSuccessMessage('Ideia salva localmente!');
            return null;
        }
    } catch (error) {
        console.error('❌ ERRO AO SALVAR IDEIA:', error);
        console.error('   Stack trace:', error.stack);
        console.error('   Modo API ativo?', isApiMode);
        console.error('   URL tentada:', apiService.baseURL);
        
        showErrorMessage(`Erro ao salvar ideia: ${error.message}`);
        throw error;
    }
}

// Excluir ideia (API ou localStorage)
async function removeIdea(ideaId) {
    try {
        if (isApiMode) {
            await apiService.deleteIdea(ideaId);
            showSuccessMessage('Ideia excluída com sucesso!');
        } else {
            ideas = ideas.filter(idea => idea.id !== ideaId);
            saveIdeasToLocalStorage();
            showSuccessMessage('Ideia excluída com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao excluir ideia:', error);
        showErrorMessage('Erro ao excluir ideia. Tente novamente.');
        throw error;
    }
}

// Salvar no localStorage (fallback)
function saveIdeasToLocalStorage() {
    try {
        localStorage.setItem('ideasApp_ideas', JSON.stringify(ideas));
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
}

// ========== EVENT HANDLERS ATUALIZADOS ==========

// Configurar event listeners
function setupEventListeners() {
    ideaForm.addEventListener('submit', handleSubmitIdea);
    categoryFilter.addEventListener('change', handleFilterChange);
    keywordFilter.addEventListener('input', handleKeywordFilter);
    closeModal.addEventListener('click', closeIdeaModal);
    cancelIdea.addEventListener('click', closeIdeaModal);
    btnAddIdea.addEventListener('click', openAddModal);
    fabAddIdea.addEventListener('click', openAddModal);
    
    // View controls
    viewBtns.forEach(btn => {
        btn.addEventListener('click', handleViewChange);
    });
    
    // Mobile menu controls
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        sidebarOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on links inside sidebar
        sidebar.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    }
    
    // Fechar modal clicando fora dele
    window.addEventListener('click', (event) => {
        if (event.target === ideaModal) {
            closeIdeaModal();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

// Manipular envio de ideia (adicionar ou editar)
async function handleSubmitIdea(event) {
    event.preventDefault();
    
    const formData = new FormData(ideaForm);
    const ideaData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        priority: formData.get('priority')
    };

    try {
        const ideaId = isEditMode ? document.getElementById('ideaId').value : null;
        await saveIdea(ideaData, ideaId);
        
        closeIdeaModal();
        
        // Recarregar ideias
        if (isApiMode) {
            await loadIdeasFromApi();
        } else {
        renderIdeas();
        updateStats();
        }
    } catch (error) {
        // Erro já foi tratado na função saveIdea
    }
}

// Manipular mudança de filtro
async function handleFilterChange(event) {
    currentFilter = event.target.value;
    
    if (isApiMode) {
        await loadIdeasFromApi();
    } else {
    renderIdeas();
    updateStats();
    }
}

// Manipular filtro por palavra-chave
async function handleKeywordFilter(event) {
    currentKeyword = event.target.value.toLowerCase().trim();
    
    if (isApiMode) {
        // Debounce para evitar muitas requisições
        clearTimeout(window.keywordTimeout);
        window.keywordTimeout = setTimeout(async () => {
            await loadIdeasFromApi();
        }, 300);
    } else {
    renderIdeas();
    updateStats();
    }
}

// Manipular mudança de visualização
function handleViewChange(event) {
    const view = event.target.closest('.view-btn').dataset.view;
    currentView = view;
    
    // Atualizar botões ativos
    viewBtns.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.view-btn').classList.add('active');
    
    // Atualizar classe do container
    ideasContainer.className = `ideas-container ${view}-view`;
}

// ========== FUNÇÕES AUXILIARES ATUALIZADAS ==========

// Excluir ideia
async function deleteIdea(ideaId) {
    if (confirm('Tem certeza que deseja excluir esta ideia?')) {
        try {
            await removeIdea(ideaId);
            
            if (isApiMode) {
                await loadIdeasFromApi();
            } else {
                renderIdeas();
                updateStats();
            }
        } catch (error) {
            // Erro já foi tratado na função removeIdea
        }
    }
}

// Abrir modal de edição
async function openEditModal(ideaId) {
    try {
        let idea;
        
        if (isApiMode) {
            const response = await apiService.getIdea(ideaId);
            idea = response.data;
        } else {
            idea = ideas.find(i => i.id === ideaId);
        }
        
        if (!idea) {
            showErrorMessage('Ideia não encontrada.');
            return;
        }

        isEditMode = true;
        modalTitle.textContent = 'Editar Ideia';
        
        // Preencher formulário
        document.getElementById('ideaId').value = idea.id;
        document.getElementById('ideaTitle').value = idea.title;
        document.getElementById('ideaDescription').value = idea.description || '';
        document.getElementById('ideaCategory').value = idea.category;
        document.getElementById('ideaPriority').value = idea.priority;
        
        ideaModal.style.display = 'flex';
    } catch (error) {
        console.error('Erro ao carregar ideia para edição:', error);
        showErrorMessage('Erro ao carregar ideia para edição.');
    }
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Mostrar mensagem de erro
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Função para testar conexão com o backend
async function testBackendConnection() {
    try {
        const response = await fetch('/');
        const data = await response.json();
        console.log('Conexão com backend:', data);
        return true;
    } catch (error) {
        console.error('Erro ao conectar com backend:', error);
        return false;
    }
}

// Testar conexão ao carregar a página
testBackendConnection().then(connected => {
    if (connected) {
        console.log('✅ Backend conectado com sucesso!');
    } else {
        console.log('⚠️ Backend não disponível. Usando armazenamento local.');
    }
});

// Abrir modal para adicionar nova ideia
function openAddModal() {
    isEditMode = false;
    modalTitle.textContent = 'Nova Ideia';
    document.getElementById('saveIdea').innerHTML = '<i class="fas fa-save"></i> Salvar Ideia';
    ideaForm.reset();
    ideaModal.style.display = 'block';
}

// Fechar modal
function closeIdeaModal() {
    ideaModal.style.display = 'none';
    ideaForm.reset();
    isEditMode = false;
}

// Atualizar estatísticas
function updateStats() {
    const filteredIdeas = filterIdeas();
    totalIdeasStat.textContent = ideas.length;
    filteredIdeasStat.textContent = filteredIdeas.length;
}

// Filtrar ideias
function filterIdeas() {
    let filteredIdeas = ideas;
    
    // Filtrar por categoria
    if (currentFilter !== 'todas') {
        filteredIdeas = filteredIdeas.filter(idea => idea.category === currentFilter);
    }
    
    // Filtrar por palavra-chave
    if (currentKeyword) {
        filteredIdeas = filteredIdeas.filter(idea => 
            idea.title.toLowerCase().includes(currentKeyword) ||
            idea.description.toLowerCase().includes(currentKeyword)
        );
    }
    
    return filteredIdeas;
}

// Renderizar ideias
function renderIdeas() {
    const filteredIdeas = filterIdeas();
    
    if (filteredIdeas.length === 0) {
        ideasContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-lightbulb"></i>
                <h3>Nenhuma ideia encontrada</h3>
                <p>Que tal adicionar sua primeira ideia brilhante?</p>
            </div>
        `;
        return;
    }

    ideasContainer.innerHTML = filteredIdeas
        .map(idea => createIdeaCard(idea))
        .join('');
}

// Criar card de ideia
function createIdeaCard(idea) {
    const formattedDate = formatDate(idea.created_at);
    const categoryLabel = getCategoryLabel(idea.category);
    const priorityLabel = getPriorityLabel(idea.priority);
    
    return `
        <div class="idea-card priority-${idea.priority || 'media'}" data-id="${idea.id}">
            <h3>${escapeHtml(idea.title)}</h3>
            <p>${escapeHtml(idea.description)}</p>
            <div class="idea-meta">
                <div>
                    <span class="idea-category">${categoryLabel}</span>
                    <span class="idea-priority priority-${idea.priority || 'media'}">${priorityLabel}</span>
                </div>
                <span class="idea-date">${formattedDate}</span>
            </div>
            <div class="idea-actions">
                <button class="btn-small btn-edit" onclick="openEditModal('${idea.id}')">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn-small btn-delete" onclick="deleteIdea('${idea.id}')">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </div>
        </div>
    `;
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Obter label da categoria
function getCategoryLabel(category) {
    const labels = {
        'tecnologia': '🔧 Tecnologia',
        'negocio': '💼 Negócio',
        'pessoal': '👤 Pessoal',
        'criativo': '🎨 Criativo',
        'outro': '📝 Outro'
    };
    return labels[category] || '📝 Outro';
}

// Obter label da prioridade
function getPriorityLabel(priority) {
    const labels = {
        'alta': '🔴 Alta',
        'media': '🟡 Média',
        'baixa': '🟢 Baixa'
    };
    return labels[priority] || '🟡 Média';
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Exportar funções para uso global (se necessário)
window.IdeasApp = {
    loadIdeas: loadIdeasFromApi,
    renderIdeas,
    testBackendConnection
};

// Tornar funções disponíveis globalmente para os botões
window.openEditModal = openEditModal;
window.deleteIdea = deleteIdea; 

// ========== FUNÇÃO DE DEBUG ==========

// Função de debug para testar conectividade (disponível globalmente)
window.debugApiConnection = async function() {
    console.log('🔍 DIAGNÓSTICO DE CONECTIVIDADE API');
    console.log('=====================================');
    console.log('🌐 URL atual:', window.location.href);
    console.log('🏠 Hostname:', window.location.hostname);
    console.log('🔗 URL base da API:', apiService.baseURL);
    console.log('🎯 Endpoint de health:', apiService.baseURL + '/health');
    
    try {
        console.log('📡 Testando conexão...');
        const response = await fetch(apiService.baseURL + '/health');
        console.log('📊 Status da resposta:', response.status);
        console.log('✅ Headers da resposta:', [...response.headers.entries()]);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API respondeu com sucesso:', data);
            console.log('💾 Status do banco:', data.database);
            console.log('⏱️ Uptime do servidor:', data.uptime + 's');
        } else {
            console.log('❌ API respondeu com erro:', response.status);
        }
    } catch (error) {
        console.log('❌ Erro ao conectar com a API:', error.message);
        console.log('🔍 Tipo do erro:', error.name);
        console.log('📋 Stack trace:', error.stack);
    }
    
    console.log('=====================================');
};

// Funções para menu mobile
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}

// ========== FUNÇÃO DE DEBUG AVANÇADO ==========

// Função de debug completo para testar todas as funcionalidades
window.debugCompleto = async function() {
    console.log('🔍 DIAGNÓSTICO COMPLETO DO SISTEMA');
    console.log('====================================');
    
    // 1. Informações básicas
    console.log('📍 INFORMAÇÕES BÁSICAS:');
    console.log('   URL atual:', window.location.href);
    console.log('   Hostname:', window.location.hostname);
    console.log('   É localhost?', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    console.log('   Modo API ativo?', isApiMode);
    console.log('   URL base da API:', apiService.baseURL);
    
    // 2. Teste de conectividade
    console.log('\n📡 TESTE DE CONECTIVIDADE:');
    try {
        const healthResponse = await fetch(apiService.baseURL + '/health');
        console.log('   Status /health:', healthResponse.status);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('   Dados do health:', healthData);
        } else {
            console.log('   Erro no health:', await healthResponse.text());
        }
    } catch (error) {
        console.log('   ❌ Erro na conectividade:', error.message);
    }
    
    // 3. Teste de endpoints
    console.log('\n🎯 TESTE DE ENDPOINTS:');
    try {
        const ideasResponse = await fetch(apiService.baseURL + '/ideas');
        console.log('   Status /ideas:', ideasResponse.status);
        if (ideasResponse.ok) {
            const ideasData = await ideasResponse.json();
            console.log('   Ideias encontradas:', ideasData.data?.length || 0);
            console.log('   Primeiras ideias:', ideasData.data?.slice(0, 2));
        } else {
            console.log('   Erro em /ideas:', await ideasResponse.text());
        }
    } catch (error) {
        console.log('   ❌ Erro ao buscar ideias:', error.message);
    }
    
    // 4. Teste de criação
    console.log('\n✏️ TESTE DE CRIAÇÃO:');
    try {
        const testIdea = {
            title: `Teste Debug ${new Date().toLocaleTimeString()}`,
            description: 'Ideia criada pelo sistema de debug',
            category: 'tecnologia',
            priority: 'media'
        };
        
        const createResponse = await fetch(apiService.baseURL + '/ideas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testIdea)
        });
        
        console.log('   Status criação:', createResponse.status);
        if (createResponse.ok) {
            const createdIdea = await createResponse.json();
            console.log('   ✅ Ideia criada:', createdIdea.data?.title);
            
            // Verificar se aparece na lista
            const verifyResponse = await fetch(apiService.baseURL + '/ideas');
            if (verifyResponse.ok) {
                const allIdeas = await verifyResponse.json();
                const foundIdea = allIdeas.data?.find(i => i.title === testIdea.title);
                console.log('   ✅ Ideia encontrada na lista?', !!foundIdea);
            }
        } else {
            console.log('   ❌ Erro na criação:', await createResponse.text());
        }
    } catch (error) {
        console.log('   ❌ Erro no teste de criação:', error.message);
    }
    
    // 5. Estado local
    console.log('\n💾 ESTADO LOCAL:');
    console.log('   Ideias na memória:', ideas.length);
    console.log('   localStorage existe?', !!localStorage.getItem('ideasApp_ideas'));
    console.log('   Flag de migração:', localStorage.getItem('ideasApp_migrated'));
    
    console.log('\n====================================');
    console.log('✅ Diagnóstico completo concluído!');
}; 