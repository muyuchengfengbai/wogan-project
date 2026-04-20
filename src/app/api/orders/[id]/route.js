import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    let order;
    if (/^\d+$/.test(id)) {
      [order] = await sql('SELECT * FROM orders WHERE id = $1', [id]);
    } else {
      [order] = await sql('SELECT * FROM orders WHERE order_no = $1', [id]);
    }
    if (!order) {
      return Response.json({ error: "订单不存在" }, { status: 404 });
    }
    const items = await sql('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
    return Response.json({ order, items });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const [order] = await sql(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return Response.json({ order });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "更新订单失败" }, { status: 500 });
  }
}
