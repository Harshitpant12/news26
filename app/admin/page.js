"use client";

import { useState } from "react";

export default function AdminPage() {
    const [password, setPassword] = useState("");
    const [articles, setArticles] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rewritingId, setRewritingId] = useState(null);

    /* ---------- LOAD ARTICLES ---------- */

    async function loadArticles() {
        setLoading(true);
        const res = await fetch("/api/admin/articles", {
            headers: { "x-admin-password": password },
        });

        if (!res.ok) {
            alert("Wrong admin password");
            setLoading(false);
            return;
        }

        setArticles(await res.json());
        setLoading(false);
    }

    /* ---------- AI REWRITE ---------- */

    async function aiRewrite(id) {
        if (!confirm("Rewrite this article using AI?")) return;

        setRewritingId(id);

        const res = await fetch("/api/admin/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-password": password,
            },
            body: JSON.stringify({ id }),
        });

        setRewritingId(null);

        if (!res.ok) {
            alert("AI rewrite failed");
            return;
        }

        alert("Article rewritten successfully");
        loadArticles();
    }

    /* ---------- SAVE EDIT ---------- */

    async function saveEdit() {
        if (!editing?.id) return;

        const res = await fetch("/api/admin/articles", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-admin-password": password,
            },
            body: JSON.stringify({
                id: editing.id,
                title: editing.title,
                description: editing.description,
                content: editing.content,
            }),
        });

        if (!res.ok) {
            alert("Failed to update article");
            return;
        }

        alert("Article updated");
        setEditing(null);
        loadArticles();
    }

    /* ---------- DELETE ---------- */

    async function deleteArticle(id) {
        if (!confirm("Delete this article permanently?")) return;

        await fetch("/api/admin/articles", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-admin-password": password,
            },
            body: JSON.stringify({ id }),
        });

        loadArticles();
    }

    return (
        <div style={container}>
            <h1 style={heading}>News26 Admin Panel</h1>

            {!articles.length && (
                <div style={loginBox}>
                    <input
                        type="password"
                        placeholder="Admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={input}
                    />
                    <button onClick={loadArticles} style={primaryBtn}>
                        {loading ? "Loading..." : "Load Articles"}
                    </button>
                </div>
            )}

            {articles.length > 0 && (
                <div style={list}>
                    {articles.map((a) => (
                        <div key={a.id} style={card}>
                            <div style={{ flex: 1 }}>
                                <strong>{a.title}</strong>
                                <div style={meta}>
                                    {a.category} •{" "}
                                    {new Date(a.publishedAt).toLocaleString()}
                                </div>
                            </div>

                            <div style={actions}>
                                <button
                                    style={aiBtn}
                                    onClick={() => aiRewrite(a.id)}
                                    disabled={rewritingId === a.id}
                                >
                                    {rewritingId === a.id ? "Rewriting..." : "AI Rewrite"}
                                </button>

                                <button
                                    style={editBtn}
                                    onClick={() => setEditing({ ...a })}
                                >
                                    Edit
                                </button>

                                <button
                                    style={deleteBtn}
                                    onClick={() => deleteArticle(a.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editing && (
                <div style={editor}>
                    <h2>Edit Article</h2>

                    <input
                        style={input}
                        value={editing.title}
                        onChange={(e) =>
                            setEditing({ ...editing, title: e.target.value })
                        }
                    />

                    <textarea
                        style={textarea}
                        rows={3}
                        value={editing.description}
                        onChange={(e) =>
                            setEditing({ ...editing, description: e.target.value })
                        }
                    />

                    <textarea
                        style={textarea}
                        rows={10}
                        value={editing.content}
                        onChange={(e) =>
                            setEditing({ ...editing, content: e.target.value })
                        }
                    />

                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={saveBtn} onClick={saveEdit}>
                            Save Changes
                        </button>
                        <button
                            style={cancelBtn}
                            onClick={() => setEditing(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const container = {
    maxWidth: 1100,
    margin: "40px auto",
    padding: "0 16px",
};

const heading = {
    marginBottom: 24,
};

const loginBox = {
    maxWidth: 420,
    display: "flex",
    gap: 10,
};

const list = {
    display: "grid",
    gap: 14,
};

const card = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 16,
};

const meta = {
    fontSize: 12,
    color: "var(--muted)",
};

const actions = {
    display: "flex",
    gap: 8,
};

const editor = {
    marginTop: 40,
    background: "var(--card)",
    padding: 20,
    borderRadius: 14,
    border: "1px solid var(--border)",
    display: "grid",
    gap: 12,
};

const input = {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    width: "100%",
};

const textarea = {
    ...input,
    resize: "vertical",
};

const primaryBtn = {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
};

const aiBtn = {
    background: "#fef3c7",
    color: "#92400e",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
};

const editBtn = {
    background: "#e5e7eb",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
};

const deleteBtn = {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
};

const saveBtn = {
    background: "#14532d",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
};

const cancelBtn = {
    background: "#f3f4f6",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
};
