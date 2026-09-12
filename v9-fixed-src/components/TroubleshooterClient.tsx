"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ThumbsDown, ThumbsUp, Wrench } from "lucide-react";
import type { AITool } from "@/lib/tool-types";
import { buildCapabilityGraph, diagnoseFailure, FAILURE_OPTIONS, type FailureKey } from "@/lib/advisor-knowledge";
import { trackProductEvent } from "@/lib/product-analytics";
import styles from "@/components/Troubleshooter.module.css";

export default function TroubleshooterClient({ tools }: { tools: AITool[] }) {
  const [toolId, setToolId] = useState(tools[0]?.id || "");
  const [failure, setFailure] = useState<FailureKey>("file_failure");
  const [feedback, setFeedback] = useState<"helpful" | "unhelpful" | null>(null);

  const tool = useMemo(() => tools.find((item) => item.id === toolId) || tools[0], [tools, toolId]);
  const capabilities = useMemo(() => tool ? buildCapabilityGraph(tool).slice(0, 6) : [], [tool]);
  const diagnosis = useMemo(() => tool ? diagnoseFailure(tool, failure) : null, [tool, failure]);

  const trackDiagnosis = (nextToolId: string, nextFailure: FailureKey) => {
    const selected = tools.find((item) => item.id === nextToolId) || tools[0];
    if (!selected) return;
    setFeedback(null);
    trackProductEvent("troubleshooter_diagnosis", "troubleshooter", {
      tool_slug: selected.slug,
      failure_key: nextFailure,
    });
  };

  const sendFeedback = (helpful: boolean) => {
    if (feedback || !tool || !diagnosis) return;
    setFeedback(helpful ? "helpful" : "unhelpful");
    trackProductEvent(
      helpful ? "troubleshooter_feedback_helpful" : "troubleshooter_feedback_unhelpful",
      "troubleshooter",
      { tool_slug: tool.slug, failure_key: failure, confidence: diagnosis.confidence },
    );
  };

  const nextStep = (destination: string) => {
    trackProductEvent("troubleshooter_next_step", "troubleshooter", {
      tool_slug: tool?.slug || "unknown",
      failure_key: failure,
      destination,
    });
  };

  if (!tool || !diagnosis) return <div className={styles.output}>Belum ada tool published untuk dianalisis.</div>;

  return (
    <div className={styles.shell}>
      <section className={styles.panel}>
        <span className={styles.eyebrow}><Wrench size={13} /> FAILURE INTELLIGENCE</span>
        <h2>Apa yang gagal?</h2>

        <div className={styles.field}>
          <label htmlFor="tool">Tool AI</label>
          <select id="tool" value={tool.id} onChange={(event) => { setToolId(event.target.value); trackDiagnosis(event.target.value, failure); }}>
            {tools.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="failure">Jenis masalah</label>
          <select id="failure" value={failure} onChange={(event) => { const next = event.target.value as FailureKey; setFailure(next); trackDiagnosis(tool.id, next); }}>
            {FAILURE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>

        <span className={styles.eyebrow}>CAPABILITY GRAPH</span>
        <div className={styles.capGrid}>
          {capabilities.map((capability) => (
            <div className={styles.cap} key={capability.key}>
              <span>{capability.label}</span>
              <strong>{capability.score}/100</strong>
              <div className={styles.bar}><i style={{ width: `${capability.score}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.output} aria-live="polite">
        <div className={styles.outputHead}>
          <div>
            <span className={styles.eyebrow}>DIAGNOSIS</span>
            <h2>{diagnosis.title}</h2>
            <p>Diagnosis untuk <strong>{tool.name}</strong> berdasarkan taxonomy kegagalan dan profil tool AIUpdateId.</p>
          </div>
          <div className={styles.confidence}><strong>{diagnosis.confidence}%</strong><span>CONFIDENCE</span></div>
        </div>

        <div className={styles.grid}>
          <article className={styles.box}><h3>Kemungkinan penyebab</h3><ul>{diagnosis.likelyCauses.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className={styles.box}><h3>Cara mengecek</h3><ul>{diagnosis.checks.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className={styles.box}><h3>Langkah perbaikan</h3><ul>{diagnosis.actions.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className={styles.box}><h3>Catatan khusus tool</h3><ul>{diagnosis.toolCautions.length ? diagnosis.toolCautions.map((item) => <li key={item}>{item}</li>) : <li>Belum ada limitation spesifik yang tercatat pada profil ini.</li>}</ul></article>
        </div>

        <div className={styles.warning}>Confidence bukan jaminan diagnosis benar. Fitur AI berubah cepat; cek halaman resmi jika masalah menyangkut paket, limit, atau dukungan format terbaru.</div>
        <div className={styles.feedbackBar}>
          <strong>{feedback ? "Terima kasih. Feedback tersimpan sebagai sinyal kualitas." : "Apakah diagnosis ini membantu menyelesaikan masalah?"}</strong>
          <div>
            <button type="button" disabled={Boolean(feedback)} onClick={() => sendFeedback(true)}><ThumbsUp size={14}/> Membantu</button>
            <button type="button" disabled={Boolean(feedback)} onClick={() => sendFeedback(false)}><ThumbsDown size={14}/> Belum</button>
          </div>
        </div>
        <div className={styles.links}>
          <Link href={`/tools/${tool.slug}`} onClick={() => nextStep("tool_profile")}>Buka profil {tool.name} <ArrowRight size={14} /></Link>
          <Link href="/advisor" onClick={() => nextStep("advisor")}>Cari alternatif AI <ArrowRight size={14} /></Link>
          <Link href="/workflow" onClick={() => nextStep("workflow")}>Perbaiki prompt/workflow <ArrowRight size={14} /></Link>
        </div>
      </section>
    </div>
  );
}
