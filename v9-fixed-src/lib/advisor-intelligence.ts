import type { AITool } from "@/lib/tool-types";
import type { AdvisorInput, AdvisorTaskKey } from "@/lib/advisor-engine";

export type IntelligenceProfile = AdvisorInput & {
  mode: "balanced" | "quality" | "budget" | "simple";
};

export type IntelligenceScore = {
  tool: AITool;
  fit: number;
  value: number;
  ease: number;
  indonesia: number;
  evidence: number;
  freshness: number;
  risk: number;
  total: number;
  tradeoffs: string[];
};

export const TASK_GRAPH: Record<AdvisorTaskKey, string[]> = {
  research: ["menentukan pertanyaan", "mencari sumber", "membandingkan bukti", "menyusun temuan", "verifikasi"],
  writing: ["brief", "riset", "outline", "draft", "editing", "quality check"],
  coding: ["memahami kebutuhan", "implementasi", "debug", "test", "review"],
  documents: ["unggah sumber", "ekstraksi", "analisis", "cross-check", "ringkasan"],
  image: ["brief visual", "referensi", "generasi", "seleksi", "refinement"],
  video: ["konsep", "skrip", "storyboard", "asset", "generasi", "editing"],
  study: ["tujuan belajar", "sumber", "penjelasan", "latihan", "review"],
  marketing: ["tujuan", "audiens", "riset", "produksi", "distribusi", "evaluasi"],
  productivity: ["identifikasi tugas", "prioritas", "workflow", "eksekusi", "review"],
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const score = (n: unknown, fallback = 65) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return clamp(v <= 10 ? v * 10 : v);
};

function freshness(tool: AITool) {
  if (!tool.last_reviewed_at) return 45;
  const age = (Date.now() - new Date(tool.last_reviewed_at).getTime()) / 86400000;
  if (!Number.isFinite(age)) return 45;
  if (age <= 30) return 100;
  if (age <= 60) return 88;
  if (age <= 120) return 72;
  return 52;
}

function text(tool: AITool) {
  return [tool.name, tool.category, tool.short_description, tool.description, ...(tool.best_for || []), ...(tool.key_features || []), ...(tool.pros || []), ...(tool.cons || [])].filter(Boolean).join(" ").toLowerCase();
}

const taskWords: Record<AdvisorTaskKey, string[]> = {
  research: ["research", "riset", "source", "citation", "search", "referensi"], writing: ["writing", "menulis", "artikel", "copy", "content"],
  coding: ["code", "coding", "developer", "debug", "programming"], documents: ["document", "dokumen", "pdf", "file", "spreadsheet", "excel"],
  image: ["image", "gambar", "photo", "design", "visual"], video: ["video", "animation", "animasi", "film"],
  study: ["study", "belajar", "education", "materi"], marketing: ["marketing", "seo", "campaign", "brand", "sales"],
  productivity: ["productivity", "workflow", "office", "meeting", "email", "automation"],
};

function taskFit(tool: AITool, task: AdvisorTaskKey) {
  const hay = text(tool);
  const hits = taskWords[task].filter(w => hay.includes(w)).length;
  return clamp(38 + hits * 15 + score(tool.feature_score) * .25);
}

export function intelligenceScore(tool: AITool, profile: IntelligenceProfile): IntelligenceScore {
  const fit = taskFit(tool, profile.task);
  const value = score(tool.value_score);
  const ease = score(tool.ease_score);
  const indonesia = score(tool.indonesia_score, 60);
  const fresh = freshness(tool);
  const completeness = [tool.best_for?.length, tool.key_features?.length, tool.pros?.length, tool.cons?.length, tool.last_reviewed_at].filter(Boolean).length;
  const evidence = clamp(fresh * .65 + (completeness / 5) * 35);
  const cons = tool.cons?.length || 0;
  const risk = clamp(22 + cons * 9 + (fresh < 60 ? 18 : 0) + (evidence < 60 ? 12 : 0));
  const free = tool.has_free_plan ? 100 : 35;

  const modes = {
    balanced: { fit:.38, value:.16, ease:.12, indonesia:.10, evidence:.14, fresh:.10, free:0 },
    quality: { fit:.48, value:.06, ease:.06, indonesia:.08, evidence:.20, fresh:.12, free:0 },
    budget: { fit:.30, value:.22, ease:.10, indonesia:.08, evidence:.10, fresh:.08, free:.12 },
    simple: { fit:.32, value:.12, ease:.28, indonesia:.10, evidence:.10, fresh:.08, free:0 },
  }[profile.mode];

  let total = fit*modes.fit + value*modes.value + ease*modes.ease + indonesia*modes.indonesia + evidence*modes.evidence + fresh*modes.fresh + free*modes.free;
  total -= risk * .07;
  if (profile.priorities.freePlan && !tool.has_free_plan) total -= 8;
  if (profile.priorities.indonesian) total += (indonesia - 50) * .05;
  if (profile.priorities.easyToUse) total += (ease - 50) * .04;

  const tradeoffs: string[] = [];
  if (!tool.has_free_plan) tradeoffs.push("Tidak tercatat memiliki paket gratis.");
  if (fresh < 60) tradeoffs.push("Data perlu diverifikasi ulang karena review tidak lagi segar.");
  if (evidence < 65) tradeoffs.push("Confidence bukti masih terbatas.");
  if (risk >= 55) tradeoffs.push("Ada beberapa keterbatasan yang perlu diperiksa sebelum memilih.");
  return { tool, fit, value, ease, indonesia, evidence, freshness:fresh, risk, total:clamp(total), tradeoffs:tradeoffs.slice(0,3) };
}

export function rankIntelligence(tools: AITool[], profile: IntelligenceProfile, limit=5) {
  return tools.map(t => intelligenceScore(t, profile)).sort((a,b)=>b.total-a.total || b.evidence-a.evidence).slice(0,limit);
}

export function buildWorkflow(task: AdvisorTaskKey, ranked: IntelligenceScore[]) {
  const stages = TASK_GRAPH[task];
  if (!ranked.length) return [];
  return stages.map((stage, i) => ({ stage, tool: ranked[Math.min(i % Math.min(3, ranked.length), ranked.length-1)].tool.name }));
}
