import type { AITool } from "@/lib/tool-types";

export type AdvisorTaskKey =
  | "research"
  | "writing"
  | "coding"
  | "documents"
  | "image"
  | "video"
  | "study"
  | "marketing"
  | "productivity";

export type AdvisorPriorities = {
  freePlan: boolean;
  easyToUse: boolean;
  indonesian: boolean;
  evidence: boolean;
  documentHeavy: boolean;
};

export type AdvisorInput = {
  task: AdvisorTaskKey;
  priorities: AdvisorPriorities;
};

export type AdvisorRecommendation = {
  tool: AITool;
  fitScore: number;
  confidence: number;
  reasons: string[];
  cautions: string[];
};

const TASK_LABELS: Record<AdvisorTaskKey, string> = {
  research: "riset berbasis sumber",
  writing: "menulis dan menyunting",
  coding: "coding dan debugging",
  documents: "menganalisis dokumen",
  image: "membuat atau mengolah gambar",
  video: "membuat atau mengolah video",
  study: "belajar dan memahami materi",
  marketing: "marketing dan konten bisnis",
  productivity: "produktivitas dan pekerjaan harian",
};

const TASK_KEYWORDS: Record<AdvisorTaskKey, string[]> = {
  research: ["research", "riset", "source", "sumber", "citation", "sitasi", "search", "web", "referensi"],
  writing: ["writing", "writer", "menulis", "artikel", "copy", "content", "konten", "rewrite", "editing"],
  coding: ["code", "coding", "programming", "developer", "debug", "software", "github", "terminal"],
  documents: ["document", "dokumen", "pdf", "file", "spreadsheet", "excel", "source-grounded", "notebook"],
  image: ["image", "gambar", "photo", "foto", "design", "desain", "illustration", "visual"],
  video: ["video", "animation", "animasi", "veo", "shorts", "editing", "film"],
  study: ["study", "belajar", "student", "mahasiswa", "education", "pendidikan", "quiz", "materi"],
  marketing: ["marketing", "seo", "ads", "iklan", "social media", "campaign", "brand", "sales"],
  productivity: ["productivity", "produktivitas", "office", "workflow", "meeting", "email", "calendar", "automation"],
};

const normalizeScore = (value: number | null | undefined, fallback = 70) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (n <= 10) return Math.max(0, Math.min(100, n * 10));
  return Math.max(0, Math.min(100, n));
};

function haystack(tool: AITool) {
  return [
    tool.name,
    tool.provider,
    tool.category,
    tool.short_description,
    tool.description,
    ...(tool.tags || []),
    ...(tool.best_for || []),
    ...(tool.key_features || []),
    ...(tool.pros || []),
    ...(tool.cons || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function keywordMatch(text: string, keywords: string[]) {
  const hits = keywords.filter((keyword) => text.includes(keyword));
  return { score: Math.min(100, hits.length * 22 + (hits.length ? 34 : 0)), hits };
}

function freshnessConfidence(tool: AITool) {
  if (!tool.last_reviewed_at) return 55;
  const reviewed = new Date(tool.last_reviewed_at).getTime();
  if (!Number.isFinite(reviewed)) return 55;
  const ageDays = Math.max(0, (Date.now() - reviewed) / 86_400_000);
  if (ageDays <= 30) return 96;
  if (ageDays <= 60) return 86;
  if (ageDays <= 120) return 72;
  return 58;
}

export function scoreTool(tool: AITool, input: AdvisorInput): AdvisorRecommendation {
  const text = haystack(tool);
  const taskMatch = keywordMatch(text, TASK_KEYWORDS[input.task]);
  const evidenceMatch = keywordMatch(text, ["source", "sumber", "citation", "sitasi", "reference", "referensi", "research", "riset"]);
  const documentMatch = keywordMatch(text, ["document", "dokumen", "pdf", "file", "spreadsheet", "excel", "upload"]);

  const ease = normalizeScore(tool.ease_score);
  const features = normalizeScore(tool.feature_score);
  const value = normalizeScore(tool.value_score);
  const indonesia = normalizeScore(tool.indonesia_score, 65);
  const free = tool.has_free_plan ? 100 : 42;

  const weights = {
    task: 0.42,
    features: 0.17,
    ease: input.priorities.easyToUse ? 0.14 : 0.08,
    value: input.priorities.freePlan ? 0.12 : 0.08,
    indonesia: input.priorities.indonesian ? 0.12 : 0.06,
    free: input.priorities.freePlan ? 0.12 : 0.04,
    evidence: input.priorities.evidence ? 0.12 : 0,
    documents: input.priorities.documentHeavy ? 0.12 : 0,
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const raw =
    taskMatch.score * weights.task +
    features * weights.features +
    ease * weights.ease +
    value * weights.value +
    indonesia * weights.indonesia +
    free * weights.free +
    evidenceMatch.score * weights.evidence +
    documentMatch.score * weights.documents;

  let fitScore = Math.round(raw / totalWeight);
  if (taskMatch.hits.length === 0) fitScore = Math.min(fitScore, 67);
  if (input.priorities.freePlan && !tool.has_free_plan) fitScore -= 8;
  fitScore = Math.max(0, Math.min(100, fitScore));

  const completeness = [tool.best_for?.length, tool.key_features?.length, tool.pros?.length, tool.cons?.length, tool.last_reviewed_at]
    .filter(Boolean).length;
  const confidence = Math.round(Math.min(98, freshnessConfidence(tool) * 0.72 + (completeness / 5) * 28));

  const reasons: string[] = [];
  if (taskMatch.hits.length) reasons.push(`Data AIUpdateId menunjukkan kecocokan dengan ${TASK_LABELS[input.task]}.`);
  if (features >= 80) reasons.push("Skor fitur AIUpdateId berada di level kuat untuk kategori ini.");
  if (input.priorities.easyToUse && ease >= 80) reasons.push("Kemudahan penggunaan sesuai prioritas Anda.");
  if (input.priorities.indonesian && indonesia >= 80) reasons.push("Dukungan/kecocokan untuk pengguna Indonesia dinilai kuat.");
  if (input.priorities.freePlan && tool.has_free_plan) reasons.push("Memiliki opsi gratis menurut data AIUpdateId saat ini.");
  if (input.priorities.evidence && evidenceMatch.hits.length) reasons.push("Profil tool memiliki sinyal kuat untuk riset, sumber, atau referensi.");
  if (input.priorities.documentHeavy && documentMatch.hits.length) reasons.push("Profil tool memiliki sinyal dukungan dokumen/file.");
  if (!reasons.length) reasons.push("Masuk kandidat berdasarkan skor gabungan fitur, nilai, kemudahan, dan profil penggunaan.");

  const cautions = (tool.cons || []).slice(0, 2);
  if (!tool.last_reviewed_at) cautions.push("Data tool ini belum memiliki tanggal review terbaru; verifikasi fitur penting sebelum berlangganan.");
  if (!tool.has_free_plan && input.priorities.freePlan) cautions.push("Prioritas Anda adalah opsi gratis, sementara tool ini tidak tercatat memiliki paket gratis.");

  return { tool, fitScore, confidence, reasons: reasons.slice(0, 4), cautions: cautions.slice(0, 3) };
}

export function rankTools(tools: AITool[], input: AdvisorInput, limit = 5) {
  return tools
    .map((tool) => scoreTool(tool, input))
    .sort((a, b) => b.fitScore - a.fitScore || b.confidence - a.confidence)
    .slice(0, limit);
}
