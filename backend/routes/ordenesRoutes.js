const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, ordenesController.crearOrden);
router.get('/mis-pedidos', verifyToken, ordenesController.getMisPedidos);

module.exports = router;