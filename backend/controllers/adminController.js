const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios registrados

// backend/controllers/adminController.js

exports.getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, telefono, direccion, rol, creado_en FROM usuarios ORDER BY id DESC'
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ error: 'Error interno del servidor al consultar usuarios' });
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

// Crear un nuevo usuario con rol especificado (por defecto 'admin')
exports.crearUsuarioAdmin = async (req, res) => {
  const { nombre, email, password, telefono, direccion, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
  }

  try {
    // 1. Verificar si el email ya existe
    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email.toLowerCase().trim()]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya se encuentra registrado.' });
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insertar usuario en la BD (rol 'admin' por defecto o el seleccionado)
    const rolAsignado = rol || 'admin';
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nombre, email, telefono, direccion, rol, creado_en`,
      [nombre, email.toLowerCase().trim(), passwordHash, telefono || null, direccion || null, rolAsignado]
    );

    return res.status(201).json({
      mensaje: 'Usuario administrador creado con éxito',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
    return res.status(500).json({ error: 'Error interno del servidor al registrar el usuario.' });
  }
};