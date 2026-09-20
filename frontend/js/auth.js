document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const formCambiarPassword = document.getElementById('form-cambiar-password');
  const btnLogout = document.getElementById('btn-logout');

  // URL Base de tu Backend en Render
  const API_URL = 'https://backend-web-sz3a.onrender.com/api/auth';

  // 1. Redirección en login exitoso
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('correo').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          if (data.usuario?.nombre) {
            localStorage.setItem('usuarioNombre', data.usuario.nombre);
          }
          // Redirigir al nuevo panel privado
          window.location.href = 'panel.html';
        } else {
          alert(data.error || 'Credenciales inválidas');
        }
      } catch (err) {
        console.error('Error al iniciar sesión:', err);
        alert('Error al conectar con el servidor.');
      }
    });
  }

  // 2. Protección de la ruta panel.html (Verificar si está autenticado)
  if (window.location.pathname.includes('panel.html')) {
    const token = localStorage.getItem('token');
    const usuarioNombre = localStorage.getItem('usuarioNombre');

    if (!token) {
      alert('Debes iniciar sesión para acceder a esta página.');
      window.location.href = 'login.html';
      return;
    }

    const bienvenida = document.getElementById('bienvenida-usuario');
    if (bienvenida && usuarioNombre) {
      bienvenida.textContent = `Bienvenido/a, ${usuarioNombre}`;
    }
  }

  // 3. Botón Cerrar Sesión
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioNombre');
      alert('Has cerrado sesión correctamente.');
      window.location.href = 'login.html';
    });
  }

  // 4. Formulario de Actualizar Contraseña
  if (formCambiarPassword) {
    formCambiarPassword.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passActual = document.getElementById('pass-actual').value;
      const passNueva = document.getElementById('pass-nueva').value;
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`${API_URL}/update-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ passActual, passNueva })
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