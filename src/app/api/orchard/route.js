import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const sensors = await sql(
      'SELECT * FROM orchard_sensors ORDER BY recorded_at DESC LIMIT 3'
    );

    // 生成模拟的历史24小时数据
    const history = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 60 * 60 * 1000);
      history.push({
        hour: t.getHours() + ":00",
        temperature: (22 + Math.sin(i / 4) * 5 + Math.random() * 2).toFixed(1),
        humidity: (60 + Math.cos(i / 3) * 8 + Math.random() * 3).toFixed(1),
        soil: (45 + Math.sin(i / 5) * 5 + Math.random() * 2).toFixed(1),
      });
    }

    return Response.json({ sensors, history });
  } catch (error) {
    console.error('Orchard API Error:', error);
    return Response.json(
      { error: "Failed to fetch orchard data" },
      { status: 500 },
    );
  }
}
