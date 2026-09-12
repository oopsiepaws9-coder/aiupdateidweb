"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import type { AITool } from "@/lib/tool-types";
import { rankTools, type AdvisorInput, type AdvisorTaskKey } from "@/lib/advisor-engine";
import styles from "@/components/Advisor.module.css";

const TASKS: Array<{ value: AdvisorTaskKey; label: string; helper: string }> = [
  { value: "research", label: "Riset & sumber", helper: "Cari informasi, referensi, dan jawaban yang perlu diverifikasi." },
  { value: "documents", label: "Dokumen & PDF", helper: "Baca, rangkum, bandingkan, atau tanya jawab dari file." },
  { value: "writing", label: "Menulis", helper: "Artikel, copy, editing, ide, dan drafting." },
  { value: "coding", label: "Coding", helper: "Membuat, memahami, dan memperbaiki kode." },
  { value: "study", label: "Belajar", helper: "Memahami materi, belajar dari sumber, dan latihan." },
  { value: "image", label: "Gambar", helper: "Membuat atau mengolah visual dan desain." },
  { value: "video", label: "Video", helper: "Video generatif, animasi, dan konten pendek." },
  { value: "marketing", label: "Marketing", helper: "SEO, kampanye, ide konten, dan komunikasi bisnis." },
  { value: "productivity", label: "Produktivitas", helper: "Workflow kerja, office, meeting, dan tugas harian." },
];

const defaultInput: AdvisorInput = {
  task: "research",
  priorities: { freePlan: true, easyToUse: true, indonesian: true, evidence: true, documentHeavy: false },
};

export default function AdvisorClient({ tools }: { tools: AITool[] }) {
  const [input, setInput] = useState<AdvisorInput>(defaultInput);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, boolean>>({});
  const results = useMemo(() => rankTools(tools, input, 5), [tools, input]);

  const toggle = (key: keyof AdvisorInput["priorities"]) =>
    setInput((current) => ({ ...current, priorities: { ...current.priorities, [key]: !current.priorities[key] } }));

  async function sendFeedback(toolId: string, helpful: boolean) {
    if (feedbackSent[toolId]) return;
    setFeedbackSent((current) => ({ ...current, [toolId]: true }));
    try {
      await fetch("/api/advisor/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskKey: input.task, toolId, helpful, taskProfile: input.priorities }),
      });
    } catch {
      // Feedback is optional; recommendations must remain usable if telemetry is unavailable.
    }
  }

  const activeTask = TASKS.find((task) => task.value === input.task);

  return (
    <div className={styles.shell}>
      <section className={styles.controls} aria-label="Preferensi rekomendasi AI">
        <div className={styles.controlHeader}>
          <div>
            <span className={styles.eyebrow}>1. PILIH PEKERJAAN</span>
            <h2>Apa yang ingin Anda selesaikan?</h2>
          </div>
          <Sparkles aria-hidden="true" />
        </div>

        <div className={styles.taskGrid}>
          {TASKS.map((task) => (
            <button
              key={task.value}
              type="button"
              className={input.task === task.value ? styles.taskActive : styles.task}
              onClick={() => setInput((current) => ({ ...current, task: task.value }))}
            >
              <strong>{task.label}</strong>
              <span>{task.helper}</span>
            </button>
          ))}
        </div>

        <div className={styles.priorityBlock}>
          <span className={styles.eyebrow}>2. PRIORITAS</span>
          <div className={styles.pills}>
            <button type="button" aria-pressed={input.priorities.freePlan} onClick={() => toggle("freePlan")}>Paket gratis</button>
            <button type="button" aria-pressed={input.priorities.easyToUse} onClick={() => toggle("easyToUse")}>Mudah digunakan</button>
            <button type="button" aria-pressed={input.priorities.indonesian} onClick={() => toggle("indonesian")}>Cocok untuk Indonesia</button>
            <button type="button" aria-pressed={input.priorities.evidence} onClick={() => toggle("evidence")}>Butuh sumber/referensi</button>
            <button type="button" aria-pressed={input.priorities.documentHeavy} onClick={() => toggle("documentHeavy")}>Banyak dokumen/file</button>
          </div>
        </div>

        <div className={styles.localNote}>
          <ShieldCheck size={18} aria-hidden="true" />
          <p><strong>Tanpa API AI berbayar.</strong> Fit Score dihitung oleh engine AIUpdateId dari data tools yang sudah dikurasi di database.</p>
        </div>
      </section>

      <section className={styles.results} aria-live="polite">
        <div className={styles.resultsHead}>
          <div><span className={styles.eyebrow}>HASIL AI FIT ENGINE</span><h2>Rekomendasi untuk {activeTask?.label.toLowerCase()}</h2></div>
          <span className={styles.dataBadge}>{tools.length} tool dianalisis</span>
        </div>

        {results.length === 0 ? (
          <div className={styles.empty}>Belum ada data AI tool yang bisa dihitung.</div>
        ) : results.map((result, index) => (
          <article className={index === 0 ? styles.bestCard : styles.card} key={result.tool.id}>
            <div className={styles.rank}>{index + 1}</div>
            <div className={styles.cardMain}>
              <div className={styles.titleRow}>
                <div>
                  {index === 0 && <span className={styles.bestLabel}>REKOMENDASI UTAMA</span>}
                  <h3>{result.tool.name}</h3>
                  <p>{result.tool.short_description || result.tool.description || "Profil AI tool dari database AIUpdateId."}</p>
                </div>
                <div className={styles.scoreBox}><strong>{result.fitScore}</strong><span>/100 Fit</span></div>
              </div>

              <div className={styles.confidence}>
                <span>Evidence Confidence</span>
                <div><i style={{ width: `${result.confidence}%` }} /></div>
                <b>{result.confidence}%</b>
              </div>

              <div className={styles.reasonGrid}>
                <div>
                  <h4>Kenapa cocok</h4>
                  {result.reasons.map((reason) => <p key={reason}><CheckCircle2 size={15} /> {reason}</p>)}
                </div>
                <div>
                  <h4>Perlu diperhatikan</h4>
                  {result.cautions.length ? result.cautions.map((caution) => <p key={caution}>{caution}</p>) : <p>Belum ada catatan keterbatasan khusus di profil ini.</p>}
                </div>
              </div>

              <div className={styles.actions}>
                <Link href={`/tools/${result.tool.slug}`}>Lihat profil lengkap <ChevronRight size={16} /></Link>
                <div className={styles.feedback} aria-label={`Nilai rekomendasi ${result.tool.name}`}>
                  <span>{feedbackSent[result.tool.id] ? "Terima kasih" : "Cocok?"}</span>
                  <button disabled={feedbackSent[result.tool.id]} onClick={() => sendFeedback(result.tool.id, true)} aria-label="Rekomendasi cocok"><ThumbsUp size={15} /></button>
                  <button disabled={feedbackSent[result.tool.id]} onClick={() => sendFeedback(result.tool.id, false)} aria-label="Rekomendasi tidak cocok"><ThumbsDown size={15} /></button>
                </div>
              </div>
            </div>
          </article>
        ))}

        <p className={styles.disclaimer}>Fit Score adalah skor kecocokan untuk kebutuhan yang dipilih, bukan klaim bahwa satu AI selalu lebih baik. Fitur dan harga AI dapat berubah; periksa profil dan sumber terbaru sebelum membeli.</p>
      </section>
    </div>
  );
}
