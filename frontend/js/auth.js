document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('correo').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('https://tu-backend.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('¡Bienvenido ' + data.usuario.nombre + '!');
      window.location.hash = '#inicio';
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Error al conectar con el servidor.');
  }
});