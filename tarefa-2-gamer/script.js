const root = document.documentElement;
const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');
const themeToggle = document.getElementById('theme-toggle');
const loginToggle = document.getElementById('login-toggle');
const accountMenu = document.getElementById('account-menu');
const progressBar = document.querySelector('.progress-bar');
const scrollTopButton = document.getElementById('scroll-top');
const revealItems = Array.from(document.querySelectorAll('.reveal-on-scroll'));
const metricValues = Array.from(document.querySelectorAll('.metric-value'));
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = Array.from(document.querySelectorAll('.carousel-slide'));
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

let currentSlide = 0;
let autoPlayTimer;

// Inicializa o tema salvo ou respeita a preferência do sistema.
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.querySelector('.theme-toggle__icon').textContent = theme === 'dark' ? '☼' : '☾';
  localStorage.setItem('devgamer-theme', theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('devgamer-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(savedTheme || preferredTheme);
}

// Atualiza a barra de progresso topo conforme o scroll.
function updateProgressBar() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
  scrollTopButton.classList.toggle('is-visible', window.scrollY > 640);
}

// Garante que elementos revelem com um atraso sequencial.
function revealOnScroll(entries, observer) {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const element = entry.target;
      const delay = Number(element.dataset.delay || index * 80);
      element.style.transitionDelay = `${delay}ms`;
      element.classList.add('is-visible');
      observer.unobserve(element);
    }
  });
}

// Anima contadores quando entram no viewport.
function animateCounter(element) {
  const target = Number(element.dataset.count || 0);
  const duration = 1200;
  const startTime = performance.now();

  function frame(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = value.toLocaleString('pt-BR');

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      element.textContent = target.toLocaleString('pt-BR');
    }
  }

  requestAnimationFrame(frame);
}

function initRevealObserver() {
  const observer = new IntersectionObserver(revealOnScroll, {
    threshold: 0.2,
  });

  revealItems.forEach((item) => observer.observe(item));

  const metricsObserver = new IntersectionObserver((entries, metricsObserverInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        metricsObserverInstance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.65 });

  metricValues.forEach((value) => metricsObserver.observe(value));
}

// Exibe o slide atual no carrossel e respeita animações reduzidas.
function renderCarousel() {
  const offset = -currentSlide * 100;
  carouselTrack.style.transform = `translateX(${offset}%)`;
  carouselSlides.forEach((slide, index) => slide.classList.toggle('active', index === currentSlide));
}

function changeSlide(direction) {
  currentSlide = (currentSlide + direction + carouselSlides.length) % carouselSlides.length;
  renderCarousel();
}

function startAutoPlay() {
  if (reducedMotionQuery.matches) return;
  clearInterval(autoPlayTimer);
  autoPlayTimer = window.setInterval(() => changeSlide(1), 5000);
}

function initCarousel() {
  renderCarousel();
  startAutoPlay();

  prevButton.addEventListener('click', () => {
    changeSlide(-1);
    startAutoPlay();
  });

  nextButton.addEventListener('click', () => {
    changeSlide(1);
    startAutoPlay();
  });

  let startX = 0;
  let deltaX = 0;

  carouselTrack.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
    deltaX = 0;
  });

  carouselTrack.addEventListener('pointerup', (event) => {
    deltaX = event.clientX - startX;
    if (deltaX > 60) {
      changeSlide(-1);
    } else if (deltaX < -60) {
      changeSlide(1);
    }
    startAutoPlay();
  });

  carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  carouselTrack.addEventListener('mouseleave', startAutoPlay);
}

// Controle do menu hambúrguer para mobile.
function toggleMenu() {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}

function initNavigation() {
  menuToggle.addEventListener('click', toggleMenu);
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Volta ao topo com comportamento suave.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initScrollTop() {
  scrollTopButton.addEventListener('click', scrollToTop);
}

function toggleAccountMenu() {
  const isOpen = accountMenu.classList.toggle('is-open');
  loginToggle.classList.toggle('is-active', isOpen);
  loginToggle.setAttribute('aria-expanded', String(isOpen));
}

function initEvents() {
  window.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 700) {
      siteNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
    }
  });
  window.addEventListener('click', (event) => {
    if (!event.target.closest('.icon-menu-wrapper')) {
      accountMenu.classList.remove('is-open');
      loginToggle.classList.remove('is-active');
      loginToggle.setAttribute('aria-expanded', 'false');
    }
  });
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
  loginToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleAccountMenu();
  });
}

// Inicializa a página após o carregamento do DOM.
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRevealObserver();
  initCarousel();
  initNavigation();
  initScrollTop();
  initEvents();
  updateProgressBar();
});
