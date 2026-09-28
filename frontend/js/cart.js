// URL de la API del Backend
const API_URL_CART = 'https://backend-web-sz3a.onrender.com/api';

function initNavbar() {
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawer = document.getElementById('close-drawer');

  // Efecto glass shrink al hacer scroll
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function setDrawerOpen(open) {
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('open', open);
    if (menuToggle) {
      menuToggle.classList.toggle('is-active', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }

  // Toggle Menú Móvil
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !mobileDrawer.classList.contains('open');
      setDrawerOpen(willOpen);
    });

    if (closeDrawer) {
      closeDrawer.addEventListener('click', (e) => {
        e.stopPropagation();
        setDrawerOpen(false);
      });
    }

    // Cerrar al hacer clic en un enlace del drawer
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setDrawerOpen(false);
      });
    });

    // Cerrar con Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        setDrawerOpen(false);
      }
    });

    // Cerrar al hacer clic en el backdrop
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        setDrawerOpen(false);
      }
    });
  }
}

function notify(msg, type = 'success') {
  if (typeof window.showToast === 'function') {
    window.showToast(msg, type);
  } else {
    alert(msg);
  }
}

// Obtener productos desde localStorage
function obtenerCarrito() {
  const cart = localStorage.getItem('carrito_raiz_andina');
  return cart ? JSON.parse(cart) : [];
}

// Guardar estado
function guardarCarrito(carrito) {
  localStorage.setItem('carrito_raiz_andina', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// Agregar producto
function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito();
  const indice = carrito.findIndex(item => item.id === producto.id);

  if (indice !== -1) {
    carrito[indice].cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      imagen: producto.imagen || producto.imagen_url || '',
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  notify(`¡${producto.nombre} agregado a la cesta!`);
}

// Modificar cantidad (+ / -)
function cambiarCantidadProducto(id, cambio) {
  let carrito = obtenerCarrito();
  const producto = carrito.find(p => p.id === id);

  if (producto) {
    producto.cantidad += cambio;
    if (producto.cantidad <= 0) {
      carrito = carrito.filter(p => p.id !== id);
    }
  }

  guardarCarrito(carrito);
  renderizarCarrito();
}

// Eliminar producto por completo
function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito(carrito);
  renderizarCarrito();
}

// Actualizar el número del badge en el Navbar
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// Dibujar la cesta en la página carrito.html
function renderizarCarrito() {
  const contenedor = document.getElementById('items-carrito-container');
  const subtotalElem = document.getElementById('cart-subtotal');
  const totalElem = document.getElementById('cart-total-precio');

  if (!contenedor) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">Tu cesta está vacía 🌾</p>
        <a href="productos.html" class="btn-primary" style="display: inline-block; padding: 0.5rem 1rem;">Explorar Catálogo</a>
      </div>
    `;
    if (subtotalElem) subtotalElem.textContent = '$0 COP';
    if (totalElem) totalElem.textContent = '$0 COP';
    return;
  }

  let total = 0;

  contenedor.innerHTML = carrito.map(item => {
    const subtotalItem = item.precio * item.cantidad;
    total += subtotalItem;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid var(--glass-border);">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img src="${item.imagen || 'https://via.placeholder.com/80'}" alt="${item.nombre}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px;">
          <div>
            <h4 style="margin: 0; font-size: 0.95rem; font-weight: bold;">${item.nombre}</h4>
            <span style="color: var(--text-muted); font-size: 0.85rem;">$${item.precio.toLocaleString('es-CO')} COP</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button onclick="cambiarCantidadProducto(${item.id}, -1)" style="padding: 0.2rem 0.6rem; background: rgba(255,255,255,0.1); border-radius: 4px; border: none; color: #fff; cursor: pointer;">-</button>
          <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.cantidad}</span>
          <button onclick="cambiarCantidadProducto(${item.id}, 1)" style="padding: 0.2rem 0.6rem; background: rgba(255,255,255,0.1); border-radius: 4px; border: none; color: #fff; cursor: pointer;">+</button>
          <button onclick="eliminarDelCarrito(${item.id})" style="background: transparent; color: #ef4444; border: none; cursor: pointer; margin-left: 0.5rem;" title="Eliminar">🗑️</button>
        </div>
      </div>
    `;
  }).join('');

  if (subtotalElem) subtotalElem.textContent = `$${total.toLocaleString('es-CO')} COP`;
  if (totalElem) totalElem.textContent = `$${total.toLocaleString('es-CO')} COP`;
}

// Enviar el pedido al Backend
async function procesarCompra() {
  const carrito = obtenerCarrito();
  const token = localStorage.getItem('token');

  if (carrito.length === 0) {
    alert('Tu cesta está vacía.');
    return;
  }

  if (!token) {
    alert('Debes iniciar sesión para realizar el pedido.');
    window.location.href = 'login.html';
    return;
  }

  // Pedir dirección de envío al usuario
  const direccion_envio = prompt('Ingresa la dirección de envío para tu pedido:');
  if (!direccion_envio || direccion_envio.trim() === '') {
    alert('Debes proporcionar una dirección de envío para completar el pedido.');
    return;
  }

  const btn = document.getElementById('btn-procesar-compra');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch(`${API_URL_CART}/ordenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: carrito,
        direccion_envio: direccion_envio.trim()
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert('¡Pedido realizado con éxito!');
      localStorage.removeItem('carrito_raiz_andina');
      actualizarContadorCarrito();
      window.location.href = 'panel.html';
    } else {
      alert(data.error || 'No se pudo procesar la compra.');
    }
  } catch (err) {
    console.error('Error procesando compra:', err);
    alert('Error al conectar con el servidor.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);