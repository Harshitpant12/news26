export const runtime = "nodejs";

import { fetchRSS, fetchNewsAPI } from "../../../lib/newsFetcher.js";

export async function GET() {
  await fetchRSS();
  await fetchNewsAPI();
  return Response.json({ status: "ok" });
}
