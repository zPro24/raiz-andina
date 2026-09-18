document.getElementById('form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  const correo = document.getElementById('correo').value;
  
  // Simulación de respuesta de backend
  alert(`Bienvenido/a, ${correo}. Inicio de sesión exitoso.`);
  window.location.hash = '#inicio';
});