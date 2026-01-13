import db from "../../../lib/db.js";

export async function POST(req) {
    const sub = await req.json();
    db.prepare(`
    INSERT INTO subscriptions(endpoint,p256dh,auth)
    VALUES (?,?,?)
  `).run(sub.endpoint, sub.keys.p256dh, sub.keys.auth);
    return Response.json({ success: true });
}
