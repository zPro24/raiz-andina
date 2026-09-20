document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const formCambiarPassword = document.getElementById('form-cambiar-password');
  const btnLogout = document.getElementById('btn-logout');

  const secLogin = document.getElementById('sec-login');
  const secRegistro = document.getElementById('sec-registro');

  const linkIrRegistro = document.getElementById('link-ir-registro');
  const linkIrLogin = document.getElementById('link-ir-login');

  const panelTitulo = document.getElementById('panel-titulo');
  const panelDesc = document.getElementById('panel-desc');

  // URL Base del Backend en Render
  const API_URL = 'https://backend-web-sz3a.onrender.com/api/auth';

  // Alternar a Formulario de Registro en login.html
  if (linkIrRegistro) {
    linkIrRegistro.addEventListener('click', (e) => {
      e.preventDefault();
      secLogin.style.display = 'none';
      secRegistro.style.display = 'block';
      if (panelTitulo) panelTitulo.textContent = '¡Únete a Raíz Andina!';
      if (panelDesc) panelDesc.textContent = 'Crea tu cuenta para formar parte de la red de comercio justo y apoyo comunitario.';
    });
  }

  // Alternar a Formulario de Login en login.html
  if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
      e.preventDefault();
      secRegistro.style.display = 'none';
      secLogin.style.display = 'block';
      if (panelTitulo) panelTitulo.textContent = '¡Bienvenido de nuevo!';
      if (panelDesc) panelDesc.textContent = 'Accede a tu cuenta para gestionar tus pedidos y conocer más sobre nuestras iniciativas de comercio justo.';
    });
  }

  // 1. Lógica de Inicio de Sesión
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
          // Guardar el correo para la consulta en el servidor
          if (data.usuario?.email) {
            localStorage.setItem('usuarioEmail', data.usuario.email);
          } else {
            localStorage.setItem('usuarioEmail', email);
          }

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

  // 2. Lógica de Registro de Usuario
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('reg-nombre').value;
      const email = document.getElementById('reg-correo').value;
      const password = document.getElementById('reg-password').value;

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          alert('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.');
          if (linkIrLogin) linkIrLogin.click();
        } else {
          alert(data.error || 'Error al registrar el usuario.');
        }
      } catch (err) {
        console.error('Error en el registro:', err);
        alert('Error al conectar con el servidor.');
      }
    });
  }

  // 3. Protección de la ruta panel.html
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

  // 4. Botón Cerrar Sesión
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioNombre');
      localStorage.removeItem('usuarioEmail');
      alert('Has cerrado sesión correctamente.');
      window.location.href = 'login.html';
    });
  }

  // 5. Formulario de Actualizar Contraseña (Envia email, passActual y passNueva)
  if (formCambiarPassword) {
    formCambiarPassword.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passActual = document.getElementById('pass-actual').value;
      const passNueva = document.getElementById('pass-nueva').value;
      const email = localStorage.getItem('usuarioEmail');
      const token = localStorage.getItem('token');

      if (!email) {
        alert('Sesión no válida. Por favor vuelve a iniciar sesión.');
        window.location.href = 'login.html';
        return;
      }

      try {
        const res = await fetch(`${API_URL}/update-password`, {
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