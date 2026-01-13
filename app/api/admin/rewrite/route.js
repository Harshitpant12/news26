import dbPromise from "../../../../lib/db.js";
import { rewriteArticle } from "../../../../lib/aiRewrite.js";

export async function POST(req) {
    const auth = req.headers.get("x-admin-password");
    if (auth !== process.env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();
    const db = await dbPromise;

    const article = await db.get(
        "SELECT * FROM articles WHERE id=?",
        [id]
    );

    if (!article) {
        return new Response("Not found", { status: 404 });
    }

    const rewritten = await rewriteArticle(
        `${article.title}\n\n${article.content}`
    );

    await db.run(
        "UPDATE articles SET content=? WHERE id=?",
        [rewritten, id]
    );

    return Response.json({ success: true, content: rewritten });
}
