import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const products = await sql(
      "SELECT * FROM products ORDER BY id DESC LIMIT 10",
      []
    );
    const sensors = await sql(
      "SELECT * FROM orchard_sensors ORDER BY recorded_at DESC LIMIT 1",
      []
    );

    // 计算真实的今日销售额
    const todaySales = await sql(
      `SELECT COALESCE(SUM(total_amount), 0) as total
       FROM orders
       WHERE DATE(created_at) = CURRENT_DATE`,
      []
    );

    const totalOrders = await sql("SELECT COUNT(*) as count FROM orders", []);

    const stats = {
      totalSales: Number(todaySales[0]?.total || 0),
      totalOrders: Number(totalOrders[0]?.count || 0),
      harvestProgress: 72,
      activeUsers: 856,
    };

    return Response.json({ products, sensor: sensors[0], stats });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
