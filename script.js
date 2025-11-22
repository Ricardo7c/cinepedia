const cardContainer = document.querySelector(".card-container");
const campoBusca = document.getElementById("campo-busca");
const themeToggleButton = document.getElementById("theme-toggle");
const body = document.body;
const addMovieDialog = document.getElementById('add-movie-dialog');
const addMovieButton = document.getElementById('add-movie-button');
const cancelButton = document.getElementById('cancel-button');
const addMovieForm = document.getElementById('add-movie-form');
let dados = [];

// Carrega os dados do JSON uma vez quando a página é carregada.
window.addEventListener('DOMContentLoaded', async () => {
    // Verifica e aplica o tema salvo no localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        themeToggleButton.textContent = '☀️';
    } else {
        themeToggleButton.textContent = '🌙';
    }

    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados); // Exibe todos os cards inicialmente
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        cardContainer.innerHTML = `<p style="text-align: center; color: var(--tertiary-color);">Não foi possível carregar os filmes. Tente novamente mais tarde.</p>`;
    }
});

function iniciarBusca() {
    const termoBusca = campoBusca.value.toLowerCase();
    
    if (termoBusca.trim() === '') {
        renderizarCards(dados); // Se a busca estiver vazia, mostra todos os cards
        return;
    }
    const resultados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca)
    );
    renderizarCards(resultados);
}

// Adiciona um "escutador" para a tecla "Enter" no campo de busca
campoBusca.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        iniciarBusca();
    }
});

function renderizarCards(cardsParaRenderizar) {
    cardContainer.innerHTML = ''; // Limpa os cards existentes
    for (const dado of cardsParaRenderizar) {
        const article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
                <h2>${dado.nome}</h2>
                <p>${dado.ano}</p>
                <p>${dado.descricao}</p>
                <a href="${dado.link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
}

// Event listener para o botão de troca de tema
themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeToggleButton.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggleButton.textContent = '🌙';
    }
});

// Abre o modal
addMovieButton.addEventListener('click', () => {
    addMovieDialog.showModal();
});

// Fecha o modal com o botão "Cancelar"
cancelButton.addEventListener('click', () => {
    addMovieDialog.close();
});

// Lógica para adicionar o novo filme
addMovieForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const novoFilme = {
        nome: document.getElementById('movie-name').value,
        ano: parseInt(document.getElementById('movie-year').value, 10),
        descricao: document.getElementById('movie-description').value,
        link: document.getElementById('movie-link').value
    };

    dados.unshift(novoFilme); // Adiciona o novo filme no início do array
    renderizarCards(dados); // Re-renderiza todos os cards

    addMovieForm.reset(); // Limpa o formulário
    addMovieDialog.close(); // Fecha o modal
});