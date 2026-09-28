const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Ver productos es público (para la tienda)
router.get('/', productoController.getProductos);

// Crear productos requiere ser Admin
router.post('/', verifyToken, verifyAdmin, productoController.crearProducto);

module.exports = router;