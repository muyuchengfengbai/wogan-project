import pg from 'pg';
const { Pool } = pg;

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

const sql = async (strings, ...values) => {
  if (!pool) {
    throw new Error(
      'No database connection string was provided. Perhaps process.env.DATABASE_URL has not been set'
    );
  }

  // 处理普通字符串查询（带参数数组）
  if (typeof strings === 'string') {
    const params = values.length > 0 && Array.isArray(values[0]) ? values[0] : values;
    const result = await pool.query(strings, params);
    return result.rows;
  }

  // 处理模板字符串查询
  let query = '';
  let params = [];

  for (let i = 0; i < strings.length; i++) {
    query += strings[i];
    if (i < values.length) {
      params.push(values[i]);
      query += `$${params.length}`;
    }
  }

  const result = await pool.query(query, params);
  return result.rows;
};

export default sql;