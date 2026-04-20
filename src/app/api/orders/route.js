import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let orders;
    if (status && status !== "all") {
      orders = await sql(
        'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC',
        [status]
      );
    } else {
      orders = await sql('SELECT * FROM orders ORDER BY created_at DESC');
    }
    return Response.json({ orders });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      items,
      receiver_name,
      receiver_phone,
      receiver_address,
      payment_method,
    } = body;

    if (!items || items.length === 0) {
      return Response.json({ error: "购物车为空" }, { status: 400 });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const orderNo = `WG${Date.now()}`;

    const [order] = await sql(
      `INSERT INTO orders (order_no, user_id, total_amount, status, payment_method, receiver_name, receiver_phone, receiver_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [orderNo, 1001, totalAmount, 'pending', payment_method || 'alipay', receiver_name, receiver_phone, receiver_address]
    );

    for (const item of items) {
      await sql(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.id, item.name, item.price, item.quantity, item.price * item.quantity]
      );
    }

    return Response.json({ order });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "创建订单失败" }, { status: 500 });
  }
}
