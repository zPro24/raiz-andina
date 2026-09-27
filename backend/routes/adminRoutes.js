const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Obtener usuarios (protegido)
router.get('/usuarios', verifyToken, verifyAdmin, adminController.getUsuarios);

// Crear usuario admin (protegido)
router.post('/usuarios', verifyToken, verifyAdmin, adminController.crearUsuarioAdmin);

module.exports = router;