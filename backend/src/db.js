import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config()

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'alumini-platform',
}

let pool

function escapeIdentifier(value) {
  return value.replaceAll('`', '``')
}

export async function initDatabase() {
  if (pool) {
    return pool
  }

  const adminConnection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
  })

  const safeDatabase = escapeIdentifier(dbConfig.database)
  await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${safeDatabase}\``)
  await adminConnection.end()

  pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      institution VARCHAR(160) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  return pool
}

export function getDb() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase() first.')
  }

  return pool
}
