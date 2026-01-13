import webpush from "web-push";
import dbPromise from "./db.js";

// ✅ SUBJECT MUST BE mailto OR URL
webpush.setVapidDetails(
  "mailto:admin@news26.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function notifyAll(title) {
  const db = await dbPromise;
  const subs = await db.all("SELECT * FROM subscriptions");

  for (const s of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: s.endpoint,
          keys: {
            p256dh: s.p256dh,
            auth: s.auth,
          },
        },
        JSON.stringify({
          title: "News26 – Breaking News",
          body: title,
        })
      );
    } catch (err) {
      console.error("Push failed:", err.message);
    }
  }
}
