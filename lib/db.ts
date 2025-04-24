// lib/db.js
import mysql, { RowDataPacket } from "mysql2/promise";
import { ResultSetHeader } from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST, // 예: your-db.xxxxxxx.rds.amazonaws.com
  user: process.env.DB_USER, // 예: admin
  password: process.env.DB_PASSWORD, // 예: yourPassword
  database: process.env.DB_NAME, // 예: cpnow
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const queryOne = async <T extends RowDataPacket = any>(
  sql: string,
  params: any[],
): Promise<T | null> => {
  const [rows] = await pool.execute<T[]>(sql, params);
  return rows[0] || null;
};

const queryList = async <T extends RowDataPacket = any>(
  sql: string,
  params: any[] = [],
): Promise<T[]> => {
  const [rows] = await pool.execute<T[]>(sql, params);
  return rows;
};

const insertOne = async (sql: string, params: any[]) => {
  await pool.execute<ResultSetHeader>(sql, params);
};

export { pool, queryOne, queryList, insertOne };
