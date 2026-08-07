"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Check, Search, Sparkles, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import type { PromptItem } from "@/lib/prompt-types";

export default function PromptLibraryClient({ prompts }: { prompts: PromptItem[] }) {
  const [q,setQ]=useState("");
  const [category,setCategory]=useState("Semua");
  const [level,setLevel]=useState("Semua");
  const [tool,setTool]=useState("Semua");
  const [copied,setCopied]=useState("");

  const categories=useMemo(()=>["Semua",...Array.from(new Set(prompts.map(p=>p.category).filter(Boolean) as string[])).sort()], [prompts]);
  const levels=useMemo(()=>["Semua",...Array.from(new Set(prompts.map(p=>p.level).filter(Boolean) as string[])).sort()], [prompts]);
  const tools=useMemo(()=>["Semua",...Array.from(new Set(prompts.map(p=>p.tool_name || p.tool_slug).filter(Boolean) as string[])).sort()], [prompts]);

  const items=useMemo(()=>prompts.filter(p=>{
    const query=q.trim().toLowerCase();
    const hay=[p.title,p.description,p.category,p.level,p.tool_name,p.tool_slug,...(p.tags||[]),...(p.variables||[])].filter(Boolean).join(" ").toLowerCase();
    return (!query || hay.includes(query)) &&
      (category==="Semua" || p.category===category) &&
      (level==="Semua" || p.level===level) &&
      (tool==="Semua" || p.tool_name===tool || p.tool_slug===tool);
  }),[prompts,q,category,level,tool]);

  const copy=async(p:PromptItem)=>{
    await navigator.clipboard.writeText(p.prompt_text);
    setCopied(p.id);
    setTimeout(()=>setCopied(""),1600);
  };

  const featured=prompts.filter(p=>p.featured).slice(0,3);

  return <main className="page promptLibraryPage">
    <section className="promptHero">
      <div className="container promptHeroGrid">
        <div>
          <span className="promptEyebrow"><Sparkles size={16}/> PROMPT LIBRARY</span>
          <h1>Prompt AI siap pakai, tapi tetap mudah Anda sesuaikan.</h1>
          <p>Mulai dari template yang jelas, ganti variabelnya, lalu gunakan di ChatGPT, Gemini, Claude, atau tool AI yang sesuai.</p>
          <div className="promptHeroStats">
            <div><b>{prompts.length}</b><span>Prompt published</span></div>
            <div><b>{categories.length-1}</b><span>Kategori</span></div>
            <div><b>{tools.length-1}</b><span>Tool terkait</span></div>
          </div>
        </div>
        <div className="promptHeroPanel">
          <small>CARA PAKAI</small>
          <ol><li>Pilih prompt sesuai tujuan.</li><li>Ganti bagian dalam <b>[KURUNG SIKU]</b>.</li><li>Salin ke AI pilihan Anda.</li><li>Periksa hasil dan revisi bila perlu.</li></ol>
        </div>
      </div>
    </section>

    {featured.length>0&&<section className="container promptFeatured">
      <div className="promptSectionHead"><div><small>PILIHAN EDITOR</small><h2>Prompt unggulan</h2></div></div>
      <div className="featuredPromptGrid">{featured.map(p=><article key={p.id} className="featuredPromptCard">
        <div><small>{p.category || "Prompt AI"}</small><h3><Link href={`/prompts/${p.slug}`}>{p.title}</Link></h3><p>{p.description}</p></div>
        <button onClick={()=>copy(p)}>{copied===p.id?<Check size={17}/>:<Copy size={17}/>} {copied===p.id?"Tersalin":"Salin"}</button>
      </article>)}</div>
    </section>}

    <section className="container promptDirectory">
      <div className="promptSectionHead"><div><small>JELAJAHI</small><h2>Temukan prompt berdasarkan kebutuhan</h2></div><span>{items.length} hasil</span></div>
      <div className="promptFilters">
        <label className="promptSearch"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari prompt, tugas, tool, atau kategori..."/></label>
        <label><SlidersHorizontal size={16}/><select value={level} onChange={e=>setLevel(e.target.value)}>{levels.map(v=><option key={v}>{v}</option>)}</select></label>
        <label><select value={tool} onChange={e=>setTool(e.target.value)}>{tools.map(v=><option key={v}>{v}</option>)}</select></label>
      </div>
      <div className="promptCategoryPills">{categories.map(v=><button key={v} className={category===v?"active":""} onClick={()=>setCategory(v)}>{v}</button>)}</div>

      {items.length?<div className="promptDirectoryGrid">{items.map(p=><article className="promptDirectoryCard" key={p.id}>
        <div className="promptCardMeta"><span>{p.category || "Prompt AI"}</span>{p.level&&<span>{p.level}</span>}</div>
        <h2><Link href={`/prompts/${p.slug}`}>{p.title}</Link></h2>
        <p>{p.description}</p>
        <div className="promptPreviewText">{p.prompt_text}</div>
        {p.variables?.length?<div className="promptVariables">{p.variables.slice(0,4).map(v=><span key={v}>[{v}]</span>)}</div>:null}
        <div className="promptCardFooter">
          <button onClick={()=>copy(p)}>{copied===p.id?<Check size={16}/>:<Copy size={16}/>} {copied===p.id?"Tersalin":"Salin prompt"}</button>
          <Link href={`/prompts/${p.slug}`}>Lihat detail <ArrowUpRight size={15}/></Link>
        </div>
      </article>)}</div>:<div className="empty">Tidak ada prompt yang cocok dengan filter ini.</div>}
    </section>
  </main>;
}
