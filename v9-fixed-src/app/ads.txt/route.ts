import { getAdSensePublisherId } from "@/lib/adsense";

export const dynamic = "force-dynamic";

export function GET() {
  const publisherId = getAdSensePublisherId();
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    }
  });
}
