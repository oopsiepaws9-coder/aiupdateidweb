"use client";

import Link from "next/link";
import { Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import BrandLogo from "./BrandLogo";

type DirectoryItem = {
  id?: string;
  slug?: string;
  name?: string | null;
  term?: string | null;
  title?: string | null;
  provider?: string | null;
  category?: string | null;
  short_description?: string | null;
  short_definition?: string | null;
  summary?: string | null;
  logo_url?: string | null;
  rating?: number | null;
  featured?: boolean | null;
};

type DirectoryProfile = {
  intro: string;
  guideTitle: string;
  guideCopy: string;
  benefits: string[];
  statLabel: string;
  categoryLabel: string;
  intentLabel: string;
  links: { href: string; label: string; description: string }[];
  faq: { question: string; answer: string }[];
};

const profiles: Record<string, DirectoryProfile> = {
  ai_models: {
    intro: "Gunakan direktori ini untuk memahami model AI berdasarkan penyedia, kemampuan, konteks penggunaan, dan batasannya sebelum memilih model untuk belajar, riset, coding, atau workflow profesional.",
    guideTitle: "Cara membaca database model AI",
    guideCopy: "Jangan hanya melihat nama model. Perhatikan penyedia, kemampuan utama, context window, dukungan multimodal, harga, dan kecocokan dengan kebutuhan nyata.",
    benefits: [
      "Bandingkan model berdasarkan fungsi, bukan hype.",
      "Cari model yang cocok untuk riset, coding, belajar, atau pekerjaan produksi.",
      "Gunakan halaman detail untuk melihat kekuatan, batasan, dan sumber resmi."
    ],
    statLabel: "model tersedia",
    categoryLabel: "penyedia/kategori",
    intentLabel: "untuk memilih model",
    links: [
      { href: "/tools", label: "Lihat Tools AI", description: "Temukan aplikasi AI yang memakai model-model ini." },
      { href: "/compare", label: "Buka Perbandingan AI", description: "Bandingkan AI sebelum memilih." },
      { href: "/glossary", label: "Pelajari Istilah AI", description: "Pahami istilah seperti LLM, RAG, token, dan multimodal." }
    ],
    faq: [
      { question: "Apa bedanya model AI dan tools AI?", answer: "Model AI adalah mesin kecerdasan di balik sistem, sedangkan tools AI adalah aplikasi yang dipakai pengguna." },
      { question: "Apakah model dengan skor tinggi selalu paling cocok?", answer: "Tidak selalu. Pilihan terbaik tergantung tugas, biaya, integrasi, privasi, dan kemudahan penggunaan." }
    ]
  },
  comparisons: {
    intro: "Halaman ini membantu pembaca membandingkan AI berdasarkan kebutuhan nyata, bukan sekadar popularitas. Cocok untuk memilih tools belajar, riset, menulis, produktivitas, dan pekerjaan harian.",
    guideTitle: "Cara memakai halaman perbandingan",
    guideCopy: "Mulai dari masalah yang ingin diselesaikan, lalu baca ringkasan, keunggulan masing-masing AI, batasan, dan rekomendasi penggunaan.",
    benefits: [
      "Temukan AI yang cocok untuk kebutuhan spesifik.",
      "Pahami kelebihan dan kekurangan sebelum mencoba.",
      "Gunakan tabel perbandingan untuk mengambil keputusan lebih cepat."
    ],
    statLabel: "perbandingan tersedia",
    categoryLabel: "kategori kebutuhan",
    intentLabel: "untuk keputusan",
    links: [
      { href: "/tools", label: "Direktori Tools AI", description: "Lihat profil tools sebelum membandingkan." },
      { href: "/models", label: "Database Model AI", description: "Pahami model di balik layanan AI." },
      { href: "/artikel", label: "Baca Panduan AI", description: "Pelajari konteks dan tutorial terkait." }
    ],
    faq: [
      { question: "Apakah satu AI bisa unggul untuk semua kebutuhan?", answer: "Tidak. Satu AI bisa kuat untuk menulis, tetapi belum tentu terbaik untuk riset berbasis sumber atau integrasi kerja." },
      { question: "Bagaimana cara memilih dari dua AI yang mirip?", answer: "Mulai dari kebutuhan utama: belajar, menulis, riset, coding, produktivitas, harga, atau ekosistem aplikasi." }
    ]
  },
  glossary_terms: {
    intro: "Glosarium ini dibuat agar istilah AI yang sering terdengar rumit menjadi lebih mudah dipahami. Cocok untuk pemula yang ingin membaca artikel AI tanpa tersesat oleh istilah teknis.",
    guideTitle: "Cara belajar dari glosarium",
    guideCopy: "Mulai dari istilah dasar seperti Artificial Intelligence, Machine Learning, LLM, prompt, token, RAG, dan AI Agent. Setelah paham, lanjutkan ke artikel dan tutorial terkait.",
    benefits: [
      "Pahami istilah AI dengan bahasa sederhana.",
      "Gunakan pencarian untuk menemukan konsep tertentu.",
      "Hubungkan istilah dengan artikel, tools, dan model AI."
    ],
    statLabel: "istilah tersedia",
    categoryLabel: "kelompok istilah",
    intentLabel: "untuk pemula",
    links: [
      { href: "/artikel", label: "Baca Artikel AI", description: "Gunakan istilah ini saat membaca panduan AIUpdateId." },
      { href: "/prompts", label: "Lihat Prompt AI", description: "Praktikkan istilah prompt dalam contoh nyata." },
      { href: "/models", label: "Database Model AI", description: "Kenali istilah model AI secara lebih praktis." }
    ],
    faq: [
      { question: "Apakah glosarium ini untuk pemula?", answer: "Ya. Penjelasan dibuat sederhana, tetapi tetap menjaga konteks penting agar tidak menyesatkan." },
      { question: "Haruskah membaca semua istilah dari awal?", answer: "Tidak. Gunakan pencarian, lalu mulai dari istilah yang sering muncul di artikel AIUpdateId." }
    ]
  }
};

function getTitle(item: DirectoryItem) {
  return item.name || item.term || item.title || "Tanpa judul";
}

function getDescription(item: DirectoryItem) {
  return item.short_description || item.short_definition || item.summary || "";
}

function getCategory(item: DirectoryItem) {
  return item.category || item.provider || "AIUpdateId";
}

export default function V9Directory({
  items = [],
  table,
  title,
  base,
  eyebrow
}: {
  items: DirectoryItem[];
  table: string;
  title: string;
  base: string;
  eyebrow: string;
}) {
  const [q, setQ] = useState("");
  const profile = profiles[table] || profiles.glossary_terms;

  const filteredItems = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  }, [items, q]);

  const categoryCount = useMemo(() => {
    return new Set(items.map(getCategory).filter(Boolean)).size;
  }, [items]);

  return (
    <main className="page">
      <section className="container intro directoryIntro">
        <small>{eyebrow}</small>
        <h1>{title}</h1>
        <p>{profile.intro}</p>

        <div className="directoryStats">
          <div><strong>{items.length}</strong><span>{profile.statLabel}</span></div>
          <div><strong>{categoryCount || "-"}</strong><span>{profile.categoryLabel}</span></div>
          <div><strong>SEO</strong><span>{profile.intentLabel}</span></div>
        </div>

        <label className="globalSearchBox">
          <Search size={20} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari..." />
        </label>
      </section>

      <section className="container directoryGuide">
        <div>
          <small>CARA PAKAI</small>
          <h2>{profile.guideTitle}</h2>
          <p>{profile.guideCopy}</p>
        </div>
        <div className="directoryGuideGrid">
          {profile.benefits.map((benefit, index) => (
            <article key={benefit}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <p>{benefit}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container compact">
        <div className="directorySectionHead">
          <small>DIREKTORI</small>
          <h2>Jelajahi semua data</h2>
          <p>{filteredItems.length} hasil ditemukan.</p>
        </div>

        <div className="v9DirectoryGrid">
          {filteredItems.map((x) => (
            <Link href={base + "/" + x.slug} key={x.id || x.slug || getTitle(x)}>
              {table === "ai_models" ? (
                <BrandLogo provider={x.provider} name={x.name} logoUrl={x.logo_url} />
              ) : (
                <div className="toolLogo">{getTitle(x).slice(0, 2)}</div>
              )}
              <small>{getCategory(x)}</small>
              <h2>{getTitle(x)}</h2>
              <p>{getDescription(x)}</p>
              {x.rating != null && <b><Star size={15} />{x.rating}/10</b>}
            </Link>
          ))}
        </div>

        {!filteredItems.length && <div className="empty">Belum ada data.</div>}
      </section>

      <section className="container directoryLinks">
        <div>
          <small>JALUR LANJUT</small>
          <h2>Lanjutkan eksplorasi</h2>
        </div>
        <div className="directoryLinksGrid">
          {profile.links.map((link) => (
            <Link href={link.href} key={link.href}>
              <span>{link.label}</span>
              <p>{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container directoryFaq">
        <small>FAQ</small>
        <h2>Pertanyaan umum</h2>
        <div>
          {profile.faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
