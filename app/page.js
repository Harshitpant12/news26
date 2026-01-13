async function getNews() {
    const res = await fetch(`${process.env.SITE_URL}/api/articles`, {
        cache: "no-store",
    });
    return res.json();
}

export default async function Home() {
    const news = await getNews();
    const hero = news[0];
    const trending = news
        .filter(
            (n) =>
                Date.now() - new Date(n.publishedAt).getTime() <
                24 * 60 * 60 * 1000
        )
        .slice(0, 5);

    const rest = news.slice(6);

    return (
        <>
            {/* HERO */}
            {hero && (
                <section style={heroStyle}>
                    <img src={hero.image} alt={hero.title} />
                    <div style={heroOverlay}>
                        <span style={tag}>Breaking</span>
                        <h1>{hero.title}</h1>
                        <p>{hero.description}</p>
                    </div>
                </section>
            )}

            {/* CONTENT */}
            <section style={layout}>
                {/* MAIN GRID */}
                <div style={grid}>
                    {rest.map((n) => (
                        <a key={n.id} href={`/article/${n.id}`} style={card}>
                            {n.image && <img src={n.image} />}
                            <div style={{ padding: "14px" }}>
                                <h3>{n.title}</h3>
                                <p>{n.description}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* TRENDING */}
                <aside style={sidebar}>
                    <h3>Trending</h3>
                    {trending.map((t) => (
                        <a key={t.id} href={`/article/${t.id}`} style={trendItem}>
                            {t.title}
                        </a>
                    ))}
                </aside>
            </section>
        </>
    );
}

/* ---------- styles ---------- */

const heroStyle = {
    position: "relative",
    height: "420px",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "40px",
};

const heroOverlay = {
    position: "absolute",
    bottom: 0,
    padding: "24px",
    background:
        "linear-gradient(transparent, rgba(0,0,0,0.85))",
    color: "#fff",
};

const tag = {
    background: "#ef4444",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
};

const layout = {
    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    gap: "32px",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
};

const card = {
    background: "var(--card)",
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid var(--border)",
};

const sidebar = {
    background: "#fff",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid var(--border)",
    height: "fit-content",
};

const trendItem = {
    display: "block",
    padding: "10px 0",
    borderBottom: "1px solid var(--border)",
    fontSize: "14px",
};
