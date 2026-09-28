async function procesarCompra() {
  const carrito = obtenerCarrito();
  const token = localStorage.getItem('token');

  if (carrito.length === 0) {
    notify('La cesta está vacía.', 'error');
    return;
  }

  if (!token) {
    notify('Debes iniciar sesión para realizar la compra.', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    return;
  }

  try {
    const res = await fetch('https://backend-web-sz3a.onrender.com/api/ordenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: carrito // Envía el array de { id, cantidad, precio }
      })
    });

    const data = await res.json();

    if (res.ok) {
      notify('¡Pedido realizado con éxito!', 'success');
      localStorage.removeItem('carrito_raiz_andina'); // Limpiar carrito
      actualizarContadorCarrito();
      setTimeout(() => { window.location.href = 'panel.html'; }, 1500);
    } else {
      notify(data.error || 'Ocurrió un error al procesar el pedido.', 'error');
    }
  } catch (err) {
    console.error('Error al procesar compra:', err);
    notify('Error de conexión con el servidor.', 'error');
  }
}