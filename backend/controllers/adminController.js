const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios registrados
exports.getUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, email, telefono, direccion, rol, fecha_registro FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Crear un nuevo usuario Administrador
exports.createAdmin = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el correo existe
    const existe = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, hashedPassword, 'admin']
    );

    res.json({ mensaje: 'Administrador creado con éxito', usuario: newAdmin.rows[0] });
  } catch (error) {
    console.error('Error al crear admin:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};