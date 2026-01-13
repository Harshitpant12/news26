import dbPromise from "../../../../lib/db.js";

export async function GET(req) {
    const auth = req.headers.get("x-admin-password");
    if (auth !== process.env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

    const db = await dbPromise;
    const articles = await db.all(
        "SELECT * FROM articles ORDER BY publishedAt DESC"
    );
    return Response.json(articles);
}

export async function PUT(req) {
    const auth = req.headers.get("x-admin-password");
    if (auth !== process.env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id, title, description, content } = await req.json();
    const db = await dbPromise;

    await db.run(
        `UPDATE articles SET title=?, description=?, content=? WHERE id=?`,
        [title, description, content, id]
    );

    return Response.json({ success: true });
}

export async function DELETE(req) {
    const auth = req.headers.get("x-admin-password");
    if (auth !== process.env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();
    const db = await dbPromise;

    await db.run("DELETE FROM articles WHERE id=?", [id]);
    return Response.json({ success: true });
}
