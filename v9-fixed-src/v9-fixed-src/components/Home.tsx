"use client";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Copy, Flame, Search, Sparkles, Star, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import ArticleCard from "./ArticleCard";
import { aiTools, portalCategories, promptLibrary } from "@/lib/portal-data";

const filters=["Semua","Berita AI","Tools AI","Tutorial","Review","Prompt AI"];

export default function Home(){
  const[items,setItems]=useState<Article[]>([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState("");
  const[cat,setCat]=useState("Semua");
  const[q,setQ]=useState("");
  const[copied,setCopied]=useState("");

  useEffect(()=>{
    if(!supabaseConfigured){setError("Konfigurasi Supabase belum tersedia.");setLoading(false);return}
    supabase.from("articles").select("*").eq("status","published")
      .order("published_at",{ascending:false,nullsFirst:false})
      .then(({data,error})=>{if(error)setError(error.message);else setItems(data||[]);setLoading(false)});
  },[]);

  const filtered=useMemo(()=>items.filter(a=>(cat==="Semua"||a.category===cat)&&`${a.title} ${a.excerpt||""}`.toLowerCase().includes(q.toLowerCase())),[items,cat,q]);
  const featured=items.find(x=>x.featured)||items[0];
  const trending=items.slice(0,4);

  const copyPrompt=async(slug:string,prompt:string)=>{
    await navigator.clipboard.writeText(prompt);setCopied(slug);setTimeout(()=>setCopied(""),1500)
  };

  return <main>
    <section className="hero v7Hero"><div className="container heroGrid">
      <div><div className="eyebrow"><span className="liveDot"/> PORTAL AI INDONESIA</div>
      <h1>Temukan informasi dan alat <em>AI</em> yang benar-benar berguna.</h1>
      <p className="lead">Berita terbaru, tutorial praktis, review, direktori tools, dan prompt siap pakai dalam bahasa Indonesia.</p>
      <div className="buttons"><a className="primary" href="#artikel">Jelajahi konten <ArrowRight size={18}/></a><Link className="secondary" href="/tools">Direktori tools</Link></div>
      <div className="checks"><span><CheckCircle2 size={17}/> Praktis</span><span><CheckCircle2 size={17}/> Mudah dipahami</span><span><CheckCircle2 size={17}/> Diperbarui berkala</span></div></div>
      <div className="aiPortalVisual"><div className="orb"><Bot size={72}/></div><div className="floatingCard one"><Sparkles size={18}/> Berita AI</div><div className="floatingCard two"><Wrench size={18}/> Tools AI</div><div className="floatingCard three"><span>⌘</span> Prompt</div></div>
    </div></section>

    {trending.length>0&&<section className="trendingBar"><div className="container trendingInner"><span><Flame size={18}/> Trending</span><div>{trending.map(a=><Link key={a.id} href={`/artikel/${a.slug}`}>{a.title}</Link>)}</div></div></section>}

    <section className="section" id="artikel"><div className="container">
      <div className="sectionHead"><div><small>ARTIKEL TERBARU</small><h2>Ikuti perkembangan AI tanpa merasa tertinggal</h2></div><label className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari artikel..."/></label></div>
      <div className="pills">{filters.map(x=><button key={x} className={cat===x?"active":""} onClick={()=>setCat(x)}>{x}</button>)}</div>
      {loading&&<div className="empty">Mengambil artikel...</div>}{error&&<div className="errorBox">{error}</div>}
      {!loading&&!error&&<div className="grid">{filtered.slice(0,9).map(a=><ArticleCard key={a.id} a={a}/>)}</div>}
      {!loading&&!error&&!filtered.length&&<div className="empty">Belum ada artikel yang cocok.</div>}
    </div></section>

    <section className="section categorySection"><div className="container">
      <div className="sectionHead"><div><small>JELAJAHI TOPIK</small><h2>Konten berdasarkan kebutuhanmu</h2></div></div>
      <div className="categoryGrid">{portalCategories.map((c,i)=><Link key={c.slug} href={`/kategori/${c.slug}`} className="categoryTile"><span>{String(i+1).padStart(2,"0")}</span><h3>{c.name}</h3><p>{c.description}</p><ArrowRight size={18}/></Link>)}</div>
    </div></section>

    <section className="section toolsSection"><div className="container">
      <div className="sectionHead"><div><small>DIREKTORI TOOLS</small><h2>Alat AI pilihan untuk bekerja lebih cerdas</h2></div><Link className="textLink" href="/tools">Lihat semua <ArrowRight size={17}/></Link></div>
      <div className="toolGrid">{aiTools.slice(0,6).map(t=><Link href={`/tools/${t.slug}`} className="toolCard" key={t.slug}><div className="toolLogo">{t.name.slice(0,2)}</div><div><small>{t.category}</small><h3>{t.name}</h3><p>{t.description}</p><div className="toolMeta"><span><Star size={15}/> {t.rating}</span><span>{t.pricing}</span></div></div></Link>)}</div>
    </div></section>

    <section className="section promptSection"><div className="container">
      <div className="sectionHead"><div><small>PROMPT LIBRARY</small><h2>Prompt siap pakai untuk berbagai pekerjaan</h2></div><Link className="textLink" href="/prompt">Buka library <ArrowRight size={17}/></Link></div>
      <div className="promptGrid">{promptLibrary.slice(0,4).map(p=><article className="promptCard" key={p.slug}><small>{p.category}</small><h3>{p.title}</h3><p>{p.description}</p><button onClick={()=>copyPrompt(p.slug,p.prompt)}><Copy size={16}/>{copied===p.slug?"Tersalin":"Salin prompt"}</button></article>)}</div>
    </div></section>

    <section className="newsletter"><div className="container newsletterBox"><div><small>NEWSLETTER AIUPDATEID</small><h2>Ringkasan AI pilihan, langsung ke emailmu.</h2><p>Fitur pendaftaran newsletter akan segera diaktifkan.</p></div><form onSubmit={e=>e.preventDefault()}><input type="email" placeholder="Alamat email"/><button className="primary">Daftar</button></form></div></section>
  </main>
}
