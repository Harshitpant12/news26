import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";

export async function GET(request, { params }) {
    const slug = params.slug?.[0];
    if (!slug || !slug.endsWith(".html")) {
        return notFound();
    }
    const fileName = slug;
    const filePath = path.join(process.cwd(), "public", fileName);
    try {
        const content = await fs.readFile(filePath, "utf8");
        return new Response(content, {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
    } catch (e) {
        return notFound();
    }
}
