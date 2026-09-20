const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Si tienes middleware de autenticación (opcional pero recomendado):
// const verifyToken = require('../middlewares/verifyToken');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta para cambiar contraseña
router.post('/update-password', authController.updatePassword); 
// Si usas middleware, quedaría: router.post('/update-password', verifyToken, authController.updatePassword);

router.get('/profile/:email', authController.getProfile);
router.put('/update-profile', authController.updateProfile);

module.exports = router;