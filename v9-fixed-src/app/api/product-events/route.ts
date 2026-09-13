import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

const EVENTS = new Set([
  "page_view",
  "advisor_started",
  "advisor_feedback_helpful",
  "advisor_feedback_unhelpful",
  "advisor_tool_open",
  "troubleshooter_diagnosis",
  "troubleshooter_feedback_helpful",
  "troubleshooter_feedback_unhelpful",
  "troubleshooter_next_step",
  "workflow_started",
  "workflow_ready",
  "workflow_copied",
  "prompt_optimizer_started",
  "prompt_optimizer_compiled",
  "prompt_optimizer_copied",
  "newsletter_signup",
  "premium_intent",
]);

const PRODUCTS = new Set(["site", "advisor", "troubleshooter", "workflow", "prompt_optimizer", "newsletter", "monetization"]);

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) || null : null;
}

function safeProperties(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: Record<string, string | number | boolean | null> = {};
  for (const [key, raw] of Object.entries(value).slice(0, 12)) {
    if (!/^[a-z0-9_]{1,40}$/i.test(key)) continue;
    if (typeof raw === "string") output[key] = raw.slice(0, 120);
    else if (typeof raw === "number" && Number.isFinite(raw)) output[key] = raw;
    else if (typeof raw === "boolean" || raw === null) output[key] = raw;
  }
  return output;
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin) {
      const originHost = new URL(origin).host;
      const requestHost = new URL(request.url).host;
      if (originHost !== requestHost) return NextResponse.json({ ok: false }, { status: 403 });
    }

    const body = await request.json();
    const visitorId = text(body.visitorId, 80);
    const sessionId = text(body.sessionId, 80);
    const eventName = text(body.eventName, 64);
    const product = text(body.product, 32);
    const path = text(body.path, 300) || "/";

    if (!visitorId || visitorId.length < 8 || !sessionId || sessionId.length < 8) {
      return NextResponse.json({ ok: false, error: "invalid_identity" }, { status: 400 });
    }
    if (!eventName || !EVENTS.has(eventName) || !product || !PRODUCTS.has(product)) {
      return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
    }

    const supabase = createServerSupabase();
    if (!supabase) return NextResponse.json({ ok: false, error: "service_unavailable" }, { status: 503 });

    const { error } = await supabase.from("product_events").insert({
      visitor_id: visitorId,
      session_id: sessionId,
      event_name: eventName,
      product,
      path,
      referrer_host: text(body.referrerHost, 180),
      utm_source: text(body.utmSource, 120),
      utm_medium: text(body.utmMedium, 120),
      utm_campaign: text(body.utmCampaign, 160),
      properties: safeProperties(body.properties),
    });

    if (error) return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }
}
