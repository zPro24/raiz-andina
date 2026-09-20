const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Guardar usuario en BD
    const newUser = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, hashedPassword]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: newUser.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // 2. Validar contraseña
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // 3. Crear token JWT
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.rows[0].id,
        nombre: user.rows[0].nombre,
        email: user.rows[0].email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
  
};

exports.updatePassword = async (req, res) => {
  try {
    const { passActual, passNueva, email } = req.body;

    // 1. Validar que vengan los datos requeridos
    if (!passActual || !passNueva) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // 2. Buscar al usuario por correo (o por ID si usas token)
    const userResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(444).json({ error: 'Usuario no encontrado' });
    }

    const usuario = userResult.rows[0];

    // 3. Verificar si la contraseña actual ingresada coincide con la BD
    const passwordCorrecto = await bcrypt.compare(passActual, usuario.password);
    if (!passwordCorrecto) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    // 4. Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(passNueva, salt);

    // 5. Actualizar en la base de datos
    await pool.query('UPDATE usuarios SET password = $1 WHERE email = $2', [newHashedPassword, email]);

    return res.json({ mensaje: 'Contraseña actualizada con éxito' });

  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};