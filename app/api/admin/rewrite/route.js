export const runtime = "nodejs";

import {
    findArticleById,
    updateArticle
} from "../../../../lib/db.js";

export async function POST(req) {
    const auth = req.headers.get("x-admin-password");
    if (auth !== process.env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();
    const article = await findArticleById(id);

    if (!article) {
        return new Response("Not found", { status: 404 });
    }

    // AI rewrite already handled earlier (OpenAI / free logic)
    // Here we just save updated content passed from rewrite logic
    await updateArticle(id, { content: article.content });

    return Response.json({ success: true });
}
