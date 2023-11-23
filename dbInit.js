import nodePg from 'pg';
const { Pool } = nodePg;

const pool = new Pool({ connectionString: process.env.PG_URI });

export const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const getClient = () => {
  return pool.connect();
};
