const jwt = require('jsonwebtoken');

// Verificar que el usuario envió un Token válido
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });

    try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro');
    req.usuario = verified; // Contiene id, email, rol, etc.
    next();
    } catch (err) {
    res.status(400).json({ error: 'Token no válido' });
    }
};

// Verificar si el usuario tiene rol de 'admin'
exports.verifyAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'admin') {
    next();
    } else {
    return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de Administrador' });
    }
};