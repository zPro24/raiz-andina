document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');

  if (!formLogin) return;

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
        // Redirecciona a la página de inicio
        window.location.href = 'index.html';
      } else {
        alert(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error en la petición:', err);
      alert('Error al conectar con el servidor.');
    }
  });
});