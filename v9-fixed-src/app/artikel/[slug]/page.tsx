import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, UserRound } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";
import { cleanArticleTitle, formatDate, readingMinutes } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";

import ArticleCard from "@/components/ArticleCard";
import ArticleViewTracker from "@/components/ArticleViewTracker";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import ArticleBody from "@/components/ArticleBody";
import TableOfContents from "@/components/TableOfContents";

export const revalidate = 300;

const LEGACY_ARTICLE_REDIRECTS: Record<string,string> = {
  "chatgpt-5-bukan-sekadar-chatbot-10-hal-penting-yang-harus-diketahui-semua-orang-kategori-ai": "chatgpt-5-resmi-hadir"
};

export default async function Page(props:{params: Promise<{slug:string}>}) {
  const params = await props.params;
  const redirectTarget=LEGACY_ARTICLE_REDIRECTS[params.slug];
  if(redirectTarget) permanentRedirect(`/artikel/${redirectTarget}`);
  const supabase=createServerSupabase();
  if(!supabase) notFound();

  const {data}=await supabase
    .from("articles")
    .select("*")
    .eq("slug",params.slug)
    .eq("status","published")
    .maybeSingle();

  if(!data) return notFound();
  const a=data as Article;

  let related:Article[]=[];
  if(a.category){
    const {data:more}=await supabase
      .from("articles")
      .select("*")
      .eq("status","published")
      .eq("category",a.category)
      .neq("id",a.id)
      .order("published_at",{ascending:false,nullsFirst:false})
      .limit(3);
    related=(more||[]) as Article[];
  }

  // Contextual internal links are resolved on the server so crawlers receive
  // useful destination URLs in the initial HTML, without risking links to drafts.
  let relatedComparison:{slug:string;title:string}|null=null;
  const {data:sameSlugComparison}=await supabase
    .from("comparisons")
    .select("slug,title")
    .eq("status","published")
    .eq("slug",a.slug)
    .maybeSingle();
  if(sameSlugComparison){
    relatedComparison=sameSlugComparison as {slug:string;title:string};
  }else{
    const {data:mappedComparison}=await supabase
      .from("comparisons")
      .select("slug,title")
      .eq("status","published")
      .eq("related_article_slug",a.slug)
      .limit(1)
      .maybeSingle();
    if(mappedComparison) relatedComparison=mappedComparison as {slug:string;title:string};
  }

  const {data:publishedTools}=await supabase
    .from("ai_tools")
    .select("name,slug")
    .eq("status","published")
    .order("featured",{ascending:false})
    .limit(50);
  const topicHaystack=[cleanArticleTitle(a.title),...(a.tags||[])].join(" ").toLowerCase();
  const relatedTools=((publishedTools||[]) as {name:string;slug:string}[])
    .filter(tool=>topicHaystack.includes(tool.name.toLowerCase()))
    .slice(0,4);

  const minutes=readingMinutes(a.content);
  const categorySlug=(a.category||"artikel").toLowerCase().replace(/\s+/g,"-");
  const siteUrl=getSiteUrl();
  const articleUrl=`${siteUrl}/artikel/${a.slug}`;
  const canonicalUrl=(()=>{
    if(!a.canonical_url) return articleUrl;
    try{
      const stored=new URL(a.canonical_url);
      return stored.origin===new URL(siteUrl).origin?stored.toString():articleUrl;
    }catch{
      return articleUrl;
    }
  })();

  const articleSchema={
    "@context":"https://schema.org",
    "@type":"Article",
    headline:cleanArticleTitle(a.title),
    description:a.meta_description||a.excerpt||"",
    url:canonicalUrl,
    mainEntityOfPage:{"@type":"WebPage","@id":canonicalUrl},
    image:a.cover_image?[a.cover_image]:[`${siteUrl}/icon-512.png`],
    datePublished:a.published_at||a.created_at,
    dateModified:a.updated_at||a.published_at||a.created_at,
    inLanguage:"id-ID",
    articleSection:a.category||undefined,
    keywords:a.tags?.join(", ")||undefined,
    wordCount:(a.content||"").trim().split(/\s+/).filter(Boolean).length,
    isAccessibleForFree:true,
    author:{"@type":"Organization",name:"AIUpdateId",url:siteUrl},
    publisher:{
      "@type":"Organization",
      name:"AIUpdateId",
      url:siteUrl,
      logo:{"@type":"ImageObject",url:`${siteUrl}/icon-512.png`}
    }
  };

  const breadcrumbSchema={
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    itemListElement:[
      {"@type":"ListItem",position:1,name:"Beranda",item:siteUrl},
      {"@type":"ListItem",position:2,name:a.category||"Artikel",item:`${siteUrl}/kategori/${categorySlug}`},
      {"@type":"ListItem",position:3,name:cleanArticleTitle(a.title),item:canonicalUrl}
    ]
  };

  const faqSchema=a.faq&&a.faq.length?{
    "@context":"https://schema.org",
    "@type":"FAQPage",
    mainEntity:a.faq.map(item=>({
      "@type":"Question",
      name:item.question,
      acceptedAnswer:{"@type":"Answer",text:item.answer}
    }))
  }:null;

  return (
    <main className="page">
      <ArticleViewTracker id={a.id} current={a.view_count||0}/>
      <ReadingProgress/>
      <article className="container article">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link><span>/</span>
          <Link href={`/kategori/${categorySlug}`}>{a.category}</Link><span>/</span>
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
            {(relatedComparison||relatedTools.length>0)&&<section className="topicLinks" aria-labelledby="jelajahi-topik-terkait">
              <div className="topicLinksHead">
                <small>JELAJAHI TOPIK TERKAIT</small>
                <h2 id="jelajahi-topik-terkait">Lanjutkan dari artikel ini</h2>
              </div>
              <div className="topicLinksGrid">
                {relatedComparison&&<Link href={`/compare/${relatedComparison.slug}`} className="topicLinkCard">
                  <span>Perbandingan</span>
                  <strong>{relatedComparison.title}</strong>
                  <small>Lihat tabel fitur dan verdict →</small>
                </Link>}
                {relatedTools.map(tool=><Link href={`/tools/${tool.slug}`} className="topicLinkCard" key={tool.slug}>
                  <span>Tool AI</span>
                  <strong>{tool.name}</strong>
                  <small>Lihat profil, fitur, dan kegunaan →</small>
                </Link>)}
              </div>
            </section>}
            <ShareButtons title={cleanArticleTitle(a.title)}/>
            <section className="authorBox">
              <div className="authorAvatar">AI</div>
              <div><span>Ditulis oleh</span><h3>Tim AIUpdateId</h3><p>Menyajikan informasi AI dalam bahasa Indonesia secara praktis dan mudah dipahami.</p></div>
            </section>
          </div>
          <aside className="articleSidebar">
            <div><small>RINGKASAN</small><p>{a.excerpt ? cleanArticleTitle(a.excerpt) : ""}</p></div>
            <div><small>KATEGORI</small><Link href={`/kategori/${categorySlug}`}>{a.category}</Link></div>
          </aside>
        </div>
      </article>

      {related.length>0&&<section className="relatedSection"><div className="container">
        <div className="sectionHead"><div><small>LANJUT MEMBACA</small><h2>Artikel terkait</h2></div></div>
        <div className="grid">{related.map(item=><ArticleCard key={item.id} a={item}/>)}</div>
      </div></section>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema)}}/>
      {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>}
    </main>
  );
}
