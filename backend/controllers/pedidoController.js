const pool = require('../config/db');

// Crear un nuevo pedido (Consumidor)
exports.crearPedido = async (req, res) => {
  const client = await pool.connect();
  try {
    const { usuario_id, total, direccion_envio, productos } = req.body; // productos: [{nombre, cantidad, precio}]

    await client.query('BEGIN');

    // 1. Insertar en la tabla pedidos
    const resPedido = await client.query(
      'INSERT INTO pedidos (usuario_id, total, direccion_envio) VALUES ($1, $2, $3) RETURNING id',
      [usuario_id, total, direccion_envio]
    );
    const pedidoId = resPedido.rows[0].id;

    // 2. Insertar cada producto en detalle_pedidos
    for (const prod of productos) {
      await client.query(
        'INSERT INTO detalle_pedidos (pedido_id, producto_nombre, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [pedidoId, prod.nombre, prod.cantidad, prod.precio]
      );
    }

    await client.query('COMMIT');
    res.json({ mensaje: 'Pedido registrado con éxito', pedidoId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al guardar pedido:', error);
    res.status(500).json({ error: 'Error interno al procesar el pedido' });
  } finally {
    client.release();
  }
};

// Obtener historial de pedidos de un usuario
exports.getMisPedidos = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const pedidos = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY fecha_creacion DESC',
      [usuarioId]
    );
    res.json(pedidos.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};