import sql from './src/app/api/utils/sql.js';

const query = "SELECT * FROM products WHERE 1=1 AND grade = $1 ORDER BY sales_count DESC, id DESC";
const values = ['精品果'];

console.log('Query:', query);
console.log('Values:', values);

const products = await sql(query, values);
console.log('Results:', products.length);
console.log('First product:', products[0]);
