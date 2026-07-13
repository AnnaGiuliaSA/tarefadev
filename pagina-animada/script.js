// Elementos principais do DOM
const header = document.getElementById('site-header');
const themeToggle = document.getElementById('theme-toggle');
const pageProgress = document.getElementById('page-progress');
const backToTop = document.getElementById('back-to-top');
const burger = document.getElementById('burger');
const siteNav = document.getElementById('site-nav');
const counters = document.querySelectorAll('.animate-count strong');
const animatedItems = document.querySelectorAll('.fade-up, .section-fade');
const carouselTrack = document.getElementById('carousel-track');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');

let currentSlide = 0;
let carouselInterval;
let touchStartX = 0;

// Define tema a partir do localStorage ou preferências do sistema
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
  themeToggle.textContent = nextTheme === 'dark' ? 'Light' : 'Dark';
}

function updateHeaderOnScroll() {
  const scrolled = window.scrollY > 20;
  header.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', window.scrollY > 450);
  const progress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  pageProgress.style.width = `${progress}%`;
}

function smoothScrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const isOpen = siteNav.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
}

function animateCounters() {
  counters.forEach(counter => {
    const target = Number(counter.dataset.target);
    const duration = 1400;
    const stepTime = Math.max(Math.round(duration / target), 12);
    let current = 0;

    const increment = () => {
      current += 1;
      counter.textContent = current;

      if (current < target) {
        window.requestAnimationFrame(increment);
      }
    };

    increment();
  });
}

// Carousel simples com auto-play e swipe
function moveCarousel(index) {
  const slides = carouselTrack.children.length;
  currentSlide = (index + slides) % slides;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function startCarouselAutoplay() {
  carouselInterval = window.setInterval(() => moveCarousel(currentSlide + 1), 5000);
}

function stopCarouselAutoplay() {
  window.clearInterval(carouselInterval);
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX;
  const deltaX = touchEndX - touchStartX;
  if (Math.abs(deltaX) < 40) return;
  stopCarouselAutoplay();
  if (deltaX < 0) moveCarousel(currentSlide + 1);
  else moveCarousel(currentSlide - 1);
  startCarouselAutoplay();
}

function observeVisibility() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      if (entry.target.closest('#numeros')) {
        animateCounters();
      }

      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.2,
  });

  animatedItems.forEach(item => observer.observe(item));
}

function registerEvents() {
  const searchToggle = document.getElementById('search-toggle');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const userButton = document.getElementById('user-button');
  const userDropdown = document.getElementById('user-dropdown');
  const userMenu = document.querySelector('.header-user');
  const cartBadge = document.getElementById('cart-badge');
  const cartButton = document.getElementById('cart-button');

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  themeToggle.addEventListener('click', toggleTheme);
  backToTop.addEventListener('click', smoothScrollToTop);
  burger.addEventListener('click', () => {
    toggleMobileMenu();
    searchForm.classList.remove('open');
    userDropdown.classList.remove('open');
  });

  searchToggle.addEventListener('click', () => {
    const isOpen = searchForm.classList.toggle('open');
    if (isOpen) searchInput.focus();
  });

  userButton.addEventListener('click', (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    userDropdown.classList.remove('open');
  });

  cartButton.addEventListener('click', () => {
    const currentCount = Number(cartBadge.textContent || '0');
    cartBadge.textContent = currentCount + 1;
  });

  carouselPrev.addEventListener('click', () => { stopCarouselAutoplay(); moveCarousel(currentSlide - 1); startCarouselAutoplay(); });
  carouselNext.addEventListener('click', () => { stopCarouselAutoplay(); moveCarousel(currentSlide + 1); startCarouselAutoplay(); });
  carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
  carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
  document.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    burger.classList.remove('open');
  }));
}

function init() {
  initializeTheme();
  registerEvents();
  observeVisibility();
  updateHeaderOnScroll();
  startCarouselAutoplay();
}

init();
