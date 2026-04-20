import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get("grade");
    const search = searchParams.get("search");

    let query = "SELECT * FROM products WHERE 1=1";
    const values = [];

    if (grade && grade !== "all") {
      values.push(grade);
      query += ` AND grade = $${values.length}`;
    }
    if (search) {
      const searchPattern = `%${search}%`;
      values.push(searchPattern);
      const searchIndex = values.length;
      query += ` AND (name ILIKE $${searchIndex} OR origin ILIKE $${searchIndex})`;
    }
    query += " ORDER BY sales_count DESC, id DESC";

    console.log("Query:", query);
    console.log("Values:", values);
    const products = await sql(query, values);
    console.log("Results:", products.length);
    return Response.json({ products });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      grade,
      price,
      stock_kg,
      origin,
      description,
      image_url,
      specification,
      batch_no,
    } = body;

    if (!name || !price) {
      return Response.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const [product] = await sql(
      `INSERT INTO products (name, grade, price, stock_kg, origin, description, image_url, specification, batch_no)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, grade, price, stock_kg || 0, origin, description, image_url, specification, batch_no]
    );
    return Response.json({ product });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
