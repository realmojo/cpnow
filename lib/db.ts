// lib/db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST, // 예: your-db.xxxxxxx.rds.amazonaws.com
  user: process.env.DB_USER, // 예: admin
  password: process.env.DB_PASSWORD, // 예: yourPassword
  database: process.env.DB_NAME, // 예: cpnow
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
