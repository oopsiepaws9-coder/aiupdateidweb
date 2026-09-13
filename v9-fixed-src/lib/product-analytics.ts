export type ProductArea =
  | "site"
  | "advisor"
  | "troubleshooter"
  | "workflow"
  | "prompt_optimizer"
  | "newsletter"
  | "monetization";

export type ProductEventName =
  | "page_view"
  | "advisor_started"
  | "advisor_feedback_helpful"
  | "advisor_feedback_unhelpful"
  | "advisor_tool_open"
  | "troubleshooter_diagnosis"
  | "troubleshooter_feedback_helpful"
  | "troubleshooter_feedback_unhelpful"
  | "troubleshooter_next_step"
  | "workflow_started"
  | "workflow_ready"
  | "workflow_copied"
  | "prompt_optimizer_started"
  | "prompt_optimizer_compiled"
  | "prompt_optimizer_copied"
  | "newsletter_signup"
  | "premium_intent";

type Primitive = string | number | boolean | null;
type EventProperties = Record<string, Primitive>;

const VISITOR_KEY = "aiupdateid_visitor_id_v1";
const SESSION_KEY = "aiupdateid_session_id_v1";

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function getStoredId(storage: Storage, key: string) {
  try {
    const current = storage.getItem(key);
    if (current && current.length >= 8 && current.length <= 80) return current;
    const next = randomId();
    storage.setItem(key, next);
    return next;
  } catch {
    return randomId();
  }
}

function getReferrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname.slice(0, 180) : null;
  } catch {
    return null;
  }
}

function getUtm(name: "utm_source" | "utm_medium" | "utm_campaign", max: number) {
  try {
    return new URLSearchParams(window.location.search).get(name)?.slice(0, max) || null;
  } catch {
    return null;
  }
}

export function trackProductEvent(
  eventName: ProductEventName,
  product: ProductArea,
  properties: EventProperties = {},
) {
  if (typeof window === "undefined") return;

  const visitorId = getStoredId(window.localStorage, VISITOR_KEY);
  const sessionId = getStoredId(window.sessionStorage, SESSION_KEY);

  const payload = {
    visitorId,
    sessionId,
    eventName,
    product,
    path: window.location.pathname.slice(0, 300) || "/",
    referrerHost: getReferrerHost(),
    utmSource: getUtm("utm_source", 120),
    utmMedium: getUtm("utm_medium", 120),
    utmCampaign: getUtm("utm_campaign", 160),
    properties,
  };

  void fetch("/api/product-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
