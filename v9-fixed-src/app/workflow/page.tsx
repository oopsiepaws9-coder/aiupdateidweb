import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDollarSign, ClipboardCheck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import WorkflowCheckClient from "@/components/WorkflowCheckClient";
import PremiumIntentLink from "@/components/PremiumIntentLink";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Prompt Quality Check & AI Content Workflow Kit",
  description: "Periksa kelengkapan brief AI, buat prompt yang lebih siap pakai, lalu pelajari workflow konten AI yang lebih rapi dan dapat diverifikasi.",
  alternates: { canonical: "/workflow" },
  openGraph: {
    title: "Prompt Quality Check — AIUpdateId",
    description: "Ubah brief yang terlalu umum menjadi prompt yang lebih jelas, terstruktur, dan siap diperiksa.",
    type: "website",
    url: "/workflow"
  }
};

const benefits = [
  { icon: ClipboardCheck, title: "Mulai dari brief", text: "Tentukan tujuan, audiens, konteks, format, dan batasan sebelum meminta AI menulis." },
  { icon: ShieldCheck, title: "Cek sebelum terbit", text: "Pastikan klaim, sumber, nada, dan CTA tidak diserahkan mentah-mentah kepada AI." },
  { icon: RefreshCw, title: "Dibuat untuk berubah", text: "Workflow dapat diperbarui saat model dan fitur AI berubah, bukan sekadar file prompt statis." },
];

export default function WorkflowPage() {
  const base = getSiteUrl();
  const earlyAccessHref = "mailto:aiupdateid99@gmail.com?subject=Minat%20AI%20Content%20Workflow%20Kit&body=Halo%20AIUpdateId%2C%20saya%20ingin%20mendapatkan%20informasi%20saat%20AI%20Content%20Workflow%20Kit%20dibuka.";
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AIUpdateId Prompt Quality Check",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    url: `${base}/workflow`,
    inLanguage: "id-ID",
    isAccessibleForFree: true,
    description: "Alat gratis untuk memeriksa kelengkapan brief dan menyusun prompt kerja yang lebih jelas."
  };

  return <main className="page workflowPage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="workflowHero">
      <div className="container workflowHeroGrid">
        <div>
          <span className="workflowEyebrow"><Sparkles size={16} /> AIUPDATEID WORKFLOW</span>
          <h1>Jangan mulai dari prompt. Mulai dari pekerjaan yang ingin selesai.</h1>
          <p>Prompt Quality Check membantu mengubah instruksi yang terlalu umum menjadi brief yang lebih jelas—tanpa menjanjikan hasil otomatis atau fakta yang belum diverifikasi.</p>
          <div className="workflowHeroLinks">
            <a className="primary" href="#quality-check">Coba Prompt Quality Check <ArrowRight size={17} /></a>
            <Link className="secondary" href="/prompts">Jelajahi Prompt Library</Link>
          </div>
          <div className="workflowTrust"><span><CheckCircle2 size={16} /> Gratis digunakan</span><span><CheckCircle2 size={16} /> Tanpa API berbayar</span><span><CheckCircle2 size={16} /> Isi brief tetap di perangkat Anda</span></div>
        </div>
        <aside className="workflowHeroCard">
          <small>MASALAH YANG DISELESAIKAN</small>
          <h2>“Buatkan konten tentang AI”</h2>
          <div className="workflowArrow">↓</div>
          <p>Tujuan, audiens, bahan, format, dan batasan sudah jelas sebelum AI mulai bekerja.</p>
        </aside>
      </div>
    </section>

    <section className="container workflowIntro" id="quality-check">
      <div className="workflowSectionHead"><div><small>ALAT GRATIS</small><h2>Periksa brief, lalu ambil prompt yang lebih siap dipakai.</h2></div><p>Isi brief tidak dikirim. Kami hanya mencatat event penggunaan anonim untuk mengukur apakah alat ini benar-benar membantu.</p></div>
      <WorkflowCheckClient />
    </section>

    <section className="workflowBenefits">
      <div className="container">
        <div className="workflowSectionHead"><div><small>KENAPA BUKAN BUNDEL PROMPT</small><h2>Output bagus membutuhkan alur kerja, bukan kata-kata ajaib.</h2></div></div>
        <div className="workflowBenefitGrid">{benefits.map(({ icon: Icon, title, text }) => <article key={title}><span><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section className="container workflowKit" id="kit">
      <div className="workflowKitCopy"><span><CircleDollarSign size={16} /> WORKFLOW KIT — BETA</span><h2>AI Content Workflow Kit Indonesia</h2><p>Sistem langkah demi langkah untuk mengubah ide menjadi artikel, skrip video pendek, dan rencana publikasi—dengan quality gate sebelum konten keluar.</p><ul><li>Brief Builder dan Idea Filter</li><li>Prompt berantai untuk outline, draf, kritik, dan revisi</li><li>Workflow artikel dan Shorts dalam bahasa Indonesia</li><li>Checklist klaim, sumber, pengulangan, dan CTA</li></ul></div>
      <aside><small>HARGA BETA YANG DIRENCANAKAN</small><strong>Rp49.000</strong><p>Satu workflow lengkap, contoh penggunaan, dan pembaruan selama 90 hari.</p><PremiumIntentLink href={earlyAccessHref} /><small className="workflowFinePrint">Belum ada tagihan atau klaim hasil bisnis. Akses awal dipakai untuk memvalidasi kebutuhan pembaca.</small></aside>
    </section>
  </main>;
}
