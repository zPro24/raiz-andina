const jwt = require('jsonwebtoken');

// 1. Validar Token JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro');
    req.usuario = verified; // Guarda los datos decodificados (id, email, rol) en req.usuario
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// 2. Validar que el Rol sea Admin
exports.verifyAdmin = (req, res, next) => {
  // Verificar que req.usuario exista y que su rol sea 'admin'
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: Requiere permisos de Administrador' });
  }
  next();
};