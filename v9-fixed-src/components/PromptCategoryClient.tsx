"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import type { PromptItem } from "@/lib/prompt-types";

const functionFilters = [
  { label: "Semua", tag: "Semua" },
  { label: "Membuat dari Nol", tag: "fungsi-membuat-dari-nol" },
  { label: "Outline", tag: "fungsi-outline" },
  { label: "Pembuka", tag: "fungsi-pembuka" },
  { label: "Optimasi", tag: "fungsi-optimasi" },
  { label: "Audit", tag: "fungsi-audit" },
  { label: "SEO", tag: "fungsi-seo" },
  { label: "FAQ", tag: "fungsi-faq" },
  { label: "CTA", tag: "fungsi-cta" },
  { label: "Internal Link", tag: "fungsi-internal-link" },
  { label: "Update Lama", tag: "fungsi-update" },
  { label: "Repurpose", tag: "fungsi-repurpose" },
  { label: "Rewrite", tag: "fungsi-rewrite" }
];

function functionLabel(prompt: PromptItem) {
  const tags = prompt.tags || [];
  const found = functionFilters.find(item => item.tag !== "Semua" && tags.includes(item.tag));
  return found?.label || "Prompt Artikel";
}

export default function PromptCategoryClient({ prompts }: { prompts: PromptItem[] }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("Semua");
  const [tool, setTool] = useState("Semua");
  const [fn, setFn] = useState("Semua");
  const [copied, setCopied] = useState("");

  const levels = useMemo(() => ["Semua", ...Array.from(new Set(prompts.map(p => p.level).filter(Boolean) as string[])).sort()], [prompts]);
  const tools = useMemo(() => ["Semua", ...Array.from(new Set(prompts.map(p => p.tool_name || p.tool_slug).filter(Boolean) as string[])).sort()], [prompts]);
  const activeFunctions = useMemo(() => functionFilters.filter(item => item.tag === "Semua" || prompts.some(p => (p.tags || []).includes(item.tag))), [prompts]);

  const items = useMemo(() => prompts.filter(p => {
    const query = q.trim().toLowerCase();
    const hay = [
      p.title,
      p.description,
      p.category,
      p.level,
      p.tool_name,
      p.tool_slug,
      p.prompt_text,
      ...(p.tags || []),
      ...(p.variables || [])
    ].filter(Boolean).join(" ").toLowerCase();

    return (!query || hay.includes(query)) &&
      (level === "Semua" || p.level === level) &&
      (tool === "Semua" || p.tool_name === tool || p.tool_slug === tool) &&
      (fn === "Semua" || (p.tags || []).includes(fn));
  }), [prompts, q, level, tool, fn]);

  const featured = prompts.filter(p => p.featured).slice(0, 3);

  const copy = async (p: PromptItem) => {
    await navigator.clipboard.writeText(p.prompt_text);
    setCopied(p.id);
    setTimeout(() => setCopied(""), 1600);
  };

  return <main className="page promptLibraryPage">
    <section className="promptHero">
      <div className="container promptHeroGrid">
        <div>
          <span className="promptEyebrow"><Sparkles size={16}/> PROMPT ARTIKEL</span>
          <h1>Etalase prompt artikel untuk membuat, mengoptimasi, dan audit konten.</h1>
          <p>Pilih prompt sesuai fungsi: membuat artikel dari nol, outline, pembuka problem-first, optimasi SEO, FAQ, CTA, internal link, update artikel lama, sampai repurpose konten.</p>
          <div className="promptHeroStats">
            <div><b>{prompts.length}</b><span>Prompt artikel</span></div>
            <div><b>{activeFunctions.length - 1}</b><span>Fungsi tersedia</span></div>
            <div><b>{tools.length - 1}</b><span>Tool terkait</span></div>
          </div>
        </div>
        <div className="promptHeroPanel">
          <small>ALUR CEPAT</small>
          <ol>
            <li>Pilih fungsi prompt yang dibutuhkan.</li>
            <li>Buka detail atau langsung salin prompt.</li>
            <li>Ganti variabel seperti <b>[topik]</b>, <b>[audiens]</b>, dan <b>[keyword]</b>.</li>
            <li>Edit hasil akhir sebelum publish.</li>
          </ol>
        </div>
      </div>
    </section>

    {featured.length > 0 && <section className="container promptFeatured">
      <div className="promptSectionHead">
        <div><small>PILIHAN EDITOR</small><h2>Prompt artikel prioritas</h2></div>
      </div>
      <div className="featuredPromptGrid">
        {featured.map(p => <article key={p.id} className="featuredPromptCard">
          <div>
            <small>{functionLabel(p)}</small>
            <h3><Link href={`/prompts/${p.slug}`}>{p.title}</Link></h3>
            <p>{p.description}</p>
          </div>
          <button onClick={() => copy(p)}>{copied === p.id ? <Check size={17}/> : <Copy size={17}/>} {copied === p.id ? "Tersalin" : "Salin"}</button>
        </article>)}
      </div>
    </section>}

    <section className="container promptDirectory">
      <div className="promptSectionHead">
        <div><small>ETALASE ARTIKEL</small><h2>Cari prompt berdasarkan fungsi</h2></div>
        <span>{items.length} hasil</span>
      </div>

      <div className="promptFilters">
        <label className="promptSearch"><Search size={18}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari prompt artikel, SEO, FAQ, internal link..."/></label>
        <label><SlidersHorizontal size={16}/><select value={level} onChange={e => setLevel(e.target.value)}>{levels.map(v => <option key={v}>{v}</option>)}</select></label>
        <label><select value={tool} onChange={e => setTool(e.target.value)}>{tools.map(v => <option key={v}>{v}</option>)}</select></label>
      </div>

      <div className="promptCategoryPills">
        {activeFunctions.map(item => <button key={item.tag} className={fn === item.tag ? "active" : ""} onClick={() => setFn(item.tag)}>{item.label}</button>)}
      </div>

      {items.length ? <div className="promptDirectoryGrid">
        {items.map(p => <article className="promptDirectoryCard" key={p.id}>
          <div className="promptCardMeta"><span>Artikel</span><span>{functionLabel(p)}</span>{p.level && <span>{p.level}</span>}</div>
          <h2><Link href={`/prompts/${p.slug}`}>{p.title}</Link></h2>
          <p>{p.description}</p>
          <div className="promptPreviewText">{p.prompt_text}</div>
          {p.variables?.length ? <div className="promptVariables">{p.variables.slice(0, 4).map(v => <span key={v}>[{v}]</span>)}</div> : null}
          <div className="promptCardFooter">
            <button onClick={() => copy(p)}>{copied === p.id ? <Check size={16}/> : <Copy size={16}/>} {copied === p.id ? "Tersalin" : "Salin prompt"}</button>
            <Link href={`/prompts/${p.slug}`}>Lihat detail <ArrowUpRight size={15}/></Link>
          </div>
        </article>)}
      </div> : <div className="empty">Belum ada prompt artikel yang cocok dengan filter ini.</div>}
    </section>
  </main>;
}
