// Estado da aplicação
let ideas = [];
let currentFilter = 'todas';
let currentKeyword = '';

// Elementos DOM
const ideaForm = document.getElementById('ideaForm');
const ideasContainer = document.getElementById('ideasContainer');
const categoryFilter = document.getElementById('categoryFilter');
const keywordFilter = document.getElementById('keywordFilter');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editIdeaForm');
const closeModal = document.querySelector('.close');
const cancelEdit = document.getElementById('cancelEdit');

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
    editForm.addEventListener('submit', handleEditIdea);
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    
    // Fechar modal clicando fora dele
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });
}

// Manipular envio de nova ideia
async function handleSubmitIdea(event) {
    event.preventDefault();
    
    const formData = new FormData(ideaForm);
    const newIdea = {
        id: Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    try {
        // Por enquanto, vamos armazenar localmente
        // Futuramente, isso será uma chamada para a API
        ideas.push(newIdea);
        saveIdeasToLocalStorage();
        
        showSuccessMessage('Ideia adicionada com sucesso!');
        ideaForm.reset();
        renderIdeas();
    } catch (error) {
        console.error('Erro ao adicionar ideia:', error);
        showErrorMessage('Erro ao adicionar ideia. Tente novamente.');
    }
}

// Manipular mudança de filtro
function handleFilterChange(event) {
    currentFilter = event.target.value;
    renderIdeas();
}

// Manipular filtro por palavra-chave
function handleKeywordFilter(event) {
    currentKeyword = event.target.value.toLowerCase().trim();
    renderIdeas();
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
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'Curso Online de Programação',
                    description: 'Criar um curso completo de programação web para iniciantes.',
                    category: 'negocio',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            saveIdeasToLocalStorage();
        }
        renderIdeas();
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
                <h3>Nenhuma ideia encontrada</h3>
                <p>Que tal adicionar sua primeira ideia?</p>
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
    
    return `
        <div class="idea-card" data-id="${idea.id}">
            <h3>${escapeHtml(idea.title)}</h3>
            <p>${escapeHtml(idea.description)}</p>
            <div class="idea-meta">
                <span class="idea-category">${categoryLabel}</span>
                <span class="idea-date">${formattedDate}</span>
            </div>
            <div class="idea-actions">
                <button class="btn-small btn-edit" onclick="openEditModal('${idea.id}')">
                    ✏️ Editar
                </button>
                <button class="btn-small btn-delete" onclick="deleteIdea('${idea.id}')">
                    🗑️ Excluir
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
        'tecnologia': 'Tecnologia',
        'negocio': 'Negócio',
        'pessoal': 'Pessoal',
        'criativo': 'Criativo',
        'outro': 'Outro'
    };
    return labels[category] || 'Outro';
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
    messageDiv.textContent = message;
    
    const form = document.querySelector('.add-idea-section');
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Mostrar mensagem de erro
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    
    const form = document.querySelector('.add-idea-section');
    form.insertBefore(messageDiv, form.firstChild);
    
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

// Abrir modal de edição
function openEditModal(ideaId) {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;
    
    document.getElementById('editIdeaId').value = idea.id;
    document.getElementById('editIdeaTitle').value = idea.title;
    document.getElementById('editIdeaDescription').value = idea.description;
    document.getElementById('editIdeaCategory').value = idea.category;
    
    editModal.style.display = 'block';
}

// Fechar modal de edição
function closeEditModal() {
    editModal.style.display = 'none';
    editForm.reset();
}

// Manipular edição de ideia
async function handleEditIdea(event) {
    event.preventDefault();
    
    const ideaId = document.getElementById('editIdeaId').value;
    const formData = new FormData(editForm);
    
    const updatedIdea = {
        id: ideaId,
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        updatedAt: new Date().toISOString()
    };

    try {
        const ideaIndex = ideas.findIndex(i => i.id === ideaId);
        if (ideaIndex !== -1) {
            ideas[ideaIndex] = { ...ideas[ideaIndex], ...updatedIdea };
            saveIdeasToLocalStorage();
            
            showSuccessMessage('Ideia atualizada com sucesso!');
            closeEditModal();
            renderIdeas();
        }
    } catch (error) {
        console.error('Erro ao editar ideia:', error);
        showErrorMessage('Erro ao editar ideia. Tente novamente.');
    }
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