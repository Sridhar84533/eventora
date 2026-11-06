const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'event_management',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

// Test Database connection
pool.getConnection()
  .then(connection => {
    console.log('MySQL Database connected successfully to database:', process.env.DB_NAME || 'event_management');
    connection.release();
  })
  .catch(err => {
    console.warn('MySQL Connection Warning:', err.message);
    console.warn('Please ensure MySQL server is running and credentials in .env are correct.');
  });

module.exports = pool;
