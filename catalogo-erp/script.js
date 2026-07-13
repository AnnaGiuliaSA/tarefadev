// 1. Catálogo de Produtos Estilo Papelaria/Informática Corporativa (12 Itens)
const produtos = [
    { id: 1, nome: "Notebook Dell Vostro Core i5 16GB", categoria: "Informatica", preco: 4599.90, estoque: 14, descricao: "Notebook corporativo de alta performance com SSD de 512GB e Windows 11 Pro instalado." },
    { id: 2, nome: "Monitor Gamer LG 24'' IPS Full HD", categoria: "Informatica", preco: 849.00, estoque: 8, descricao: "Monitor profissional com taxa de atualização de 75Hz e calibração de cores IPS." },
    { id: 3, nome: "Teclado Mecânico Logitech MX Mechanical", categoria: "Informatica", preco: 799.90, estoque: 22, descricao: "Teclado sem fio de alta precisão com switches silenciosos, ideal para escritório." },
    { id: 4, nome: "Mouse Sem Fio Ergonômico Vertical", categoria: "Informatica", preco: 249.90, estoque: 35, descricao: "Mouse ergonômico projetado para prevenir lesões por esforço repetitivo (LER)." },
    { id: 5, nome: "Cadeira Escritório Ergonômica NR17", categoria: "Escritorio", preco: 1290.00, estoque: 6, descricao: "Cadeira com ajuste lombar, de braços e encosto de cabeça, totalmente regulável dentro da NR17." },
    { id: 6, nome: "Organizador de Cabos Espiral 2 metros", categoria: "Escritorio", preco: 29.90, estoque: 150, descricao: "Organizador flexível para embutir fios de computadores e estações de trabalho." },
    { id: 7, nome: "Luminária de Mesa LED Articulada", categoria: "Escritorio", preco: 119.90, estoque: 40, descricao: "Luminária com 3 tones de luz e controle de intensidade por toque USB." },
    { id: 8, nome: "Papel Sulfite A4 Chamex 75g (500 folhas)", categoria: "Papelaria", preco: 32.50, estoque: 200, descricao: "Resma de papel A4 branco de alta opacidade, ideal para impressoras laser e jato de tinta." },
    { id: 9, nome: "Fragmentadora de Papel Sigilo Max", categoria: "Escritorio", preco: 489.00, estoque: 5, descricao: "Fragmentadora em corte em tiras, capacidade para até 8 folhas simultâneas com cesto integrado." },
    { id: 10, nome: "Quadro Branco Magnético 120x90cm", categoria: "Escritorio", preco: 189.90, estoque: 11, descricao: "Lousa digitalizável com moldura de alumínio e fixação invisível para salas de reunião." },
    { id: 11, nome: "Caneta Gel Uniball Signo Black (Cx c/ 12)", categoria: "Papelaria", preco: 144.00, estoque: 50, descricao: "Canetas de tinta gel de secagem rápida com mecanismo anti-fraude à prova d'água." },
    { id: 12, nome: "Hub USB-C Baseus 6 em 1", categoria: "Informatica", preco: 210.00, estoque: 28, descricao: "Adaptador em alumínio com saídas HDMI 4K, 3 portas USB 3.0 e leitor de cartões SD." }
];

// Variável global para armazenar o carrinho e o produto selecionado no momento
let carrinho = [];
let produtoSelecionadoNoModal = null;

// 2. Mapeamento dos Elementos do DOM (HTML)
const gridProdutos = document.getElementById('products-grid');
const inputPesquisa = document.getElementById('search-input');
const botoesFiltro = document.querySelectorAll('.btn-filter');
const botaoTema = document.getElementById('theme-toggle');
const contadorCarrinho = document.getElementById('cart-count');
const botaoCarrinhoTopo = document.getElementById('cart-btn');

// Elementos do Modal
const modal = document.getElementById('product-modal');
const modalTitulo = document.getElementById('modal-title');
const modalCategoria = document.getElementById('modal-category');
const modalDescricao = document.getElementById('modal-description');
const modalPreco = document.getElementById('modal-price');
const botaoFecharModal = document.getElementById('close-modal');
const botaoAdicionarAoCarrinho = document.getElementById('add-to-cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotal = document.getElementById('cart-total');
const botaoFecharCartModal = document.getElementById('close-cart-modal');

// 3. Função para renderizar os cards dos produtos na tela
function renderizarProdutos(listaProdutos) {
    gridProdutos.innerHTML = ''; 
    
    if (listaProdutos.length === 0) {
        gridProdutos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">Nenhum produto encontrado com esses termos.</p>`;
        return;
    }

    listaProdutos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cssText = `
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 20px;
            cursor: pointer;
            box-shadow: var(--shadow-sm);
            transition: transform 0.2s, box-shadow 0.2s;
        `;
        
        card.onmouseenter = () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = 'var(--shadow-md)';
        };
        card.onmouseleave = () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-sm)';
        };

        const statusEstoque = produto.estoque <= 0 ? 'Sem estoque' : produto.estoque <= 10 ? 'Estoque Baixo' : 'Em Estoque';
        const corEstoque = produto.estoque <= 0 ? '#ef4444' : produto.estoque <= 10 ? '#ef4444' : '#10b981';

        card.innerHTML = `
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-color); text-transform: uppercase;">${produto.categoria}</span>
            <h3 style="margin: 10px 0 5px 0; font-size: 1.1rem; color: var(--text-main);">${produto.nome}</h3>
            <p style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin: 15px 0 10px 0;">R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <span style="font-size: 0.8rem; color: ${corEstoque}; font-weight: 600;">● ${statusEstoque} (${produto.estoque} un)</span>
        `;

        card.addEventListener('click', () => abrirModal(produto));
        gridProdutos.appendChild(card);
    });
}

