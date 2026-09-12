import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Database, Wrench } from "lucide-react";
import TroubleshooterClient from "@/components/TroubleshooterClient";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";
import type { AITool } from "@/lib/tool-types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI Troubleshooter: Cari Penyebab AI Gagal & Cara Memperbaikinya",
  description: "Diagnosis masalah AI seperti file gagal dibaca, sitasi salah, hallucination, konteks hilang, format gagal, atau batas fitur—berdasarkan profil tool AIUpdateId.",
  alternates: { canonical: "/troubleshoot" },
  openGraph: {
    title: "AI Troubleshooter — AIUpdateId",
    description: "Pilih tool dan masalahnya. AIUpdateId membantu memetakan kemungkinan penyebab, pemeriksaan, dan langkah perbaikan.",
    type: "website",
    url: "/troubleshoot",
  },
};

export default async function TroubleshootPage() {
  const supabase = createServerSupabase();
  let tools: AITool[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("ai_tools")
      .select("*")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("name", { ascending: true });
    tools = (data || []) as AITool[];
  }

  const base = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AIUpdateId AI Troubleshooter",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: `${base}/troubleshoot`,
    inLanguage: "id-ID",
    isAccessibleForFree: true,
    description: "Alat diagnosis masalah penggunaan AI berdasarkan taxonomy kegagalan dan profil tool AIUpdateId.",
  };

  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="workflowHero">
        <div className="container workflowHeroGrid">
          <div>
            <span className="workflowEyebrow"><Wrench size={17} /> AI FAILURE INTELLIGENCE</span>
            <h1>Kalau AI gagal, jangan langsung ganti tool. Cari dulu penyebabnya.</h1>
            <p>AIUpdateId memetakan gejala menjadi kemungkinan penyebab, cara mengecek, tindakan perbaikan, dan catatan limitation dari profil tool.</p>
            <div className="workflowTrust">
              <span><CheckCircle2 size={16} /> Diagnosis terstruktur</span>
              <span><Database size={16} /> Profil AIUpdateId</span>
              <span><AlertTriangle size={16} /> Confidence ditampilkan</span>
            </div>
          </div>
          <aside className="workflowHeroCard">
            <small>FAILURE TAXONOMY V1</small>
            <h2>Gejala → penyebab → pemeriksaan → workaround → alternatif.</h2>
            <div className="workflowArrow">↓</div>
            <p>Bukan chatbot yang menebak bebas. Diagnosis dibatasi pada taxonomy kegagalan dan data tool yang tersedia.</p>
          </aside>
        </div>
      </section>

      <section className="container workflowIntro">
        <div className="workflowSectionHead">
          <div><small>ALAT GRATIS</small><h2>Diagnosis masalah AI secara lebih sistematis.</h2></div>
          <p>Jika confidence rendah atau data sudah lama, hasil harus dianggap titik awal untuk verifikasi—bukan kepastian.</p>
        </div>
        <TroubleshooterClient tools={tools} />
      </section>
    </main>
  );
}
