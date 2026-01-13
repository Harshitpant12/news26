import Parser from "rss-parser";
import fetch from "node-fetch";
import dbPromise from "./db.js";
import { v4 as uuid } from "uuid";
import { notifyAll } from "./push.js";

const parser = new Parser({
    customFields: {
        item: [
            ["media:content", "media:content"],
            ["media:thumbnail", "media:thumbnail"],
        ],
    },
});

/* ---------------- RSS SOURCES ---------------- */
/* BBC India RSS is unstable, so we use NDTV instead */

const RSS_FEEDS = [
    {
        url: "https://feeds.bbci.co.uk/news/world/rss.xml",
        category: "world",
    },
    {
        url: "https://feeds.feedburner.com/ndtvnews-india-news",
        category: "india",
    },
    {
        url: "https://www.thehindu.com/news/national/feeder/default.rss",
        category: "india",
    },
];

/* ---------------- FETCH FROM RSS ---------------- */

export async function fetchRSS() {
    const db = await dbPromise;

    for (const feed of RSS_FEEDS) {
        try {
            const data = await parser.parseURL(feed.url);

            for (const item of data.items) {
                if (!item.title) continue;

                const exists = await db.get(
                    "SELECT 1 FROM articles WHERE title = ?",
                    [item.title]
                );

                if (exists) continue;

                const image =
                    item.enclosure?.url ||
                    item["media:content"]?.url ||
                    item["media:thumbnail"]?.url ||
                    "";

                await db.run(
                    `INSERT INTO articles VALUES (?,?,?,?,?,?,?,?,?)`,
                    [
                        uuid(),
                        item.title,
                        item.contentSnippet || "",
                        item.content || item.summary || "",
                        image,
                        "",
                        feed.category,
                        data.title || "RSS Source",
                        item.pubDate || new Date().toISOString(),
                    ]
                );
            }
        } catch (err) {
            console.error("RSS fetch failed:", feed.url, err.message);
        }
    }
}

/* ---------------- FETCH FROM NEWSAPI ---------------- */

export async function fetchNewsAPI() {
    const db = await dbPromise;

    const categories = [
        "business",
        "technology",
        "sports",
        "health",
        "science",
        "entertainment",
    ];

    for (const category of categories) {
        try {
            const res = await fetch(
                `https://newsapi.org/v2/top-headlines?country=in&category=${category}&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`
            );

            const json = await res.json();
            if (!json.articles) continue;

            for (const a of json.articles) {
                if (!a.title) continue;

                const exists = await db.get(
                    "SELECT 1 FROM articles WHERE title = ?",
                    [a.title]
                );

                if (exists) continue;

                await db.run(
                    `INSERT INTO articles VALUES (?,?,?,?,?,?,?,?,?)`,
                    [
                        uuid(),
                        a.title,
                        a.description || "",
                        a.content || "",
                        a.urlToImage || "",
                        "",
                        category,
                        a.source?.name || "NewsAPI",
                        a.publishedAt || new Date().toISOString(),
                    ]
                );

                /* 🔔 PUSH NOTIFICATION (SAFE, NON-BLOCKING) */
                if (process.env.VAPID_PUBLIC_KEY) {
                    try {
                        await notifyAll(a.title);
                    } catch (pushErr) {
                        console.error("Push failed:", pushErr.message);
                    }
                }
            }
        } catch (err) {
            console.error(`NewsAPI ${category} fetch failed`, err.message);
        }
    }
}
