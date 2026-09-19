document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  const secLogin = document.getElementById('sec-login');
  const secRegistro = document.getElementById('sec-registro');

  const linkIrRegistro = document.getElementById('link-ir-registro');
  const linkIrLogin = document.getElementById('link-ir-login');

  const panelTitulo = document.getElementById('panel-titulo');
  const panelDesc = document.getElementById('panel-desc');

  // Alternar a Formulario de Registro
  if (linkIrRegistro) {
    linkIrRegistro.addEventListener('click', (e) => {
      e.preventDefault();
      secLogin.style.display = 'none';
      secRegistro.style.display = 'block';
      panelTitulo.textContent = '¡Únete a Raíz Andina!';
      panelDesc.textContent = 'Crea tu cuenta para formar parte de la red de comercio justo y apoyo comunitario.';
    });
  }

  // Alternar a Formulario de Login
  if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
      e.preventDefault();
      secRegistro.style.display = 'none';
      secLogin.style.display = 'block';
      panelTitulo.textContent = '¡Bienvenido de nuevo!';
      panelDesc.textContent = 'Accede a tu cuenta para gestionar tus pedidos y conocer más sobre nuestras iniciativas de comercio justo.';
    });
  }

  // Lógica de Inicio de Sesión
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('correo').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('https://backend-web-sz3a.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          alert('¡Bienvenido/a ' + (data.usuario?.nombre || 'usuario') + '!');
          window.location.href = 'index.html';
        } else {
          alert(data.error || 'Credenciales inválidas');
        }
      } catch (err) {
        console.error('Error al iniciar sesión:', err);
        alert('Error al conectar con el servidor.');
      }
    });
  }

  // Lógica de Registro de Usuario
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('reg-nombre').value;
      const email = document.getElementById('reg-correo').value;
      const password = document.getElementById('reg-password').value;

      try {
        const res = await fetch('https://backend-web-sz3a.onrender.com/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          alert('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.');
          // Volver al formulario de login
          linkIrLogin.click();
        } else {
          alert(data.error || 'Error al registrar el usuario.');
        }
      } catch (err) {
        console.error('Error en el registro:', err);
        alert('Error al conectar con el servidor.');
      }
    });
  }
});