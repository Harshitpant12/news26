import "dotenv/config";
import { fetchRSS, fetchNewsAPI } from "../lib/newsFetcher.js";
await fetchRSS();
await fetchNewsAPI();
console.log("News fetched");
