import "./globals.css";
import HeaderClient from "./components/HeaderClient";

export const metadata = {
    title: "News26 – India & World News",
    description:
        "News26 is a modern Next.js-powered news platform delivering Indian and global news.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="google-site-verification"
                    content="google3f91a7b2c1d8e123"
                />
            </head>
            <body>
                <HeaderClient />
                <main style={main}>{children}</main>
                <Footer />
            </body>
        </html>
    );
}

/* ---------- FOOTER (SERVER SAFE) ---------- */

function Footer() {
    return (
        <footer style={footer}>
            <div style={footerGrid}>
                <div>
                    <h3>News26</h3>
                    <p>
                        News26 is a modern digital news platform built with Next.js,
                        delivering fast, reliable Indian and global news.
                    </p>
                </div>

                <div>
                    <h4>Categories</h4>
                    <ul>
                        <li>India</li>
                        <li>World</li>
                        <li>Business</li>
                        <li>Technology</li>
                        <li>Sports</li>
                    </ul>
                </div>

                <div>
                    <h4>About</h4>
                    <ul>
                        <li>About Us</li>
                        <li>Editorial Policy</li>
                        <li>Privacy Policy</li>
                        <li>Contact</li>
                    </ul>
                </div>
            </div>

            <div style={copyright}>
                © {new Date().getFullYear()} News26 • Built with Next.js
            </div>
        </footer>
    );
}

/* ---------- STYLES ---------- */

const main = {
    maxWidth: "1200px",
    margin: "24px auto",
    padding: "0 16px",
};

const footer = {
    background: "var(--footer)",
    color: "#cbd5f5",
    padding: "48px 16px 24px",
    marginTop: "60px",
};

const footerGrid = {
    maxWidth: "1200px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "32px",
};

const copyright = {
    textAlign: "center",
    marginTop: "32px",
    fontSize: "14px",
    color: "#94a3b8",
};
