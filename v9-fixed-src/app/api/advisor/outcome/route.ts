import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

const TASK_KEYS = new Set(["research","writing","coding","documents","image","video","study","marketing","productivity"]);
const OUTCOMES = new Set(["success","partial","failed","switched_tool","not_used"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const taskKey = typeof body?.taskKey === "string" ? body.taskKey : "";
    const toolId = typeof body?.toolId === "string" ? body.toolId : "";
    const outcome = typeof body?.outcome === "string" ? body.outcome : "";
    const source = body?.source === "troubleshooter" ? "troubleshooter" : "advisor";
    const context = body?.context && typeof body.context === "object" && !Array.isArray(body.context) ? body.context : {};

    if (!TASK_KEYS.has(taskKey) || !/^[0-9a-f-]{36}$/i.test(toolId) || !OUTCOMES.has(outcome)) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }
    if (JSON.stringify(context).length > 2500) {
      return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
    }

    const supabase = createServerSupabase();
    if (!supabase) return NextResponse.json({ ok: false, error: "service_unavailable" }, { status: 503 });

    const { error } = await supabase.from("advisor_outcomes").insert({
      task_key: taskKey,
      tool_id: toolId,
      outcome,
      source,
      context,
    });

    if (error) return NextResponse.json({ ok: false, error: "outcome_not_saved" }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
}
