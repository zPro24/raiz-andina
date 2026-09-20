const API_URL = 'https://backend-web-sz3a.onrender.com/api/auth';
  const usuarioEmail = localStorage.getItem('usuarioEmail');
  const token = localStorage.getItem('token');

  // --- Cargar datos del perfil desde el backend ---
  async function cargarDatosPerfil() {
    if (!usuarioEmail) return;

    try {
      const res = await fetch(`${API_URL}/profile/${usuarioEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Rellenar campos del formulario de perfil
        if (document.getElementById('perfil-nombre')) {
          document.getElementById('perfil-nombre').value = data.nombre || '';
        }
        if (document.getElementById('perfil-telefono')) {
          document.getElementById('perfil-telefono').value = data.telefono || '';
        }
        if (document.getElementById('perfil-direccion')) {
          document.getElementById('perfil-direccion').value = data.direccion || '';
        }

        // Actualizar nombre en la interfaz si cambió
        if (data.nombre) {
          localStorage.setItem('usuarioNombre', data.nombre);
          const sidebarNombre = document.getElementById('sidebar-usuario-nombre');
          const bienvenida = document.getElementById('bienvenida-usuario');
          if (sidebarNombre) sidebarNombre.textContent = data.nombre;
          if (bienvenida) bienvenida.textContent = `Bienvenido/a, ${data.nombre}`;
        }
      }
    } catch (err) {
      console.error('Error al cargar datos del perfil:', err);
    }
  }

  // Llamar la función al cargar la página
  cargarDatosPerfil();

  // --- Enviar el formulario de Actualizar Perfil ---
  const formPerfil = document.getElementById('form-perfil');
  if (formPerfil) {
    formPerfil.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('perfil-nombre').value;
      const telefono = document.getElementById('perfil-telefono').value;
      const direccion = document.getElementById('perfil-direccion').value;

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
          alert('¡Perfil actualizado con éxito!');
          cargarDatosPerfil(); // Recargar datos actualizados
        } else {
          alert(data.error || 'No se pudo actualizar el perfil.');
        }
      } catch (err) {
        console.error('Error al guardar el perfil:', err);
        alert('Error al conectar con el servidor.');
      }
    });
  }