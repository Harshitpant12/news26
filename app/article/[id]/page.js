export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { findArticleById } from "../../../lib/db.js";

/* ---------- SEO METADATA ---------- */
export async function generateMetadata({ params }) {
    const a = await findArticleById(params.id);

    if (!a) {
        return {
            title: "Article not found | News26",
            description: "The requested article could not be found.",
        };
    }

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

/* ---------- PAGE ---------- */
export default async function Article({ params }) {
    const a = await findArticleById(params.id);

    if (!a) {
        return (
            <div style={{ textAlign: "center", marginTop: 80 }}>
                <h1>Article not found</h1>
            </div>
        );
    }

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

    const words = a.content?.split(" ").length || 0;
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

            {a.image && <img src={a.image} alt={a.title} />}

            <div style={content}>{a.content}</div>
        </article>
    );
}

/* ---------- STYLES ---------- */

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
