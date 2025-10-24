import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
});

export const testDatabaseConnection = async () => {
  try {
    const client = await pool.query('SELECT NOW()');
    console.log('Database connected, server time:', client.rows[0].now);
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
