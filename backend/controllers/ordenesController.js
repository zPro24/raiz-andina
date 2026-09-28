const pool = require('../config/db');

// Crear un nuevo pedido
exports.crearOrden = async (req, res) => {
  // 💡 Usamos req.usuario porque así lo asigna tu verifyToken
  const usuario_id = req.usuario ? (req.usuario.id || req.usuario.id_usuario) : null;
  const { items, direccion_envio } = req.body;

  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuario no autenticado en la sesión.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El carrito no contiene productos.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Si no enviaron dirección desde el frontend, la buscamos en la tabla 'usuarios'
    let direccionFinal = direccion_envio;
    if (!direccionFinal || direccionFinal.trim() === '') {
      const userRes = await client.query('SELECT direccion FROM usuarios WHERE id = $1', [usuario_id]);
      direccionFinal = userRes.rows[0]?.direccion || 'Dirección no especificada';
    }

    // 2. Calcular total
    const total = items.reduce((sum, item) => sum + (Number(item.precio) * Number(item.cantidad)), 0);

    // 3. Insertar en la tabla 'pedidos' (Estado por defecto 'En proceso')
    const pedidoRes = await client.query(
      `INSERT INTO pedidos (usuario_id, total, estado, direccion_envio)
       VALUES ($1, $2, 'En proceso', $3) 
       RETURNING id, total, estado, direccion_envio, fecha_creacion`,
      [usuario_id, total, direccionFinal]
    );

    const pedidoId = pedidoRes.rows[0].id;

    // 4. Insertar ítems en la tabla 'detalle_pedidos'
    for (const item of items) {
      await client.query(
        `INSERT INTO detalle_pedidos (pedido_id, producto_nombre, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.nombre, item.cantidad, item.precio]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      mensaje: 'Pedido registrado con éxito',
      pedido: pedidoRes.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar pedido:', error);
    return res.status(500).json({
      error: 'Error interno al guardar la orden en la base de datos.',
      detalle: error.message
    });
  } finally {
    client.release();
  }
};

// Obtener los pedidos del usuario autenticado
exports.getMisPedidos = async (req, res) => {
  const usuario_id = req.usuario ? (req.usuario.id || req.usuario.id_usuario) : null;

  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  try {
    const result = await pool.query(
      `SELECT p.id, p.total, p.estado, p.direccion_envio, p.fecha_creacion,
              json_agg(json_build_object(
                'producto_nombre', dp.producto_nombre,
                'cantidad', dp.cantidad,
                'precio_unitario', dp.precio_unitario
              )) AS detalles
       FROM pedidos p
       JOIN detalle_pedidos dp ON p.id = dp.pedido_id
       WHERE p.usuario_id = $1
       GROUP BY p.id
       ORDER BY p.fecha_creacion DESC`,
      [usuario_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mis pedidos:', error);
    res.status(500).json({ error: 'Error al consultar el historial de pedidos.' });
  }
};