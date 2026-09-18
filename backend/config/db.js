const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras en bases de datos en la nube (Neon/Supabase)
  }
});

pool.on('connect', () => {
  console.log('Conectado exitosamente a PostgreSQL');
});

module.exports = pool;