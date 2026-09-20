document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificar si el usuario está autenticado
  const token = localStorage.getItem('token');
  const usuarioEmail = localStorage.getItem('usuarioEmail');
  const usuarioNombre = localStorage.getItem('usuarioNombre');

  if (!token) {
    alert('Debes iniciar sesión para acceder al panel.');
    window.location.href = 'login.html';
    return;
  }

  // 2. Cargar datos del usuario en la interfaz
  const bienvenida = document.getElementById('bienvenida-usuario');
  const sidebarEmail = document.getElementById('sidebar-usuario-email');
  const sidebarNombre = document.getElementById('sidebar-usuario-nombre');

  if (bienvenida && usuarioNombre) bienvenida.textContent = `Bienvenido/a, ${usuarioNombre}`;
  if (sidebarNombre && usuarioNombre) sidebarNombre.textContent = usuarioNombre;
  if (sidebarEmail && usuarioEmail) sidebarEmail.textContent = usuarioEmail;

  // 3. Lógica de Pestañas (Tabs) del Sidebar
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const tabContents = document.querySelectorAll('.tab-content');

  navItems.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Desactivar todas las pestañas
      navItems.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(tab => tab.classList.remove('active'));

      // Activar la pestaña seleccionada
      button.classList.add('active');
      const activeSection = document.getElementById(targetTab);
      if (activeSection) {
        activeSection.classList.add('active');
      }
    });
  });

  // 4. Botón Cerrar Sesión
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioNombre');
      localStorage.removeItem('usuarioEmail');
      alert('Has cerrado sesión correctamente.');
      window.location.href = 'login.html';
    });
  }

  // 5. Formulario de Cambiar Contraseña desde el Panel
  const formCambiarPassword = document.getElementById('form-cambiar-password');
  if (formCambiarPassword) {
    formCambiarPassword.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passActual = document.getElementById('pass-actual').value;
      const passNueva = document.getElementById('pass-nueva').value;
      const email = localStorage.getItem('usuarioEmail');
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('https://backend-web-sz3a.onrender.com/api/auth/update-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email, passActual, passNueva })
        });

        const data = await res.json();

        if (res.ok) {
          alert('¡Contraseña actualizada con éxito!');
          formCambiarPassword.reset();
        } else {
          alert(data.error || 'No se pudo actualizar la contraseña.');
        }
      } catch (err) {
        console.error('Error al actualizar contraseña:', err);
        alert('Error al conectar con el servidor.');
      }
    });
  }
});