"use client";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import { cleanArticleTitle, formatDate, readingMinutes } from "@/lib/utils";

import ArticleCard from "@/components/ArticleCard";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import ArticleBody from "@/components/ArticleBody";
import TableOfContents from "@/components/TableOfContents";

export default function Page({params}:{params:{slug:string}}){
  const[a,setA]=useState<Article|null|undefined>(undefined);
  const[related,setRelated]=useState<Article[]>([]);

  useEffect(()=>{
    supabase.from("articles").select("*").eq("slug",params.slug).eq("status","published").single()
      .then(async({data})=>{
        const article=data||null;
        setA(article);
        if(article){await supabase.from("articles").update({view_count:(article.view_count||0)+1}).eq("id",article.id)}
        if(article){
          const{data:more}=await supabase.from("articles").select("*")
            .eq("status","published").eq("category",article.category)
            .neq("id",article.id).limit(3);
          setRelated(more||[]);
        }
      });
  },[params.slug]);

  if(a===undefined)return <main className="page"><div className="empty">Memuat artikel...</div></main>;
  if(!a)return <main className="page"><section className="container content center"><h1>Artikel tidak ditemukan</h1><Link className="primary" href="/">Kembali ke beranda</Link></section></main>;

  const minutes=readingMinutes(a.content);
  return <main className="page">
    <ReadingProgress/>
    <article className="container article">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link><span>/</span>
        <Link href={`/kategori/${(a.category||"artikel").toLowerCase().replace(/\s+/g,"-")}`}>{a.category}</Link><span>/</span>
        <span>{cleanArticleTitle(a.title)}</span>
      </nav>
      <Link className="back" href="/"><ArrowLeft size={17}/> Kembali ke beranda</Link>
      <div className="articleHead">
        <span className="categoryBadge">{a.category}</span>
        <h1>{cleanArticleTitle(a.title)}</h1>
        <p>{a.excerpt ? cleanArticleTitle(a.excerpt) : ""}</p>
        <div className="articleMeta">
          <span><UserRound size={16}/> AIUpdateId</span>
          <span><CalendarDays size={16}/> {formatDate(a.published_at||a.created_at)}</span>
          <span><Clock3 size={16}/> {a.read_time||`${minutes} menit`}</span>
        </div>
      </div>

      {a.cover_image
        ? <><img className="coverImage" src={a.cover_image} alt={a.alt_text||cleanArticleTitle(a.title)}/>{a.image_caption&&<p className="imageCaption">{a.image_caption}{a.image_source?` — ${a.image_source}`:""}</p>}</>
        : <div className="cover">AIUpdateId</div>}

      <div className="articleLayout">
        <div className="articleMain">
          <TableOfContents/>
          <ArticleBody content={a.content||""}/>
          {a.tags&&a.tags.length>0&&<div className="tagRow">{a.tags.map(tag=><Link href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g,"-"))}`} key={tag}>{tag}</Link>)}</div>}
          {a.faq&&a.faq.length>0&&<section className="faqSection"><h2>Pertanyaan yang Sering Diajukan</h2>{a.faq.map((item,index)=><details key={index}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>}
          {a.call_to_action&&<section className="ctaBox"><h3>Ikuti Perkembangan AI</h3><p>{a.call_to_action}</p></section>}
          <ShareButtons title={cleanArticleTitle(a.title)}/>
          <section className="authorBox">
            <div className="authorAvatar">AI</div>
            <div><span>Ditulis oleh</span><h3>Tim AIUpdateId</h3><p>Menyajikan informasi AI dalam bahasa Indonesia secara praktis dan mudah dipahami.</p></div>
          </section>
        </div>
        <aside className="articleSidebar">
          <div><small>RINGKASAN</small><p>{a.excerpt ? cleanArticleTitle(a.excerpt) : ""}</p></div>
          <div><small>KATEGORI</small><Link href={`/kategori/${(a.category||"artikel").toLowerCase().replace(/\s+/g,"-")}`}>{a.category}</Link></div>
        </aside>
      </div>
    </article>

    {related.length>0&&<section className="relatedSection"><div className="container">
      <div className="sectionHead"><div><small>LANJUT MEMBACA</small><h2>Artikel terkait</h2></div></div>
      <div className="grid">{related.map(item=><ArticleCard key={item.id} a={item}/>)}</div>
    </div></section>}
  <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: cleanArticleTitle(a.title),
          description: a.excerpt || "",
          image: a.cover_image ? [a.cover_image] : [],
          datePublished: a.published_at || a.created_at,
          dateModified: a.updated_at,
          author: { "@type": "Organization", name: "AIUpdateId" },
          publisher: { "@type": "Organization", name: "AIUpdateId" },
          ...(a.faq&&a.faq.length?{
            mainEntity: a.faq.map(item=>({
              "@type":"Question",
              name:item.question,
              acceptedAnswer:{"@type":"Answer",text:item.answer}
            }))
          }:{})
        })
      }}
    />
  </main>
}
