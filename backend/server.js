const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Conexión a la base de datos
const pool = require('./config/db');

// 2. Rutas
const authRoutes = require('./routes/authRoutes');

// 3. Inicializar Express (DEBE IR ANTES DE USAR app.use)
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Middlewares
app.use(cors());
app.use(express.json());

// 5. Declaración de Rutas
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API de Raíz Andina funcionando correctamente 🚀');
});

// 6. Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});