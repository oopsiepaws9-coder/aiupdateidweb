import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = getSiteUrl();
  const supabase = createServerSupabase();

  const { data } = supabase
    ? await supabase
        .from("articles")
        .select("title,slug,excerpt,published_at,created_at")
        .eq("status","published")
        .order("published_at",{ascending:false,nullsFirst:false})
        .limit(30)
    : { data: [] };

  const items = (data || []).map(article => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${base}/artikel/${article.slug}</link>
      <guid isPermaLink="true">${base}/artikel/${article.slug}</guid>
      <description>${escapeXml(article.excerpt || "")}</description>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>AIUpdateId</title>
      <link>${base}</link>
      <description>Portal AI Indonesia</description>
      <language>id-ID</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
