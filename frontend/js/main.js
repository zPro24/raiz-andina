document.addEventListener('DOMContentLoaded', () => {
  const views = document.querySelectorAll('.view');
  const navLinks = document.querySelectorAll('.nav-links a');
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Función para cambiar de vista según el hash (#inicio, #productos, etc.)
  function navigate() {
    let hash = window.location.hash || '#inicio';
    
    views.forEach(view => {
      if ('#' + view.id === hash) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Escuchar cambios en la URL
  window.addEventListener('hashchange', navigate);
  navigate(); // Cargar vista inicial

  // Conmutador de modo claro/oscuro
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', 'dark');
    }
  });
});