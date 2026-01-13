import Parser from "rss-parser";
import fetch from "node-fetch";
import { v4 as uuid } from "uuid";
import {
    addArticle,
    findArticleByTitle
} from "./db.js";

const parser = new Parser({
    customFields: {
        item: [
            ["media:content", "media:content"],
            ["media:thumbnail", "media:thumbnail"],
        ],
    },
});

/* ---------- RSS SOURCES ---------- */

const RSS_FEEDS = [
    {
        url: "https://feeds.bbci.co.uk/news/world/rss.xml",
        category: "world",
    },
    {
        url: "https://www.thehindu.com/news/national/feeder/default.rss",
        category: "india",
    },
];

/* ---------- FETCH RSS ---------- */

export async function fetchRSS() {
    for (const feed of RSS_FEEDS) {
        try {
            const data = await parser.parseURL(feed.url);

            for (const item of data.items) {
                if (!item.title) continue;

                const exists = await findArticleByTitle(item.title);
                if (exists) continue;

                const image =
                    item.enclosure?.url ||
                    item["media:content"]?.url ||
                    item["media:thumbnail"]?.url ||
                    "";

                await addArticle({
                    id: uuid(),
                    title: item.title,
                    description: item.contentSnippet || "",
                    content: item.content || item.summary || "",
                    image,
                    video: "",
                    category: feed.category,
                    source: data.title || "RSS",
                    publishedAt: item.pubDate || new Date().toISOString(),
                });
            }
        } catch (err) {
            console.error("RSS fetch failed:", feed.url, err.message);
        }
    }
}

/* ---------- FETCH NEWSAPI ---------- */

export async function fetchNewsAPI() {
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

                const exists = await findArticleByTitle(a.title);
                if (exists) continue;

                await addArticle({
                    id: uuid(),
                    title: a.title,
                    description: a.description || "",
                    content: a.content || "",
                    image: a.urlToImage || "",
                    video: "",
                    category,
                    source: a.source?.name || "NewsAPI",
                    publishedAt: a.publishedAt || new Date().toISOString(),
                });
            }
        } catch (err) {
            console.error("NewsAPI fetch failed:", category, err.message);
        }
    }
}
