import dbPromise from "../../../lib/db.js";

export async function GET(req) {
  const db = await dbPromise;
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  const rows = category
    ? await db.all(
        "SELECT * FROM articles WHERE category=? ORDER BY publishedAt DESC",
        [category]
      )
    : await db.all(
        "SELECT * FROM articles ORDER BY publishedAt DESC"
      );

  return Response.json(rows);
}
