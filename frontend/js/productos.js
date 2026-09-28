// URL base de tu backend montado en Render
const API_URL = 'https://backend-web-sz3a.onrender.com/api';

let listaProductosMemoria = []; // Guardar copia para los filtros sin reconsultar a la BD

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosBD();
    configurarFiltros();
});

// 1. Obtener productos desde la BD de PostgreSQL
async function cargarProductosBD() {
    const contenedor = document.getElementById('grid-productos');
    if (!contenedor) return;

    try {
        const res = await fetch(`${API_URL}/productos`);

        if (!res.ok) {
            throw new Error(`Error en servidor: ${res.status}`);
        }

        const productos = await res.json();
        listaProductosMemoria = productos; // Guardar en caché local

        if (productos.length === 0) {
            contenedor.innerHTML = `
        <p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">
          No hay productos disponibles en el catálogo en este momento.
        </p>`;
            return;
        }

        renderizarTarjetasProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        contenedor.innerHTML = `
      <p style="grid-column: 1 / -1; text-align: center; color: #ef4444; padding: 3rem;">
        No se pudo conectar con el catálogo de Raíz Andina. Por favor reintenta más tarde.
      </p>`;
    }
}

// 2. Renderizar productos en la estructura visual de tu HTML
function renderizarTarjetasProductos(productos) {
    const contenedor = document.getElementById('grid-productos');
    if (!contenedor) return;

    contenedor.innerHTML = productos.map((p, index) => {
        // Si el producto es el primero de la lista o categoría café, le agregamos clase destacado opcional
        const esDestacado = index === 0 ? 'destacado' : '';
        const categoriaSlug = (p.categoria || 'general').toLowerCase().trim();

        return `
      <div class="card-producto ${esDestacado}" data-category="${categoriaSlug}">
        ${index === 0 ? '<span class="destacado-badge">★ Cosecha Destacada</span>' : ''}

        <div class="producto-img-box">
          <img src="${p.imagen_url || 'https://via.placeholder.com/600x400?text=Raiz+Andina'}" alt="${p.nombre}">
        </div>

        <div class="producto-info">
          <div>
            <div class="producto-origen">
              <span>⛰️ ${p.origen || 'Santander, Colombia'}</span>
            </div>
            <h3 style="margin-bottom: 0.4rem;">${p.nombre}</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5;">
              ${p.descripcion || 'Producto 100% agroecológico de la cordillera andina.'}
            </p>

            <div class="producto-tags">
              <span class="tag-badge">${p.categoria || 'Agroecológico'}</span>
              <span class="tag-badge">Stock: ${p.stock ?? 'Disponible'}</span>
            </div>
          </div>

          <div class="producto-bottom">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Precio sugerido</span>
              <div class="precio">$${Number(p.precio).toLocaleString('es-CO')} COP</div>
            </div>
            <button class="btn-comprar" onclick='ejecutarAgregarAlCarrito(${JSON.stringify(p)})'>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Añadir a la cesta</span>
            </button>
          </div>
        </div>
      </div>
    `;
    }).join('');
}

// 3. Conectar el botón de la tarjeta con la función global de cart.js
function ejecutarAgregarAlCarrito(producto) {
    if (typeof agregarAlCarrito === 'function') {
        agregarAlCarrito({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen_url
        });
    } else {
        console.error('El script cart.js no está cargado correctamente.');
    }
}

// 4. Lógica para los botones de filtrado (.filter-btn)
function configurarFiltros() {
    const botonesFiltro = document.querySelectorAll('.filter-btn');

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos
            botonesFiltro.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filtro = btn.getAttribute('data-filter');

            if (filtro === 'all') {
                renderizarTarjetasProductos(listaProductosMemoria);
            } else {
                const filtrados = listaProductosMemoria.filter(p => {
                    const cat = (p.categoria || '').toLowerCase();
                    return cat.includes(filtro.toLowerCase());
                });
                renderizarTarjetasProductos(filtrados);
            }
        });
    });
}