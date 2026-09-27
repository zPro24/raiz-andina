const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Conexión a la base de datos
const pool = require('./config/db');

// 2. Inicializar Express
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middlewares Globales (DEBEN IR ANTES DE LAS RUTAS)
app.use(cors());
app.use(express.json());

// 4. Importar Rutas
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/api');

// 5. Registrar Rutas
app.use('/api/auth', authRoutes); // Login, Registro, Perfil, Password
app.use('/api', apiRoutes);       // Admin (usuarios, crear-admin) y Pedidos

app.get('/', (req, res) => {
  res.send('API de Raíz Andina funcionando correctamente 🚀');
});

// 6. Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);