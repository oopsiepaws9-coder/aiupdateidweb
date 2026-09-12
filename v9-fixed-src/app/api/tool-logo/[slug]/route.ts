import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const LOGOS: Record<string, string[]> = {
  "canva-ai": ["https://www.canva.com/favicon.ico", "https://www.google.com/s2/favicons?domain=canva.com&sz=128"],
  chatgpt: ["https://chatgpt.com/favicon.ico", "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128"],
  claude: ["https://claude.ai/favicon.ico", "https://www.google.com/s2/favicons?domain=claude.ai&sz=128"],
  cursor: ["https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/brand/brand-logo-1.svg", "https://www.google.com/s2/favicons?domain=cursor.com&sz=128"],
  deepseek: ["https://www.deepseek.com/favicon.ico", "https://www.google.com/s2/favicons?domain=deepseek.com&sz=128"],
  elevenlabs: ["https://11labs-nonprd-15f22c1d.s3.eu-west-3.amazonaws.com/a2ea339b-8b5e-41bb-b706-24eda8a4c9e3/elevenlabs-symbol.png", "https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128"],
  gamma: ["https://cdn.gamma.app/gdwwhyewwldwc8z/ff57eea3ac52433da7a45305b3232554/original/Group-1713657894.png", "https://www.google.com/s2/favicons?domain=gamma.app&sz=128"],
  gemini: ["https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128"],
  notebooklm: ["https://notebook.google.com/favicon.ico", "https://www.google.com/s2/favicons?domain=notebooklm.google.com&sz=128"],
  "gemini-spark": ["https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128"],
  "github-copilot": ["https://github.com/favicon.ico", "https://www.google.com/s2/favicons?domain=github.com&sz=128"],
  grok: ["https://grok.com/favicon.ico", "https://www.google.com/s2/favicons?domain=grok.com&sz=128"],
  lovable: ["https://lovable.dev/favicon.ico", "https://www.google.com/s2/favicons?domain=lovable.dev&sz=128"],
  manus: ["https://files.manuscdn.com/assets/image/brand/image/Manus-Icon.png", "https://www.google.com/s2/favicons?domain=manus.im&sz=128"],
  "microsoft-copilot": ["https://copilot.microsoft.com/favicon.ico", "https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=128"],
  midjourney: ["https://www.midjourney.com/favicon.ico", "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128"],
  "notion-ai": ["https://www.notion.so/images/favicon.ico", "https://www.google.com/s2/favicons?domain=notion.so&sz=128"],
  perplexity: ["https://www.perplexity.ai/favicon.ico", "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128"],
  replit: ["https://replit.com/favicon.ico", "https://www.google.com/s2/favicons?domain=replit.com&sz=128"],
  runway: ["https://runway-static-assets.s3.amazonaws.com/site/images/api-page/powered-by-runway-black.png", "https://www.google.com/s2/favicons?domain=runwayml.com&sz=128"],
  suno: ["https://suno.com/favicon.ico", "https://www.google.com/s2/favicons?domain=suno.com&sz=128"],
};

const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000";

function initialsFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2) || "AI";
}

function fallbackLogo(slug: string) {
  const initials = initialsFromSlug(slug);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#0f172a"/><text x="64" y="72" text-anchor="middle" dominant-baseline="middle" font-family="Arial,Helvetica,sans-serif" font-size="42" font-weight="700" fill="#ffffff">${initials}</text></svg>`;
  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": CACHE_CONTROL,
      "X-Content-Type-Options": "nosniff",
      "X-AIUpdateId-Logo-Fallback": "initials",
    },
  });
}

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const sources = LOGOS[slug];
  if (!sources) return new NextResponse("Not found", { status: 404 });

  for (const source of sources) {
    try {
      const upstream = await fetch(source, {
        next: { revalidate: 604800 },
        headers: { "User-Agent": "AIUpdateId/1.0 (+https://aiupdateid.com)" },
      });
      if (!upstream.ok) continue;

      const contentType = upstream.headers.get("content-type") || "image/png";
      if (!contentType.startsWith("image/") && contentType !== "application/octet-stream") continue;

      const body = await upstream.arrayBuffer();
      if (!body.byteLength) continue;

      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": CACHE_CONTROL,
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      // Try the next known source before using the generated fallback.
    }
  }

  return fallbackLogo(slug);
}
