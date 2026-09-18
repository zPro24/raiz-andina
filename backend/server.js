const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const cors = require('cors');
app.use(cors());

// Prueba directa de consulta a la base de datos al arrancar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error de conexión a PostgreSQL:', err.message);
  } else {
    console.log('✅ Conectado exitosamente a PostgreSQL (Neon):', res.rows[0].now);
  }
});

module.exports = pool;