import type { AITool } from "@/lib/tool-types";

export type CapabilityKey =
  | "web_research" | "citations" | "documents" | "spreadsheets" | "writing"
  | "coding" | "image" | "video" | "indonesian" | "free_access";

export type FailureKey =
  | "file_failure" | "citation_failure" | "hallucination" | "context_loss"
  | "format_failure" | "instruction_failure" | "quality_failure" | "feature_limit";

export type CapabilitySignal = {
  key: CapabilityKey;
  label: string;
  score: number;
  evidence: string[];
};

export type DiagnosticResult = {
  failure: FailureKey;
  title: string;
  likelyCauses: string[];
  checks: string[];
  actions: string[];
  toolCautions: string[];
  confidence: number;
};

const CAPABILITIES: Record<CapabilityKey, { label: string; terms: string[] }> = {
  web_research: { label: "Riset web", terms: ["web", "search", "research", "riset", "internet"] },
  citations: { label: "Sumber & sitasi", terms: ["source", "citation", "sitasi", "referensi", "reference"] },
  documents: { label: "Dokumen & PDF", terms: ["document", "dokumen", "pdf", "file", "upload", "notebook"] },
  spreadsheets: { label: "Spreadsheet", terms: ["spreadsheet", "excel", "xlsx", "csv", "sheet"] },
  writing: { label: "Menulis", terms: ["writing", "writer", "artikel", "copy", "content", "editing"] },
  coding: { label: "Coding", terms: ["coding", "code", "programming", "developer", "debug", "software"] },
  image: { label: "Gambar", terms: ["image", "gambar", "photo", "foto", "design", "visual"] },
  video: { label: "Video", terms: ["video", "animation", "animasi", "shorts", "film"] },
  indonesian: { label: "Indonesia", terms: ["indonesia", "bahasa indonesia", "indonesian"] },
  free_access: { label: "Akses gratis", terms: ["free", "gratis", "free plan"] },
};

const FAILURE_MAP: Record<FailureKey, Omit<DiagnosticResult, "failure" | "toolCautions" | "confidence">> = {
  file_failure: {
    title: "File gagal dibaca atau diunggah",
    likelyCauses: ["Format file tidak didukung penuh.", "Ukuran atau struktur file terlalu kompleks.", "Fitur upload berbeda menurut paket atau mode produk."],
    checks: ["Cek format dan ukuran file.", "Uji dengan file kecil yang lebih sederhana.", "Pastikan fitur upload tersedia pada akun/mode yang dipakai."],
    actions: ["Konversi ke format yang lebih umum seperti PDF, CSV, atau teks bila sesuai.", "Pecah file besar menjadi bagian lebih kecil.", "Gunakan tool alternatif yang profilnya kuat untuk dokumen."],
  },
  citation_failure: {
    title: "Sitasi atau sumber tidak cocok",
    likelyCauses: ["Jawaban tidak benar-benar grounded pada sumber.", "Sumber berubah atau halaman tidak lagi sama.", "Model mencampur ringkasan dengan inferensi."],
    checks: ["Buka sumber asli dan cocokkan klaim inti.", "Periksa apakah tautan mengarah ke bagian yang relevan.", "Pisahkan fakta sumber dari interpretasi model."],
    actions: ["Minta kutipan hanya dari sumber yang diberikan.", "Verifikasi klaim penting secara manual.", "Gunakan workflow riset dengan tahap fact-check terpisah."],
  },
  hallucination: {
    title: "Jawaban tampak meyakinkan tetapi tidak akurat",
    likelyCauses: ["Model mengisi celah informasi dengan prediksi.", "Instruksi meminta kepastian saat bukti kurang.", "Konteks atau sumber terlalu sedikit."],
    checks: ["Tandai klaim yang bisa diverifikasi.", "Bandingkan dengan sumber primer.", "Cek apakah model menyebut ketidakpastian."],
    actions: ["Minta model menyatakan mana fakta, inferensi, dan ketidakpastian.", "Tambahkan sumber primer.", "Jangan gunakan jawaban tanpa verifikasi untuk klaim penting."],
  },
  context_loss: {
    title: "AI kehilangan konteks atau melupakan instruksi",
    likelyCauses: ["Percakapan atau dokumen terlalu panjang.", "Instruksi penting tersebar di banyak pesan.", "Konteks baru bertentangan dengan instruksi awal."],
    checks: ["Ringkas tujuan dan batasan inti.", "Cek apakah masalah muncul setelah percakapan panjang.", "Uji prompt baru dengan konteks minimum yang cukup."],
    actions: ["Gunakan brief terstruktur di awal.", "Pecah pekerjaan menjadi beberapa tahap.", "Ulangi constraint penting pada tahap final."],
  },
  format_failure: {
    title: "Output tidak mengikuti format",
    likelyCauses: ["Format output ambigu.", "Terlalu banyak aturan sekaligus.", "Contoh output tidak diberikan."],
    checks: ["Pastikan format akhir disebut eksplisit.", "Cek apakah ada aturan yang bertentangan.", "Uji dengan schema/contoh pendek."],
    actions: ["Berikan struktur output yang jelas.", "Pisahkan requirement wajib dan opsional.", "Minta self-check sebelum jawaban final."],
  },
  instruction_failure: {
    title: "AI tidak mengikuti instruksi",
    likelyCauses: ["Tujuan terlalu luas.", "Prioritas antar-instruksi tidak jelas.", "Constraint tersembunyi di paragraf panjang."],
    checks: ["Identifikasi satu tujuan utama.", "Pisahkan input, tugas, batasan, dan format.", "Hilangkan instruksi yang saling bertentangan."],
    actions: ["Gunakan Prompt Quality Check AIUpdateId.", "Susun prompt menjadi bagian Tujuan/Konteks/Batasan/Output.", "Kerjakan tugas kompleks secara bertahap."],
  },
  quality_failure: {
    title: "Hasil benar tetapi kualitasnya rendah",
    likelyCauses: ["Kriteria kualitas tidak didefinisikan.", "Contoh atau konteks domain kurang.", "Tool kurang cocok untuk tahap pekerjaan tersebut."],
    checks: ["Tentukan seperti apa hasil yang dianggap bagus.", "Bandingkan output dengan contoh referensi.", "Cek apakah tool lain lebih cocok untuk tahap ini."],
    actions: ["Tambahkan quality criteria eksplisit.", "Gunakan evaluator/revisi sebagai tahap kedua.", "Pertimbangkan workflow multi-AI untuk pekerjaan kompleks."],
  },
  feature_limit: {
    title: "Terbentur batas fitur atau paket",
    likelyCauses: ["Fitur hanya tersedia pada paket tertentu.", "Batas penggunaan berubah.", "Fitur belum tersedia pada platform/region tertentu."],
    checks: ["Periksa halaman resmi fitur dan paket.", "Cek platform yang digunakan.", "Periksa tanggal review profil AIUpdateId."],
    actions: ["Gunakan fitur alternatif yang setara.", "Bandingkan Value Score sebelum upgrade.", "Pilih tool alternatif jika fitur tersebut wajib."],
  },
};

