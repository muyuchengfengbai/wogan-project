import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const salesByDay = await sql(`
      SELECT DATE(created_at) as date,
             SUM(total_amount) as sales,
             COUNT(*) as orders
      FROM orders
      WHERE created_at >= CURRENT_DATE - 7
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const topProducts = await sql(`
      SELECT name, sales_count, price, grade
      FROM products
      ORDER BY sales_count DESC
      LIMIT 5
    `);

    const statusCount = await sql(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    const gradeCount = await sql(`
      SELECT grade, COUNT(*) as count, SUM(stock_kg) as total_stock
      FROM products
      GROUP BY grade
    `);

    return Response.json({ salesByDay, topProducts, statusCount, gradeCount });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return Response.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
