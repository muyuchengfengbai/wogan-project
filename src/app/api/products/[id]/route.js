import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const [product] = await sql('SELECT * FROM products WHERE id = $1', [id]);
    if (!product) {
      return Response.json({ error: "商品不存在" }, { status: 404 });
    }
    const traces = await sql(
      'SELECT * FROM traceability WHERE product_id = $1 ORDER BY action_date ASC',
      [id]
    );
    return Response.json({ product, traces });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];
    const fields = [
      "name",
      "grade",
      "price",
      "stock_kg",
      "origin",
      "description",
      "image_url",
      "specification",
      "batch_no",
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        values.push(body[field]);
        setClauses.push(`${field} = $${values.length}`);
      }
    });

    if (setClauses.length === 0) {
      return Response.json({ error: "没有更新字段" }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
    const [product] = await sql(query, values);
    return Response.json({ product });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await sql('DELETE FROM products WHERE id = $1', [id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
