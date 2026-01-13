export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${process.env.SITE_URL}/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
