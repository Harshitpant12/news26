import dbPromise from "../../lib/db.js";

export async function GET() {
    const db = await dbPromise;

    const articles = await db.all(
        "SELECT id, publishedAt FROM articles ORDER BY publishedAt DESC"
    );

    const urls = articles
        .map(
            (a) => `
  <url>
    <loc>${process.env.SITE_URL}/article/${a.id}</loc>
    <lastmod>${new Date(a.publishedAt).toISOString()}</lastmod>
  </url>`
        )
        .join("");

    const staticUrls = `
  <url><loc>${process.env.SITE_URL}</loc></url>
  <url><loc>${process.env.SITE_URL}/category/india</loc></url>
  <url><loc>${process.env.SITE_URL}/category/world</loc></url>
  <url><loc>${process.env.SITE_URL}/category/business</loc></url>
  <url><loc>${process.env.SITE_URL}/category/technology</loc></url>
  <url><loc>${process.env.SITE_URL}/category/sports</loc></url>
  `;

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${urls}
</urlset>`,
        {
            headers: {
                "Content-Type": "application/xml",
            },
        }
    );
}
