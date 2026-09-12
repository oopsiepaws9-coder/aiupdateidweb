import type { Metadata } from "next";
import { BrainCircuit, CheckCircle2, Database, ShieldCheck, Sparkles } from "lucide-react";
import AdvisorClient from "@/components/AdvisorClient";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";
import type { AITool } from "@/lib/tool-types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI Advisor: Temukan AI yang Cocok untuk Kebutuhan Anda",
  description: "Gunakan AI Fit Engine AIUpdateId untuk membandingkan tool AI berdasarkan pekerjaan, budget, kemudahan, dukungan Indonesia, sumber, dan dokumen—tanpa API AI berbayar.",
  alternates: { canonical: "/advisor" },
  openGraph: {
    title: "AIUpdateId Advisor — Cari AI yang Cocok untuk Pekerjaan Anda",
    description: "Bukan ranking AI universal. Dapatkan rekomendasi berdasarkan kebutuhan dan data tool yang dikurasi AIUpdateId.",
    type: "website",
    url: "/advisor",
  },
};

export default async function AdvisorPage() {
  const supabase = createServerSupabase();
  let tools: AITool[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("ai_tools")
      .select("*")
      .eq("status", "published")
      .order("last_reviewed_at", { ascending: false, nullsFirst: false })
      .order("rating", { ascending: false });
    tools = (data || []) as AITool[];
  }

  const base = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AIUpdateId Advisor",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: `${base}/advisor`,
    inLanguage: "id-ID",
    isAccessibleForFree: true,
    description: "Mesin rekomendasi AI berbasis kebutuhan dan data editorial AIUpdateId.",
  };

  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="workflowHero">
        <div className="container workflowHeroGrid">
          <div>
            <span className="workflowEyebrow"><BrainCircuit size={17} /> AIUPDATEID ADVISOR — BETA</span>
            <h1>Jangan cari AI terbaik. Cari AI yang tepat untuk pekerjaan Anda.</h1>
            <p>AI Fit Engine membandingkan tool berdasarkan kebutuhan yang Anda pilih. Ranking dihitung oleh engine AIUpdateId dari database sendiri—bukan jawaban acak chatbot dan bukan ranking sponsor.</p>
            <div className="workflowTrust">
              <span><CheckCircle2 size={16} /> Tanpa API AI berbayar</span>
              <span><Database size={16} /> Data AIUpdateId</span>
              <span><ShieldCheck size={16} /> Ranking bukan sponsor</span>
            </div>
          </div>
          <aside className="workflowHeroCard">
            <small>AI DECISION ENGINE V4</small>
            <h2>Kebutuhan → ranking multi-objective → workflow → outcome → pembelajaran terkontrol.</h2>
            <div className="workflowArrow">↓</div>
            <p>Outcome tidak langsung mengubah ranking. Sistem memakai minimum sampel, shrinkage, dan batas penyesuaian agar sinyal baru tidak mendominasi keputusan.</p>
          </aside>
        </div>
      </section>

      <section className="container workflowIntro">
        <div className="workflowSectionHead">
          <div><small><Sparkles size={13} /> ALAT GRATIS</small><h2>Mulai dari pekerjaan Anda, bukan nama model.</h2></div>
          <p>Versi beta menggunakan data tool yang sudah dipublikasikan AIUpdateId. Confidence turun jika profil belum lengkap atau lama tidak direview.</p>
        </div>
        <AdvisorClient tools={tools} />
      </section>
    </main>
  );
}
