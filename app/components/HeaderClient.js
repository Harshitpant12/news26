"use client";

import PushSubscribe from "./PushSubscribe";
import { useEffect, useState } from "react";

export default function HeaderClient() {
    const [theme, setTheme] = useState("light");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme") || "light";
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
    }, []);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        localStorage.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);
    };

    return (
        <header style={header}>
            <PushSubscribe />
            <div style={container}>
                <div style={brand}>News26</div>

                {/* Desktop Nav */}
                <nav style={navDesktop}>
                    <NavLinks />
                    <button onClick={toggleTheme} style={themeBtn}>
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                </nav>

                {/* Mobile Controls */}
                <div style={mobileControls}>
                    <button onClick={toggleTheme} style={themeBtn}>
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                    <button onClick={() => setMenuOpen(!menuOpen)} style={menuBtn}>
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={mobileMenu}>
                    <NavLinks onClick={() => setMenuOpen(false)} />
                </div>
            )}
        </header>
    );
}

/* ---------- COMPONENTS ---------- */

function NavLinks({ onClick }) {
    return (
        <>
            <a onClick={onClick} href="/">Home</a>
            <a onClick={onClick} href="/category/india">India</a>
            <a onClick={onClick} href="/category/world">World</a>
            <a onClick={onClick} href="/category/business">Business</a>
            <a onClick={onClick} href="/category/technology">Technology</a>
            <a onClick={onClick} href="/category/sports">Sports</a>
        </>
    );
}

/* ---------- STYLES ---------- */

const container = {
    maxWidth: "1200px",
    margin: "auto",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
};

const header = {
    background: "var(--card)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100,
};

const brand = {
    fontSize: "26px",
    fontWeight: 800,
    color: "var(--primary)",
};

const navDesktop = {
    display: "flex",
    gap: "18px",
    alignItems: "center",
};

const mobileControls = {
    display: "none",
};

const themeBtn = {
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
};

const menuBtn = {
    fontSize: "22px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
};

const mobileMenu = {
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    gap: "14px",
    background: "var(--card)",
    borderBottom: "1px solid var(--border)",
};

/* ---------- RESPONSIVE ---------- */

if (typeof window !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
    @media (max-width: 768px) {
      nav { display: none !important; }
      div[style*="mobileControls"] { display: flex !important; gap: 12px; }
    }
  `;
    document.head.appendChild(style);
}
