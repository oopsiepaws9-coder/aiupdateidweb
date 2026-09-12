"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clipboard, Copy, FileCheck2, Sparkles, TriangleAlert } from "lucide-react";

type Goal = "Artikel edukatif" | "Skrip video pendek" | "Carousel media sosial" | "Rencana konten";

const goals: Goal[] = ["Artikel edukatif", "Skrip video pendek", "Carousel media sosial", "Rencana konten"];

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export default function WorkflowCheckClient() {
  const [goal, setGoal] = useState<Goal>("Artikel edukatif");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [context, setContext] = useState("");
  const [format, setFormat] = useState("");
  const [boundaries, setBoundaries] = useState("");
  const [copied, setCopied] = useState(false);

  const checks = useMemo(() => [
    { label: "Tujuan", done: Boolean(goal) },
    { label: "Topik", done: Boolean(clean(topic)) },
    { label: "Audiens", done: Boolean(clean(audience)) },
    { label: "Konteks/bahan", done: Boolean(clean(context)) },
    { label: "Format hasil", done: Boolean(clean(format)) },
    { label: "Batasan", done: Boolean(clean(boundaries)) },
  ], [goal, topic, audience, context, format, boundaries]);

  const score = Math.round((checks.filter((item) => item.done).length / checks.length) * 100);
  const missing = checks.filter((item) => !item.done).map((item) => item.label);

  const prompt = useMemo(() => {
    const task = clean(topic) || "[TOPIK]";
    const reader = clean(audience) || "[AUDIENS]";
    const details = clean(context) || "[KONTEKS, PRODUK, BUKTI, ATAU BAHAN YANG HARUS DIPAKAI]";
    const output = clean(format) || "[FORMAT HASIL DAN PANJANG YANG DIINGINKAN]";
    const limits = clean(boundaries) || "[BATASAN KLAIM, NADA, DAN HAL YANG HARUS DIHINDARI]";

    return `Bantu saya membuat ${goal.toLowerCase()} tentang ${task}.\n\nAudiens utama: ${reader}\nKonteks/bahan yang wajib dipakai: ${details}\nFormat hasil: ${output}\nBatasan: ${limits}\n\nCara kerja:\n1. Jika informasi penting belum cukup, ajukan maksimal 3 pertanyaan klarifikasi terlebih dahulu.\n2. Buat rancangan singkat yang menunjukkan sudut utama dan urutan isi.\n3. Buat hasil sesuai format yang diminta dengan bahasa Indonesia yang jelas dan natural.\n4. Jangan membuat klaim, data, kutipan, atau sumber yang tidak tersedia. Tandai bagian yang harus saya verifikasi.\n5. Setelah selesai, lakukan pengecekan singkat: kecocokan audiens, kejelasan CTA, pengulangan, dan risiko klaim berlebihan.`;
  }, [goal, topic, audience, context, format, boundaries]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="workflowTool">
      <div className="workflowForm">
        <div className="workflowFormHead">
          <div>
            <span><Sparkles size={15} /> PROMPT QUALITY CHECK</span>
            <h2>Mulai dari brief yang lengkap.</h2>
          </div>
          <div className={`workflowScore ${score >= 84 ? "strong" : score >= 50 ? "mid" : "low"}`} aria-label={`Kelengkapan brief ${score} persen`}>
            <b>{score}</b><small>/100</small>
          </div>
        </div>

        <label>Tujuan pekerjaan<select value={goal} onChange={(event) => setGoal(event.target.value as Goal)}>{goals.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Topik atau masalah yang ingin diselesaikan<textarea value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Contoh: menjelaskan kapan UMKM sebaiknya memakai AI untuk membuat konten" rows={3} /></label>
        <div className="workflowTwoCols">
          <label>Audiens utama<input value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Contoh: pemilik UMKM pemula" /></label>
          <label>Format hasil<input value={format} onChange={(event) => setFormat(event.target.value)} placeholder="Contoh: 5 carousel, 7 slide" /></label>
        </div>
        <label>Konteks, bahan, atau bukti yang wajib dipakai<textarea value={context} onChange={(event) => setContext(event.target.value)} placeholder="Contoh: produk, pengalaman, link sumber, data, gaya merek, atau poin yang tidak boleh hilang" rows={3} /></label>
        <label>Batasan dan hal yang harus dihindari<textarea value={boundaries} onChange={(event) => setBoundaries(event.target.value)} placeholder="Contoh: jangan menjanjikan hasil pasti, hindari jargon, gunakan nada profesional dan hangat" rows={3} /></label>

        <div className="workflowCheckList" aria-live="polite">
          {checks.map((item) => <span className={item.done ? "done" : ""} key={item.label}>{item.done ? <CheckCircle2 size={15} /> : <span className="workflowEmptyDot" />} {item.label}</span>)}
        </div>
      </div>

      <aside className="workflowOutput">
        <div className="workflowOutputHead">
          <div><FileCheck2 size={18} /><div><small>HASIL DIAGNOSIS</small><h3>{score >= 84 ? "Brief sudah cukup kuat" : score >= 50 ? "Brief mulai jelas, tetapi belum lengkap" : "Brief masih terlalu luas"}</h3></div></div>
          <button onClick={copy} type="button">{copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}{copied ? "Tersalin" : "Salin prompt"}</button>
        </div>
        <p className="workflowDiagnosis">{missing.length ? `Tambahkan: ${missing.join(", ")}. Semakin lengkap brief, semakin kecil risiko AI mengisi detail dengan asumsi.` : "Semua unsur utama sudah tersedia. Tetap periksa fakta, sumber, dan kecocokan hasil sebelum dipublikasikan."}</p>
        <pre>{prompt}</pre>
        <p className="workflowNote"><TriangleAlert size={15} /> Skor ini mengukur kelengkapan brief, bukan akurasi fakta atau jaminan kualitas output AI.</p>
      </aside>
    </div>
  );
}