function toolText(tool: AITool) {
  return [tool.name, tool.provider, tool.category, tool.short_description, tool.description,
    ...(tool.tags || []), ...(tool.best_for || []), ...(tool.key_features || []), ...(tool.pros || []), ...(tool.cons || [])]
    .filter(Boolean).join(" ").toLowerCase();
}

export function buildCapabilityGraph(tool: AITool): CapabilitySignal[] {
  const text = toolText(tool);
  return (Object.entries(CAPABILITIES) as Array<[CapabilityKey, typeof CAPABILITIES[CapabilityKey]]>)
    .map(([key, meta]) => {
      const hits = meta.terms.filter(term => text.includes(term));
      let score = Math.min(100, 32 + hits.length * 18);
      if (key === "indonesian" && Number(tool.indonesia_score) > 0) score = Math.max(score, Math.min(100, Number(tool.indonesia_score) <= 10 ? Number(tool.indonesia_score) * 10 : Number(tool.indonesia_score)));
      if (key === "free_access") score = tool.has_free_plan ? 100 : 25;
      return { key, label: meta.label, score: hits.length || key === "free_access" || key === "indonesian" ? score : 20, evidence: hits };
    })
    .sort((a, b) => b.score - a.score);
}

export function diagnoseFailure(tool: AITool, failure: FailureKey): DiagnosticResult {
  const base = FAILURE_MAP[failure];
  const cautions = (tool.cons || []).slice(0, 3);
  const reviewed = tool.last_reviewed_at ? new Date(tool.last_reviewed_at).getTime() : NaN;
  const age = Number.isFinite(reviewed) ? (Date.now() - reviewed) / 86_400_000 : 999;
  const freshness = age <= 30 ? 96 : age <= 90 ? 82 : age <= 180 ? 68 : 52;
  const profileDepth = Math.min(100, ((tool.cons?.length || 0) + (tool.key_features?.length || 0) + (tool.best_for?.length || 0)) * 10 + 35);
  const confidence = Math.round(freshness * 0.6 + profileDepth * 0.4);
  return { failure, ...base, toolCautions: cautions, confidence: Math.min(96, confidence) };
}

export const FAILURE_OPTIONS: Array<{ value: FailureKey; label: string }> = [
  { value: "file_failure", label: "File gagal dibaca / upload" },
  { value: "citation_failure", label: "Sitasi atau sumber salah" },
  { value: "hallucination", label: "Jawaban tidak akurat" },
  { value: "context_loss", label: "AI kehilangan konteks" },
  { value: "format_failure", label: "Format output salah" },
  { value: "instruction_failure", label: "Instruksi tidak diikuti" },
  { value: "quality_failure", label: "Kualitas hasil rendah" },
  { value: "feature_limit", label: "Terbentur batas fitur/paket" },
];
