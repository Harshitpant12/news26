export const runtime = "nodejs";

import { getAllArticles } from "../lib/db.js";

export const dynamic = "force-dynamic";

export default async function sitemap() {
    const siteUrl = process.env.SITE_URL;
    const articles = await getAllArticles();

    const articleUrls = articles.map((a) => ({
        url: `${siteUrl}/article/${a.id}`,
        lastModified: new Date(a.publishedAt),
    }));

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
        },
        ...articleUrls,
    ];
}
