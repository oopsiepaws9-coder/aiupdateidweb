import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const LOGOS: Record<string, string> = {
  "canva-ai": "https://www.canva.com/favicon.ico",
  chatgpt: "https://chatgpt.com/favicon.ico",
  claude: "https://claude.ai/favicon.ico",
  cursor: "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/brand/brand-logo-1.svg",
  deepseek: "https://www.deepseek.com/favicon.ico",
  elevenlabs: "https://11labs-nonprd-15f22c1d.s3.eu-west-3.amazonaws.com/a2ea339b-8b5e-41bb-b706-24eda8a4c9e3/elevenlabs-symbol.png",
  gamma: "https://cdn.gamma.app/gdwwhyewwldwc8z/ff57eea3ac52433da7a45305b3232554/original/Group-1713657894.png",
  gemini: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128",
  notebooklm: "https://notebook.google.com/favicon.ico",
  "gemini-spark": "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128",
  "github-copilot": "https://github.com/favicon.ico",
  grok: "https://grok.com/favicon.ico",
  lovable: "https://lovable.dev/favicon.ico",
  manus: "https://files.manuscdn.com/assets/image/brand/image/Manus-Icon.png",
  "microsoft-copilot": "https://copilot.microsoft.com/favicon.ico",
  midjourney: "https://www.midjourney.com/favicon.ico",
  "notion-ai": "https://www.notion.so/images/favicon.ico",
  perplexity: "https://www.perplexity.ai/favicon.ico",
  replit: "https://replit.com/favicon.ico",
  runway: "https://runway-static-assets.s3.amazonaws.com/site/images/api-page/powered-by-runway-black.png",
  suno: "https://suno.com/favicon.ico",
};

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const source = LOGOS[slug];
  if (!source) return new NextResponse("Not found", { status: 404 });

  try {
    const upstream = await fetch(source, {
      next: { revalidate: 604800 },
      headers: { "User-Agent": "AIUpdateId/1.0 (+https://aiupdateid.com)" },
    });
    if (!upstream.ok) return new NextResponse("Logo unavailable", { status: 502 });

    const contentType = upstream.headers.get("content-type") || "image/png";
    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Logo unavailable", { status: 502 });
  }
}
