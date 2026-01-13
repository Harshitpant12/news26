export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import dbPromise from "../../../lib/db.js";

export async function generateMetadata({ params }) {
    const db = await dbPromise;
    const a = await db.get("SELECT * FROM articles WHERE id=?", [params.id]);

    return {
        title: `${a.title} | News26`,
        description: a.description,
        openGraph: {
            title: a.title,
            description: a.description,
            images: a.image ? [a.image] : [],
            type: "article",
        },
    };
}


export default async function Article({ params }) {
    const db = await dbPromise;
    const a = await db.get("SELECT * FROM articles WHERE id=?", [params.id]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": a.title,
        "image": a.image ? [a.image] : [],
        "datePublished": a.publishedAt,
        "dateModified": a.publishedAt,
        "author": {
            "@type": "Organization",
            "name": "News26",
        },
        "publisher": {
            "@type": "Organization",
            "name": "News26",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.SITE_URL}/logo.png`,
            },
        },
    };
    const words = a.content.split(" ").length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    return (
        <article style={article}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <h1>{a.title}</h1>
            <p style={meta}>
                {a.source} • {readingTime} min read •{" "}
                {new Date(a.publishedAt).toLocaleString()}
            </p>

            <p style={meta}>
                {a.source} • {new Date(a.publishedAt).toLocaleString()}
            </p>

            {a.image && <img src={a.image} />}

            <div style={content}>{a.content}</div>
        </article>
    );
}

const article = {
    maxWidth: "820px",
    margin: "auto",
};

const meta = {
    color: "var(--muted)",
    fontSize: "14px",
    marginBottom: "20px",
};

const content = {
    marginTop: "28px",
    fontSize: "18px",
};
