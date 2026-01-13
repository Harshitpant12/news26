export const runtime = "nodejs";

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const KEY = "subscriptions";

export async function POST(req) {
  const sub = await req.json();

  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return new Response("Invalid subscription", { status: 400 });
  }

  const existing = (await redis.get(KEY)) || [];

  // avoid duplicate subscriptions
  const alreadyExists = existing.find(
    (s) => s.endpoint === sub.endpoint
  );

  if (!alreadyExists) {
    existing.push({
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    });

    await redis.set(KEY, existing);
  }

  return Response.json({ success: true });
}
