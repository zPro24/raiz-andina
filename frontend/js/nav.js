// Menú de navegación móvil (hamburguesa)
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const abierto = links.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  // Cierra el menú al elegir una opción (útil en móviles)
  links.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      links.classList.remove('abierto');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});
