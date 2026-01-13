import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// All articles stored under single key
const KEY = "articles";

/*
 Article shape:
 {
   id,
   title,
   description,
   content,
   image,
   video,
   category,
   source,
   publishedAt
 }
*/

export async function getAllArticles() {
  return (await redis.get(KEY)) || [];
}

export async function saveAllArticles(articles) {
  await redis.set(KEY, articles);
}

export async function addArticle(article) {
  const articles = await getAllArticles();
  articles.unshift(article);
  await saveAllArticles(articles);
}

export async function updateArticle(id, updates) {
  const articles = await getAllArticles();
  const updated = articles.map(a =>
    a.id === id ? { ...a, ...updates } : a
  );
  await saveAllArticles(updated);
}

export async function deleteArticle(id) {
  const articles = await getAllArticles();
  await saveAllArticles(articles.filter(a => a.id !== id));
}

export async function findArticleById(id) {
  const articles = await getAllArticles();
  return articles.find(a => a.id === id);
}

export async function findArticleByTitle(title) {
  const articles = await getAllArticles();
  return articles.find(a => a.title === title);
}
