// Estado da aplicação
let ideas = [];
let currentFilter = 'todas';
let currentKeyword = '';
let currentView = 'grid';
let isEditMode = false;

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
document.addEventListener('DOMContentLoaded', function() {
    console.log('IdeasApp carregado!');
    loadIdeas();
    setupEventListeners();
});

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
    
    // Fechar modal clicando fora dele
    window.addEventListener('click', (event) => {
        if (event.target === ideaModal) {
            closeIdeaModal();
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
        priority: formData.get('priority'),
        updatedAt: new Date().toISOString()
    };

    try {
        if (isEditMode) {
            // Editar ideia existente
            const ideaId = document.getElementById('ideaId').value;
            const ideaIndex = ideas.findIndex(i => i.id === ideaId);
            if (ideaIndex !== -1) {
                ideas[ideaIndex] = { ...ideas[ideaIndex], ...ideaData };
                showSuccessMessage('Ideia atualizada com sucesso!');
            }
        } else {
            // Adicionar nova ideia
            const newIdea = {
                id: Date.now().toString(),
                ...ideaData,
                createdAt: new Date().toISOString()
            };
            ideas.push(newIdea);
            showSuccessMessage('Ideia adicionada com sucesso!');
        }
        
        saveIdeasToLocalStorage();
        closeIdeaModal();
        renderIdeas();
        updateStats();
    } catch (error) {
        console.error('Erro ao salvar ideia:', error);
        showErrorMessage('Erro ao salvar ideia. Tente novamente.');
    }
}

// Manipular mudança de filtro
function handleFilterChange(event) {
    currentFilter = event.target.value;
    renderIdeas();
    updateStats();
}

// Manipular filtro por palavra-chave
function handleKeywordFilter(event) {
    currentKeyword = event.target.value.toLowerCase().trim();
    renderIdeas();
    updateStats();
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

// Carregar ideias
function loadIdeas() {
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
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'Curso Online de Programação',
                    description: 'Criar um curso completo de programação web para iniciantes.',
                    category: 'negocio',
                    priority: 'media',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '3',
                    title: 'Sistema de Organização Pessoal',
                    description: 'Desenvolver um método eficaz para organizar tarefas e metas pessoais.',
                    category: 'pessoal',
                    priority: 'baixa',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
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

// Salvar ideias no localStorage
function saveIdeasToLocalStorage() {
    try {
        localStorage.setItem('ideasApp_ideas', JSON.stringify(ideas));
    } catch (error) {
        console.error('Erro ao salvar ideias:', error);
    }
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

// Criar card de ideia
function createIdeaCard(idea) {
    const formattedDate = formatDate(idea.createdAt);
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

// Abrir modal para editar ideia
function openEditModal(ideaId) {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;
    
    isEditMode = true;
    modalTitle.textContent = 'Editar Ideia';
    document.getElementById('saveIdea').innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
    
    document.getElementById('ideaId').value = idea.id;
    document.getElementById('ideaTitle').value = idea.title;
    document.getElementById('ideaDescription').value = idea.description;
    document.getElementById('ideaCategory').value = idea.category;
    document.getElementById('ideaPriority').value = idea.priority || 'media';
    
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

// Excluir ideia
function deleteIdea(ideaId) {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;
    
    const confirmDelete = confirm(`Tem certeza que deseja excluir a ideia "${idea.title}"?`);
    if (!confirmDelete) return;
    
    try {
        ideas = ideas.filter(i => i.id !== ideaId);
        saveIdeasToLocalStorage();
        
        showSuccessMessage('Ideia excluída com sucesso!');
        renderIdeas();
        updateStats();
    } catch (error) {
        console.error('Erro ao excluir ideia:', error);
        showErrorMessage('Erro ao excluir ideia. Tente novamente.');
    }
}

// Exportar funções para uso global (se necessário)
window.IdeasApp = {
    loadIdeas,
    renderIdeas,
    testBackendConnection
};

// Tornar funções disponíveis globalmente para os botões
window.openEditModal = openEditModal;
window.deleteIdea = deleteIdea; 