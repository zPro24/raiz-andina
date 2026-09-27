/**
 * 🌿 RAÍZ ANDINA — CONTROLADOR DE AUTENTICACIÓN
 * Integrado con API en Render: https://backend-web-sz3a.onrender.com/api/auth
 */

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

  // Notificador visual suave
  function notify(msg, type = 'success') {
    if (typeof window.showToast === 'function') {
      window.showToast(msg, type);
    } else {
      alert(msg);
    }
  }

  // Alternar a Formulario de Registro en login.html
  if (linkIrRegistro) {
    linkIrRegistro.addEventListener('click', (e) => {
      e.preventDefault();
      if (secLogin) secLogin.style.display = 'none';
      if (secRegistro) {
        secRegistro.style.display = 'block';
        secRegistro.style.animation = 'fadeInTab 0.3s ease';
      }
      if (panelTitulo) panelTitulo.textContent = '¡Únete a Raíz Andina!';
      if (panelDesc) panelDesc.textContent = 'Crea tu cuenta para formar parte de la red de comercio justo, trazabilidad y apoyo comunitario.';
    });
  }

  // Alternar a Formulario de Login en login.html
  if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (secRegistro) secRegistro.style.display = 'none';
      if (secLogin) {
        secLogin.style.display = 'block';
        secLogin.style.animation = 'fadeInTab 0.3s ease';
      }
      if (panelTitulo) panelTitulo.textContent = '¡Bienvenido de nuevo!';
      if (panelDesc) panelDesc.textContent = 'Accede a tu cuenta para gestionar tus pedidos y conocer más sobre nuestras iniciativas de comercio justo.';
    });
  }

  // 1. Lógica de Inicio de Sesión
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formLogin.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Entrar';

      const email = document.getElementById('correo').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        notify('Por favor completa todos los campos', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; display: inline-block; width: 16px; height: 16px; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg> Conectando...
        `;
      }

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          notify('¡Sesión iniciada correctamente!', 'success');
          localStorage.setItem('token', data.token);
          if (data.usuario?.nombre) {
            localStorage.setItem('usuarioNombre', data.usuario.nombre);
          }
          if (data.usuario?.email) {
            localStorage.setItem('usuarioEmail', data.usuario.email);
          } else {
            localStorage.setItem('usuarioEmail', email);
          }

          // GUARDAR ROL EN LOCALSTORAGE
          if (data.usuario?.rol) {
            localStorage.setItem('usuarioRol', data.usuario.rol);
          } else {
            localStorage.setItem('usuarioRol', 'consumidor');
          }

          setTimeout(() => {
            window.location.href = 'panel.html';
          }, 600);
        } else {
          notify(data.error || 'Credenciales inválidas.', 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      } catch (err) {
        console.error('Error al iniciar sesión:', err);
        notify('No se pudo conectar con el servidor. Revisa tu conexión.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // 2. Lógica de Registro de Usuario
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formRegister.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Registrarse';

      const nombre = document.getElementById('reg-nombre').value.trim();
      const email = document.getElementById('reg-correo').value.trim();
      const password = document.getElementById('reg-password').value;

      if (!nombre || !email || !password) {
        notify('Por favor completa todos los campos requeridos', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; display: inline-block; width: 16px; height: 16px; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg> Registrando...
        `;
      }

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          notify('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
          formRegister.reset();
          if (linkIrLogin) {
            setTimeout(() => linkIrLogin.click(), 800);
          }
        } else {
          notify(data.error || 'Error al registrar el usuario.', 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      } catch (err) {
        console.error('Error en el registro:', err);
        notify('No se pudo conectar con el servidor.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // 3. Protección de la ruta panel.html
  if (window.location.pathname.includes('panel.html')) {
    const token = localStorage.getItem('token');
    const usuarioNombre = localStorage.getItem('usuarioNombre');

    if (!token) {
      notify('Debes iniciar sesión para acceder al panel.', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
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
      localStorage.removeItem('usuarioRol'); // LIMPIAR ROL
      notify('Has cerrado sesión correctamente.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    });
  }

  // 5. Formulario de Actualizar Contraseña
  if (formCambiarPassword) {
    formCambiarPassword.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formCambiarPassword.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Actualizar Contraseña';

      const passActual = document.getElementById('pass-actual').value;
      const passNueva = document.getElementById('pass-nueva').value;
      const email = localStorage.getItem('usuarioEmail');
      const token = localStorage.getItem('token');

      if (!email) {
        notify('Sesión no válida. Por favor vuelve a iniciar sesión.', 'error');
        window.location.href = 'login.html';
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
          body: JSON.stringify({ email, passActual, passNueva })
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