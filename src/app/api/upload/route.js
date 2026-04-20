import { writeFile } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const filename = `${randomBytes(16).toString("hex")}.${ext}`;
    const filepath = join(process.cwd(), "public", "uploads", filename);

    await writeFile(filepath, buffer);

    return Response.json({
      url: `/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
