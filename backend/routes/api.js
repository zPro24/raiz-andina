const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const pedidoController = require('../controllers/pedidoController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas solo para Administradores
router.get('/admin/usuarios', [verifyToken, verifyAdmin], adminController.getUsuarios);
router.post('/admin/crear-admin', [verifyToken, verifyAdmin], adminController.createAdmin);

// Rutas para Pedidos
router.post('/pedidos', verifyToken, pedidoController.crearPedido);
router.get('/pedidos/usuario/:usuarioId', verifyToken, pedidoController.getMisPedidos);

module.exports = router;