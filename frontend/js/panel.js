/**
 * 🌿 RAÍZ ANDINA — CONTROLADOR DEL PANEL DE USUARIO (DASHBOARD)
 * Integrado con API en Render: https://backend-web-sz3a.onrender.com/api/auth
 */

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://backend-web-sz3a.onrender.com/api/auth';

  // Notificador visual suave
  function notify(msg, type = 'success') {
    if (typeof window.showToast === 'function') {
      window.showToast(msg, type);
    } else {
      alert(msg);
    }
  }

  // 1. Verificar sesión
  const token = localStorage.getItem('token');
  const usuarioEmail = localStorage.getItem('usuarioEmail');
  const usuarioNombre = localStorage.getItem('usuarioNombre');

  if (!token) {
    notify('Debes iniciar sesión para acceder al panel.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 600);
    return;
  }

  // 2. Pintar datos inmediatamente desde localStorage
  const bienvenida = document.getElementById('bienvenida-usuario');
  const sidebarEmail = document.getElementById('sidebar-usuario-email');
  const sidebarNombre = document.getElementById('sidebar-usuario-nombre');

  if (sidebarEmail && usuarioEmail) sidebarEmail.textContent = usuarioEmail;
  if (sidebarNombre && usuarioNombre) sidebarNombre.textContent = usuarioNombre;
  if (bienvenida && usuarioNombre) bienvenida.textContent = `Bienvenido/a, ${usuarioNombre}`;

  // 3. Lógica de Pestañas (Tabs) del Sidebar
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const tabContents = document.querySelectorAll('.tab-content');

  navItems.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = button.getAttribute('data-tab');

      // Remover estado activo previo
      navItems.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(tab => tab.classList.remove('active'));

      // Activar el botón y la sección correspondiente
      button.classList.add('active');
      const activeSection = document.getElementById(targetTab);
      if (activeSection) {
        activeSection.classList.add('active');
      }
    });
  });

  // 4. Cerrar Sesión
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioNombre');
      localStorage.removeItem('usuarioEmail');
      notify('Has cerrado sesión correctamente.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    });
  }

  // 5. Cargar datos del perfil desde el backend
  async function cargarPerfilServidor() {
    if (!usuarioEmail) return;

    try {
      const res = await fetch(`${API_URL}/profile/${usuarioEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        
        const inputNombre = document.getElementById('perfil-nombre');
        const inputTelefono = document.getElementById('perfil-telefono');
        const inputDireccion = document.getElementById('perfil-direccion');

        if (inputNombre) inputNombre.value = data.nombre || usuarioNombre || '';
        if (inputTelefono) inputTelefono.value = data.telefono || '';
        if (inputDireccion) inputDireccion.value = data.direccion || '';

        // Si el servidor trae un nombre más actualizado
        if (data.nombre) {
          localStorage.setItem('usuarioNombre', data.nombre);
          if (sidebarNombre) sidebarNombre.textContent = data.nombre;
          if (bienvenida) bienvenida.textContent = `Bienvenido/a, ${data.nombre}`;
        }
      }
    } catch (err) {
      console.error('Error al obtener perfil del backend:', err);
    }
  }

  // Ejecutar carga de datos del servidor
  cargarPerfilServidor();

  // 6. Formulario de Guardar Perfil
  const formPerfil = document.getElementById('form-perfil');
  if (formPerfil) {
    formPerfil.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formPerfil.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Guardar Cambios';

      const nombre = document.getElementById('perfil-nombre').value.trim();
      const telefono = document.getElementById('perfil-telefono').value.trim();
      const direccion = document.getElementById('perfil-direccion').value.trim();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Guardando...';
      }

      try {
        const res = await fetch(`${API_URL}/update-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: usuarioEmail,
            nombre,
            telefono,
            direccion
          })
        });

        const data = await res.json();

        if (res.ok) {
          notify('¡Perfil actualizado con éxito!', 'success');
          localStorage.setItem('usuarioNombre', nombre);
          if (sidebarNombre) sidebarNombre.textContent = nombre;
          if (bienvenida) bienvenida.textContent = `Bienvenido/a, ${nombre}`;
        } else {
          notify(data.error || 'No se pudo actualizar el perfil.', 'error');
        }
      } catch (err) {
        console.error('Error al actualizar el perfil:', err);
        notify('Error al conectar con el servidor.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // 7. Formulario de Actualizar Contraseña
  const formCambiarPassword = document.getElementById('form-cambiar-password');
  if (formCambiarPassword) {
    formCambiarPassword.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formCambiarPassword.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Actualizar Contraseña';

      const passActual = document.getElementById('pass-actual').value;
      const passNueva = document.getElementById('pass-nueva').value;

      if (!passActual || !passNueva) {
        notify('Por favor completa todos los campos de contraseña', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Actualizando...';
      }

      try {
        const res = await fetch(`${API_URL}/update-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email: usuarioEmail, passActual, passNueva })
        });

        const data = await res.json();

        if (res.ok) {
          notify('¡Contraseña actualizada con éxito!', 'success');
          formCambiarPassword.reset();
        } else {
          notify(data.error || 'No se pudo actualizar la contraseña.', 'error');
        }
      } catch (err) {
        console.error('Error al actualizar contraseña:', err);
        notify('Error al conectar con el servidor.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
});