// 4. Função para Abrir o Modal com os dados do produto específico
function atualizarEstadoBotaoAdicionar(produto) {
    const semEstoque = produto && produto.estoque <= 0;
    botaoAdicionarAoCarrinho.disabled = semEstoque;
    botaoAdicionarAoCarrinho.style.opacity = semEstoque ? '0.6' : '1';
    botaoAdicionarAoCarrinho.style.cursor = semEstoque ? 'not-allowed' : 'pointer';
    botaoAdicionarAoCarrinho.innerText = semEstoque ? 'Sem estoque' : 'Adicionar ao Pedido';
}

function abrirModal(produto) {
    produtoSelecionadoNoModal = produto; // Guarda a referência do produto
    modalTitulo.innerText = produto.nome;
    modalCategoria.innerText = produto.categoria;
    modalDescricao.innerText = produto.descricao;
    modalPreco.innerText = `R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    atualizarEstadoBotaoAdicionar(produto);

    modal.style.display = 'flex'; 
}

// 5. Função para Fechar o Modal
function fecharModal() {
    modal.style.display = 'none';
    produtoSelecionadoNoModal = null;
    atualizarEstadoBotaoAdicionar(null);
}

function abrirCarrinho() {
    renderizarCarrinho();
    cartModal.style.display = 'flex';
}

function fecharCarrinho() {
    cartModal.style.display = 'none';
}

function renderizarCarrinho() {
    cartItemsList.innerHTML = '';

    if (carrinho.length === 0) {
        cartItemsList.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
        cartTotal.innerText = 'Total: R$ 0,00';
        return;
    }

    let total = 0;
    carrinho.forEach((item, index) => {
        total += item.preco;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.nome}</span>
                <span class="cart-item-price">R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <button class="btn-remove-cart" data-index="${index}" aria-label="Remover ${item.nome}">×</button>
        `;

        itemEl.querySelector('.btn-remove-cart').addEventListener('click', () => removerDoCarrinho(index));
        cartItemsList.appendChild(itemEl);
    });

    cartTotal.innerText = `Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function removerDoCarrinho(index) {
    const itemRemovido = carrinho[index];
    if (!itemRemovido) return;

    const produtoOriginal = produtos.find(produto => produto.id === itemRemovido.id);
    if (produtoOriginal) {
        produtoOriginal.estoque += 1;
    }

    carrinho.splice(index, 1);
    contadorCarrinho.innerText = carrinho.length;
    filtrarProdutos();
    renderizarCarrinho();
}

botaoFecharModal.addEventListener('click', fecharModal);
botaoFecharCartModal.addEventListener('click', fecharCarrinho);
window.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
    if (e.target === cartModal) fecharCarrinho();
});
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (cartModal.style.display === 'flex') {
            fecharCarrinho();
        } else {
            fecharModal();
        }
    }
});

// 6. Lógica do Carrinho de Compras
botaoAdicionarAoCarrinho.addEventListener('click', () => {
    if (produtoSelecionadoNoModal) {
        if (produtoSelecionadoNoModal.estoque <= 0) {
            alert('Este produto está sem estoque no momento.');
            return;
        }

        produtoSelecionadoNoModal.estoque -= 1;
        carrinho.push(produtoSelecionadoNoModal);
        
        // Atualiza o contador visual do cabeçalho
        contadorCarrinho.innerText = carrinho.length;
        
        // Atualiza a lista de produtos exibida na tela
        filtrarProdutos();
        atualizarEstadoBotaoAdicionar(produtoSelecionadoNoModal);

        alert(`"${produtoSelecionadoNoModal.nome}" adicionado ao carrinho com sucesso!`);
        fecharModal();
    }
});

// Ver resumo do pedido ao clicar no botão do carrinho no topo
botaoCarrinhoTopo.addEventListener('click', () => {
    abrirCarrinho();
});

// 7. Lógica Combinada de Filtros e Barra de Pesquisa
function filtrarProdutos() {
    const textoBusca = inputPesquisa.value.toLowerCase();
    const botaoAtivo = document.querySelector('.btn-filter.active');
    const categoriaAtiva = botaoAtivo ? botaoAtivo.getAttribute('data-category') : 'todos';

    const produtosFiltrados = produtos.filter(produto => {
        const bateNome = produto.nome.toLowerCase().includes(textoBusca) || produto.descricao.toLowerCase().includes(textoBusca);
        const bateCategoria = categoriaAtiva === 'todos' || produto.categoria === categoriaAtiva;
        return bateNome && bateCategoria;
    });

    renderizarProdutos(produtosFiltrados);
}

inputPesquisa.addEventListener('input', filtrarProdutos);

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach(b => {
            b.classList.remove('active');
            b.style.backgroundColor = 'var(--bg-card)';
            b.style.color = 'var(--text-main)';
            b.style.border = '1px solid var(--border-color)';
        });
        
        botao.classList.add('active');
        botao.style.backgroundColor = 'var(--accent-color)';
        botao.style.color = 'white';
        botao.style.border = 'none';

        filtrarProdutos();
    });
});

// 8. Mecanismo de Alternância de Tema (Light / Dark Mode)
botaoTema.addEventListener('click', () => {
    const atualTema = document.documentElement.getAttribute('data-theme');
    if (atualTema === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

// Renderização inicial
renderizarProdutos(produtos);