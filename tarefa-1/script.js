const products = [
  { id: 1, name: 'Processador Intel Core i5 12400F', category: 'Processadores', code: 'CPU-001', price: 899, stock: 12 },
  { id: 2, name: 'Placa de Vídeo RTX 4060', category: 'Placas de vídeo', code: 'GPU-002', price: 2199, stock: 4 },
  { id: 3, name: 'Memória RAM DDR4 16GB', category: 'Memória', code: 'RAM-003', price: 299, stock: 0 },
  { id: 4, name: 'SSD NVMe 1TB', category: 'Armazenamento', code: 'SSD-004', price: 349, stock: 7 },
  { id: 5, name: 'Placa-Mãe B760', category: 'Placas-mãe', code: 'MBO-005', price: 799, stock: 2 },
  { id: 6, name: 'Fonte 650W 80+ Bronze', category: 'Fonte', code: 'PSU-006', price: 289, stock: 15 },
  { id: 7, name: 'Cooler para CPU', category: 'Resfriamento', code: 'COOL-007', price: 159, stock: 9 },
  { id: 8, name: 'Gabinete Gamer RGB', category: 'Gabinetes', code: 'CASE-008', price: 389, stock: 1 }
];

const state = {
  search: '',
  category: 'all',
  sort: 'name',
  cart: []
};

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const loginToggle = document.getElementById('login-toggle');
const loginModal = document.getElementById('login-modal');
const loginClose = document.getElementById('login-close');
const loginSubmit = document.getElementById('login-submit');
const loginName = document.getElementById('login-name');
const loginPassword = document.getElementById('login-password');
const loginLabel = document.getElementById('login-label');

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function getStatus(stock) {
  if (stock <= 0) return { label: 'Sem estoque', className: 'out-stock' };
  if (stock <= 5) return { label: 'Baixo', className: 'low-stock' };
  return { label: 'Em estoque', className: 'in-stock' };
}

function buildCategoryOptions() {
  const categories = ['all', ...new Set(products.map((product) => product.category))];
  categoryFilter.innerHTML = categories
    .map((category) => `<option value="${category}">${category === 'all' ? 'Todas' : category}</option>`)
    .join('');
}

function renderSkeletons() {
  productGrid.innerHTML = Array.from({ length: 6 }, () => '<div class="skeleton-card"></div>').join('');
}

function getVisibleProducts() {
  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(state.search.toLowerCase()) || product.code.toLowerCase().includes(state.search.toLowerCase());
    const matchesCategory = state.category === 'all' || product.category === state.category;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (state.sort === 'price-asc') return a.price - b.price;
    if (state.sort === 'price-desc') return b.price - a.price;
    if (state.sort === 'stock') return b.stock - a.stock;
    return a.name.localeCompare(b.name);
  });

  return sorted;
}

function renderProducts() {
  const visible = getVisibleProducts();
  if (!visible.length) {
    productGrid.innerHTML = '<div class="empty-state">Nenhum produto encontrado para os filtros atuais.</div>';
    return;
  }

  productGrid.innerHTML = visible
    .map((product) => {
      const status = getStatus(product.stock);
      return `
        <article class="product-card">
          <div class="price-row">
            <strong>${product.name}</strong>
            <span class="status-badge ${status.className}">${status.label}</span>
          </div>
          <div class="product-meta">Código: ${product.code}</div>
          <div class="product-meta">Categoria: ${product.category}</div>
          <div class="product-meta">Estoque: ${product.stock}</div>
          <div class="price-row">
            <span>${formatCurrency(product.price)}</span>
            <button class="add-button" type="button" data-id="${product.id}">Adicionar</button>
          </div>
        </article>
      `;
    })
    .join('');
}

// Lógica do carrinho: adiciona ou incrementa itens e recalcula o total em tempo real.
function addToCart(productId) {
  const product = products.find((item) => item.id === Number(productId));
  if (!product || product.stock <= 0) return;

  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  product.stock -= 1;
  renderProducts();
  renderCart();
}

function removeFromCart(productId) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  const product = products.find((entry) => entry.id === productId);
  if (product) {
    product.stock += item.quantity;
  }

  state.cart = state.cart.filter((entry) => entry.id !== productId);
  renderProducts();
  renderCart();
}

function renderCart() {
  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="empty-state">Seu carrinho está vazio.</div>';
    cartCount.textContent = '0 itens';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartItems.innerHTML = state.cart
    .map((item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <div class="product-meta">Qtd: ${item.quantity}</div>
          <div class="product-meta">${formatCurrency(item.price * item.quantity)}</div>
        </div>
        <button class="remove-button" type="button" data-id="${item.id}">Remover</button>
      </div>
    `)
    .join('');

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = `${state.cart.reduce((sum, item) => sum + item.quantity, 0)} itens`;
  cartTotal.textContent = formatCurrency(total);
}

// Lógica da alternância de tema: salva a preferência no localStorage e aplica um atributo no HTML.
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('erp-theme', theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('erp-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(savedTheme || preferredTheme);
}

function bindEvents() {
  searchInput.addEventListener('input', (event) => {
    state.search = event.target.value;
    renderProducts();
  });

  loginToggle.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
    loginName.focus();
  });

  loginClose.addEventListener('click', () => {
    loginModal.classList.add('hidden');
  });

  loginSubmit.addEventListener('click', () => {
    const name = loginName.value.trim();
    const password = loginPassword.value.trim();
    if (!name || !password) return;
    loginLabel.textContent = name;
    loginModal.classList.add('hidden');
    loginName.value = '';
    loginPassword.value = '';
  });

  loginModal.addEventListener('click', (event) => {
    if (event.target === loginModal) {
      loginModal.classList.add('hidden');
    }
  });

  categoryFilter.addEventListener('change', (event) => {
    state.category = event.target.value;
    renderProducts();
  });

  sortFilter.addEventListener('change', (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (button) {
      addToCart(button.dataset.id);
    }
  });

  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (button) {
      removeFromCart(Number(button.dataset.id));
    }
  });

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

// Carregamento do logo: o layout mostra um estado esqueleto enquanto os dados são preparados.
function init() {
  buildCategoryOptions();
  initTheme();
  bindEvents();
  renderSkeletons();
  setTimeout(() => {
    renderProducts();
    renderCart();
  }, 900);
}

window.addEventListener('DOMContentLoaded', init);
