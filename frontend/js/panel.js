/**
 * 🌿 RAÍZ ANDINA — CONTROLADOR DEL PANEL DE USUARIO (DASHBOARD)
 * Integrado con API en Render: https://backend-web-sz3a.onrender.com/api
 */

document.addEventListener('DOMContentLoaded', () => {
  const API_AUTH_URL = 'https://backend-web-sz3a.onrender.com/api/auth';
  const API_ADMIN_URL = 'https://backend-web-sz3a.onrender.com/api/admin';

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
  const usuarioRol = localStorage.getItem('usuarioRol'); // Almacenado en login

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
  const badgeRol = document.getElementById('badge-rol-usuario');

  if (sidebarEmail && usuarioEmail) sidebarEmail.textContent = usuarioEmail;
  if (sidebarNombre && usuarioNombre) sidebarNombre.textContent = usuarioNombre;
  if (bienvenida && usuarioNombre) bienvenida.textContent = `Bienvenido/a, ${usuarioNombre}`;

  // Si el usuario es Administrador, mostrar la opción en el sidebar
  const navAdmin = document.getElementById('nav-item-admin');
  if (usuarioRol === 'admin') {
    if (navAdmin) navAdmin.style.display = 'flex';
    if (badgeRol) {
      badgeRol.textContent = '👑 Administrador';
      badgeRol.style.background = 'rgba(6, 182, 212, 0.15)';
      badgeRol.style.borderColor = 'rgba(6, 182, 212, 0.35)';
      badgeRol.style.color = '#38bdf8';
    }
  }

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

        // Si se presiona la pestaña de Admin, cargar la lista actualizada de usuarios
        if (targetTab === 'tab-admin') {
          cargarUsuariosAdmin();
        }

        // En pantallas móviles, desplazar suavemente al contenido seleccionado
        if (window.innerWidth < 768) {
          const headerOffset = 90;
          const elementPosition = activeSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
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
      localStorage.removeItem('usuarioRol');
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
      const res = await fetch(`${API_AUTH_URL}/profile/${usuarioEmail}`, {
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

  cargarPerfilServidor();

  // 6. Cargar Usuarios para Administrador
  async function cargarUsuariosAdmin() {
    const tbody = document.getElementById('tabla-usuarios-body');
    const mobileList = document.getElementById('admin-mobile-list');

    try {
      const res = await fetch(`${API_ADMIN_URL}/usuarios`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const usuarios = await res.json();

        // Renderizar para vista Escritorio
        if (tbody) {
          if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay usuarios registrados.</td></tr>';
          } else {
            tbody.innerHTML = usuarios.map(u => `
              <tr>
                <td style="font-family: var(--font-mono); color: #38bdf8; font-weight: 600;">#${u.id}</td>
                <td style="font-weight: 600;">${u.nombre}</td>
                <td style="color: var(--text-secondary);">${u.email}</td>
                <td>${u.telefono || 'N/A'}</td>
                <td>${u.direccion || 'N/A'}</td>
                <td>
                  <span class="badge ${u.rol === 'admin' ? 'badge-warning' : 'badge-success'}">
                    ${u.rol}
                  </span>
                </td>
              </tr>
            `).join('');
          }
        }

        // Renderizar para vista Móvil
        if (mobileList) {
          mobileList.innerHTML = usuarios.map(u => `
            <div class="order-mobile-card">
              <div class="order-mobile-header">
                <span class="order-mobile-id">ID: #${u.id}</span>
                <span class="badge ${u.rol === 'admin' ? 'badge-warning' : 'badge-success'}">${u.rol}</span>
              </div>
              <div class="order-mobile-body">
                <p style="font-weight: 600; color: var(--text-main);">${u.nombre}</p>
                <span class="order-mobile-date">${u.email}</span>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.3rem;">
                  📞 ${u.telefono || 'Sin teléfono'} <br>
                  📍 ${u.direccion || 'Sin dirección'}
                </p>
              </div>
            </div>
          `).join('');
        }
      } else {
        const errData = await res.json();
        notify(errData.error || 'Error al obtener usuarios de la base de datos', 'error');
      }
    } catch (err) {
      console.error('Error de conexión con la API Admin:', err);
      notify('Error al conectar con el servidor', 'error');
    }
  }

  // 7. Formulario de Guardar Perfil
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
        const res = await fetch(`${API_AUTH_URL}/update-profile`, {
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

  // 8. Formulario de Actualizar Contraseña
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
        const res = await fetch(`${API_AUTH_URL}/update-password`, {
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