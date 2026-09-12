import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

const TASK_KEYS = new Set(["research","writing","coding","documents","image","video","study","marketing","productivity"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const taskKey = typeof body?.taskKey === "string" ? body.taskKey : "";
    const toolId = typeof body?.toolId === "string" ? body.toolId : "";
    const helpful = body?.helpful;
    const taskProfile = body?.taskProfile && typeof body.taskProfile === "object" && !Array.isArray(body.taskProfile) ? body.taskProfile : {};

    if (!TASK_KEYS.has(taskKey) || !/^[0-9a-f-]{36}$/i.test(toolId) || typeof helpful !== "boolean") {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const serialized = JSON.stringify(taskProfile);
    if (serialized.length > 2000) {
      return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
    }

    const supabase = createServerSupabase();
    if (!supabase) return NextResponse.json({ ok: false, error: "service_unavailable" }, { status: 503 });

    const { error } = await supabase.from("advisor_feedback").insert({
      task_key: taskKey,
      tool_id: toolId,
      helpful,
      task_profile: taskProfile,
    });

    if (error) return NextResponse.json({ ok: false, error: "feedback_not_saved" }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
}
