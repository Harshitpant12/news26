export async function GET() {
    return new Response(
        "google-site-verification: google260f36605ddf5f02.html",
        {
            status: 200,
            headers: { "Content-Type": "text/plain" },
        }
    );
}
