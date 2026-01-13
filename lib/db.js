import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "news.db",
  driver: sqlite3.Database
});

async function init() {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      content TEXT,
      image TEXT,
      video TEXT,
      category TEXT,
      source TEXT,
      publishedAt TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT,
      p256dh TEXT,
      auth TEXT
    );
  `);
}

init();

export default dbPromise;
