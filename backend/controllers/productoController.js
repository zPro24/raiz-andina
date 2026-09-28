const pool = require('../config/db');

// Obtener todos los productos para la tienda
exports.getProductos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener el catálogo de productos.' });
  }
};

// Crear producto (Sólo Admin)
exports.crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion || '', precio, stock || 0, imagen_url || '', categoria || 'General']
    );
    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: result.rows[0] });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al registrar el producto.' });
  }
};