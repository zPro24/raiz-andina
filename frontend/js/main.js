/**
 * 🌿 RAÍZ ANDINA — MOTOR INTERACTIVO FUTURISTA & MOTION
 * Incluye: Partículas de Ambiente, 3D Tilt, Scroll Reveal,
 * Contadores Animados, Toast Notifications, Navbar Island & Drawer Móvil
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Inicializar Tema (antes de cualquier render para evitar flash)
  initThemeToggle();

  // 1. Inicializar Barra de Progreso de Scroll
  initScrollProgress();

  // 2. Inicializar Navbar Island y Drawer Móvil
  initNavbar();

  // 3. Inicializar Partículas Ambientales en Canvas
  initAmbientParticles();

  // 4. Inicializar Efecto 3D Tilt en Tarjetas
  initTiltCards();

  // 5. Inicializar Animaciones de Scroll Reveal
  initScrollReveal();

  // 6. Inicializar Contadores Numéricos Animados
  initCounters();

  // 7. Inicializar Filtros de Productos (si existen)
  initProductFilters();

  // 8. Actualizar Estado de Sesión en Navbar
  updateNavbarSession();
});

/* ==========================================================================
   1. BARRA DE PROGRESO DE SCROLL
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ==========================================================================
   2. NAVBAR ISLAND & MENÚ MÓVIL (DRAWER)
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawer = document.getElementById('close-drawer');

  // Efecto glass shrink al hacer scroll
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function setDrawerOpen(open) {
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('open', open);
    if (menuToggle) {
      menuToggle.classList.toggle('is-active', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }

  // Toggle Menú Móvil
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !mobileDrawer.classList.contains('open');
      setDrawerOpen(willOpen);
    });

    if (closeDrawer) {
      closeDrawer.addEventListener('click', (e) => {
        e.stopPropagation();
        setDrawerOpen(false);
      });
    }

    // Cerrar al hacer clic en un enlace del drawer
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setDrawerOpen(false);
      });
    });

    // Cerrar con Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        setDrawerOpen(false);
      }
    });

    // Cerrar al hacer clic en el backdrop
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        setDrawerOpen(false);
      }
    });
  }
}

/* ==========================================================================
   3. CANVAS DE PARTÍCULAS AMBIENTALES (60 FPS Acelerado por GPU)
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 20 : 50;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const colors = [
    'rgba(16, 185, 129, 0.45)', // Emerald
    'rgba(6, 182, 212, 0.4)',   // Cyan
    'rgba(245, 158, 11, 0.35)'  // Gold
  ];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Conectar partículas cercanas con líneas sutiles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Pausar render si la pestaña está inactiva
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });

  animate();
}

/* ==========================================================================
   4. EFECTO 3D TILT INTERACTIVO
   ========================================================================== */
function initTiltCards() {
  // Desactivar tilt en móviles táctiles para evitar interferir con scroll
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const tiltCards = document.querySelectorAll('.tilt-card, .tilt-hover');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   5. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. CONTADORES NUMÉRICOS ANIMADOS
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentCount = Math.floor(easeProgress * target);

          el.textContent = `${prefix}${currentCount}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. FILTROS DE PRODUCTOS
   ========================================================================== */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.card-producto');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   8. ACTUALIZAR ESTADO DE SESIÓN EN NAVBAR & DRAWER
   ========================================================================== */
function updateNavbarSession() {
  const token = localStorage.getItem('token');
  const usuarioNombre = localStorage.getItem('usuarioNombre');
  const navLoginBtns = document.querySelectorAll('.btn-login-nav');
  const drawerLoginBtns = document.querySelectorAll('.drawer-btn-login');

  const displayName = usuarioNombre ? usuarioNombre.split(' ')[0] : 'Mi Panel';

  if (token) {
    navLoginBtns.forEach(btn => {
      btn.href = 'panel.html';
      btn.innerHTML = `
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span>
        ${displayName}
      `;
    });

    drawerLoginBtns.forEach(btn => {
      btn.href = 'panel.html';
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        </svg>
        <span>Mi Panel (${displayName})</span>
      `;
    });
  }
}

/* ==========================================================================
   SISTEMA GLOBAL DE NOTIFICACIONES TOAST (CYBER TOAST)
   ========================================================================== */
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? '✨' 
    : (type === 'error' ? '⚠️' : 'ℹ️');

  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icon}</span>
    <span style="flex:1;">${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
};

/* ==========================================================================
   9. THEME TOGGLE — Modo Claro / Oscuro
   ========================================================================== */
function initThemeToggle() {
  const html = document.documentElement;

  // Aplicar preferencia guardada ANTES del primer render (evita flash blanco)
  const saved = localStorage.getItem('raiz-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'light' || (!saved && !prefersDark)) {
    html.classList.add('light-mode');
  }

  // Buscar todos los botones .theme-toggle en la página (navbar + drawer)
  const toggles = document.querySelectorAll('.theme-toggle');

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = html.classList.toggle('light-mode');
      localStorage.setItem('raiz-theme', isLight ? 'light' : 'dark');

      // Actualizar aria-label para accesibilidad
      const label = isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
      toggles.forEach(b => b.setAttribute('aria-label', label));

      // Toast de confirmación
      const msg = isLight ? '☀️ Modo claro activado' : '🌙 Modo oscuro activado';
      if (typeof window.showToast === 'function') window.showToast(msg, 'success');
    });

    // Aria-label inicial
    const isCurrentlyLight = html.classList.contains('light-mode');
    btn.setAttribute('aria-label', isCurrentlyLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  });
}