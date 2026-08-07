"use client";

import Link from "next/link";
import {
  ArrowRight, Bot, CheckCircle2, ChevronRight, Flame,
  Newspaper, Search, Sparkles, Star, TrendingUp, Wrench
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import { aiTools, portalCategories, promptLibrary } from "@/lib/portal-data";

const filters=["Semua","Berita AI","Tools AI","Tutorial","Review","Prompt AI","Belajar AI"];

export default function SmartHome(){
  const[items,setItems]=useState<Article[]>([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState("");
  const[cat,setCat]=useState("Semua");
  const[q,setQ]=useState("");

  useEffect(()=>{
    if(!supabaseConfigured){setError("Konfigurasi Supabase belum tersedia.");setLoading(false);return}
    supabase.from("articles").select("*").eq("status","published")
      .order("published_at",{ascending:false,nullsFirst:false})
      .then(({data,error})=>{
        if(error)setError(error.message);
        else setItems(data||[]);
        setLoading(false);
      });
  },[]);

  const filtered=useMemo(()=>items.filter(a=>
    (cat==="Semua"||a.category===cat) &&
    `${a.title} ${a.excerpt||""} ${(a.tags||[]).join(" ")}`.toLowerCase().includes(q.toLowerCase())
  ),[items,cat,q]);

  const breaking=items.filter(a=>a.breaking).slice(0,4);
  const hero=items.find(a=>a.featured) || items[0];
  const editorPicks=items.filter(a=>a.editor_pick).slice(0,6);
  const trending=[...items]
    .sort((a,b)=>(b.view_count||0)-(a.view_count||0))
    .filter(a=>a.id!==hero?.id)
    .slice(0,5);
  const latest=filtered.filter(a=>a.id!==hero?.id).slice(0,9);

  return <main>
    {breaking.length>0&&<section className="breakingStrip">
      <div className="container breakingInner">
        <span><Flame size={17}/> Breaking</span>
        <div>{breaking.map(a=><Link href={`/artikel/${a.slug}`} key={a.id}>{a.title}</Link>)}</div>
      </div>
    </section>}

    <section className="smartHero">
      <div className="container smartHeroGrid">
        <div className="smartHeroIntro">
          <div className="eyebrow"><span className="liveDot"/> PORTAL AI INDONESIA</div>
          <h1>Informasi AI yang membantu kamu <em>belajar, bekerja, dan berkembang.</em></h1>
          <p>Berita, tutorial, review, tools, dan prompt AI dalam satu portal berbahasa Indonesia.</p>
          <div className="buttons">
            <a className="primary" href="#terbaru">Lihat artikel terbaru <ArrowRight size={18}/></a>
            <Link className="secondary" href="/tools">Jelajahi tools AI</Link>
          </div>
          <div className="checks">
            <span><CheckCircle2 size={17}/> Mudah dipahami</span>
            <span><CheckCircle2 size={17}/> Praktis</span>
            <span><CheckCircle2 size={17}/> Terstruktur</span>
          </div>
        </div>

        {hero?<Link href={`/artikel/${hero.slug}`} className="heroStory">
          <div className="heroStoryMedia">
            {hero.cover_image
              ? <img src={hero.cover_image} alt={hero.alt_text||hero.title}/>
              : <div className="heroFallback"><Bot size={72}/></div>}
          </div>
          <div className="heroStoryContent">
            <span>{hero.category}</span>
            <h2>{hero.title}</h2>
            <p>{hero.excerpt}</p>
            <b>Baca artikel <ArrowRight size={17}/></b>
          </div>
        </Link>:<div className="heroStory emptyHero"><Bot size={72}/><h2>Artikel unggulan akan tampil di sini.</h2></div>}
      </div>
    </section>

    <section className="smartSummary">
      <div className="container summaryGrid">
        <div><Newspaper size={22}/><b>{items.length}</b><span>Artikel</span></div>
        <div><Wrench size={22}/><b>{aiTools.length}</b><span>Tools AI</span></div>
        <div><Sparkles size={22}/><b>{promptLibrary.length}</b><span>Prompt</span></div>
        <div><TrendingUp size={22}/><b>{portalCategories.length}</b><span>Kategori</span></div>
      </div>
    </section>

    <section className="section" id="terbaru">
      <div className="container">
        <div className="sectionHead">
          <div><small>ARTIKEL TERBARU</small><h2>Ikuti perkembangan AI tanpa merasa tertinggal</h2></div>
          <Link className="search smartSearchLink" href="/search"><Search size={18}/><span>Cari artikel, tools, atau prompt...</span></Link>
        </div>
        <div className="pills">{filters.map(x=><button key={x} className={cat===x?"active":""} onClick={()=>setCat(x)}>{x}</button>)}</div>
        {loading&&<div className="empty">Mengambil artikel...</div>}
        {error&&<div className="errorBox">{error}</div>}
        {!loading&&!error&&<div className="grid">{latest.map(a=><ArticleCard key={a.id} a={a}/>)}</div>}
        {!loading&&!error&&!latest.length&&<div className="empty">Belum ada artikel yang cocok.</div>}
      </div>
    </section>

    {editorPicks.length>0&&<section className="section editorPickSection">
      <div className="container">
        <div className="sectionHead">
          <div><small>PILIHAN EDITOR</small><h2>Konten terbaik pilihan AIUpdateId</h2></div>
        </div>
        <div className="editorPickGrid">
          {editorPicks.map((a,index)=><Link href={`/artikel/${a.slug}`} className="editorPickCard" key={a.id}>
            <span>{String(index+1).padStart(2,"0")}</span>
            <div><small>{a.category}</small><h3>{a.title}</h3><p>{a.excerpt}</p></div>
            <ChevronRight size={20}/>
          </Link>)}
        </div>
      </div>
    </section>}

    <section className="section portalSplit">
      <div className="container splitGrid">
        <div>
          <div className="sectionHead"><div><small>TRENDING</small><h2>Paling banyak dibaca</h2></div></div>
          <div className="trendingList">
            {trending.length?trending.map((a,i)=><Link href={`/artikel/${a.slug}`} key={a.id}>
              <span>{i+1}</span>
              <div><small>{a.category}</small><h3>{a.title}</h3><p>{a.view_count||0} pembaca</p></div>
            </Link>):<div className="empty">Data trending akan muncul setelah artikel dibaca.</div>}
          </div>
        </div>

        <div>
          <div className="sectionHead"><div><small>KATEGORI</small><h2>Jelajahi berdasarkan topik</h2></div></div>
          <div className="smartCategoryGrid">
            {portalCategories.map((c,i)=><Link href={`/kategori/${c.slug}`} key={c.slug}>
              <span>{String(i+1).padStart(2,"0")}</span>
              <div><h3>{c.name}</h3><p>{c.description}</p></div>
              <ArrowRight size={18}/>
            </Link>)}
          </div>
        </div>
      </div>
    </section>

    <section className="section toolsSection">
      <div className="container">
        <div className="sectionHead">
          <div><small>TOOLS AI</small><h2>Pilihan alat AI untuk berbagai kebutuhan</h2></div>
          <Link className="textLink" href="/tools">Lihat semua <ArrowRight size={17}/></Link>
        </div>
        <div className="toolGrid">
          {aiTools.slice(0,6).map(t=><Link href={`/tools/${t.slug}`} className="toolCard" key={t.slug}>
            <div className="toolLogo">{t.name.slice(0,2)}</div>
            <div><small>{t.category}</small><h3>{t.name}</h3><p>{t.description}</p><div className="toolMeta"><span><Star size={15}/> {t.rating}</span><span>{t.pricing}</span></div></div>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="newsletter">
      <div className="container newsletterBox">
        <div><small>NEWSLETTER AIUPDATEID</small><h2>Ringkasan AI pilihan, langsung ke emailmu.</h2><p>Fitur pendaftaran akan diaktifkan pada sprint berikutnya.</p></div>
        <NewsletterForm/>
      </div>
    </section>
  </main>
}
