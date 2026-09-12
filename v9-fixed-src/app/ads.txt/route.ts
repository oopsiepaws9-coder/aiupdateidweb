const ADSENSE_PUBLISHER_ID = "pub-2217952325247884";

export const dynamic = "force-dynamic";

export function GET() {
  const body = `google.com, ${ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    }
  });
}
