export const runtime = "nodejs";

import {
    getAllArticles,
    updateArticle,
    deleteArticle
} from "../../../../lib/db.js";

export async function GET(req) {
    const auth = req.headers.get("x-admin-password");
    if (auth !== process.env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

    return Response.json(await getAllArticles());
}

export async function PUT(req) {
    const auth = req.headers.get("x-admin-password");
    if (auth !== process.env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    await updateArticle(body.id, body);

    return Response.json({ success: true });
}

export async function DELETE(req) {
    const auth = req.headers.get("x-admin-password");
    if (auth !== process.env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();
    await deleteArticle(id);

    return Response.json({ success: true });
}
