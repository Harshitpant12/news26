export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { getAllArticles } from "../../../lib/db.js";
import { notFound } from "next/navigation";

const CATEGORY_TITLES = {
    india: "India News",
    world: "World News",
    business: "Business & Economy",
    technology: "Technology News",
    sports: "Sports News",
    breaking: "Breaking News",
};

export async function generateMetadata({ params }) {
    const title = CATEGORY_TITLES[params.slug] || "News26";
    return {
        title: `${title} | News26`,
        description: `Latest ${title.toLowerCase()} from News26.`,
    };
}

export default async function CategoryPage({ params }) {
    const category = params.slug;

    const allArticles = await getAllArticles();

    const articles = allArticles
        .filter((a) => a.category === category)
        .sort(
            (a, b) =>
                new Date(b.publishedAt) - new Date(a.publishedAt)
        );

    if (!articles.length) {
        return (
            <div style={{ padding: "40px 0" }}>
                <h1>No articles yet</h1>
                <p>
                    News26 is updating this category. Please check back shortly.
                </p>
            </div>
        );
    }

    return (
        <>
            <h1 style={heading}>
                {CATEGORY_TITLES[category] || category.toUpperCase()}
            </h1>

            <section style={grid}>
                {articles.map((a) => (
                    <a
                        key={a.id}
                        href={`/article/${a.id}`}
                        style={card}
                    >
                        <img
                            src={a.image || `/fallback/${category}.jpg`}
                            alt={a.title}
                            loading="lazy"
                            style={image}
                        />

                        <div style={content}>
                            <h3>{a.title}</h3>
                            <p>{a.description}</p>
                            <span style={meta}>
                                {new Date(a.publishedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </a>
                ))}
            </section>
        </>
    );
}

/* ---------- STYLES ---------- */

const heading = {
    marginBottom: "24px",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "22px",
};

const card = {
    background: "var(--card)",
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid var(--border)",
};

const image = {
    height: "180px",
    width: "100%",
    objectFit: "cover",
};

const content = {
    padding: "14px",
};

const meta = {
    fontSize: "12px",
    color: "var(--muted)",
};
