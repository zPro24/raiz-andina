const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// GET /api/admin/usuarios
router.get('/usuarios', verifyToken, verifyAdmin, adminController.getUsuarios);

// POST /api/admin/usuarios
router.post('/usuarios', verifyToken, verifyAdmin, adminController.crearUsuarioAdmin);

module.exports = router;