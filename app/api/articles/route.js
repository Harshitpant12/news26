export const runtime = "nodejs";

import { getAllArticles } from "../../../lib/db.js";

export async function GET(req) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  let articles = await getAllArticles();

  if (category) {
    articles = articles.filter(
      (a) => a.category === category
    );
  }

  // Sort latest first
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  return Response.json(articles);
}
