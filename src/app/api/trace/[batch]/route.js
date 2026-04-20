import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { batch } = params;
    const traces = await sql(
      `SELECT t.*, p.name as product_name, p.origin, p.image_url
       FROM traceability t
       LEFT JOIN products p ON t.product_id = p.id
       WHERE t.batch_no = $1
       ORDER BY t.action_date ASC`,
      [batch]
    );
    if (traces.length === 0) {
      return Response.json({ error: "未找到该批次记录" }, { status: 404 });
    }
    return Response.json({ traces, product: traces[0] });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "查询失败" }, { status: 500 });
  }
}
