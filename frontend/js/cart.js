// Funciones globales para la cesta de compras

// 1. Obtener los productos actuales del carrito
function obtenerCarrito() {
  const cart = localStorage.getItem('carrito_raiz_andina');
  return cart ? JSON.parse(cart) : [];
}

// 2. Guardar el carrito actualizado
function guardarCarrito(carrito) {
  localStorage.setItem('carrito_raiz_andina', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// 3. Agregar un producto al carrito
function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito();
  
  // Verificar si el producto ya existe en la cesta
  const indice = carrito.findIndex(item => item.id === producto.id);

  if (indice !== -1) {
    // Si ya existe, sumamos la cantidad
    carrito[indice].cantidad += producto.cantidad || 1;
  } else {
    // Si es nuevo, lo agregamos al arreglo
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      imagen: producto.imagen || '',
      cantidad: producto.cantidad || 1
    });
  }

  guardarCarrito(carrito);
  if (typeof notify === 'function') {
    notify(`¡${producto.nombre} añadido a la cesta!`, 'success');
  }
}

// 4. Cambiar cantidad de un producto
function cambiarCantidadProducto(productoId, nuevaCantidad) {
  let carrito = obtenerCarrito();
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(productoId);
    return;
  }

  carrito = carrito.map(item => {
    if (item.id === productoId) {
      item.cantidad = nuevaCantidad;
    }
    return item;
  });

  guardarCarrito(carrito);
  renderizarCarrito();
}

// 5. Eliminar un producto
function eliminarDelCarrito(productoId) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(item => item.id !== productoId);
  guardarCarrito(carrito);
  renderizarCarrito();
}

// 6. Actualizar el indicador (badge) del carrito en la barra de navegación
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// Ejecutar al cargar la página para actualizar el contador
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);