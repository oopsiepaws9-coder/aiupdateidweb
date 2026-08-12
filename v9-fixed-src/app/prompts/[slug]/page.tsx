import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import PromptCopyBox from "@/components/PromptCopyBox";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";
import type { PromptItem } from "@/lib/prompt-types";

export const revalidate=300;

async function getPrompt(slug:string):Promise<PromptItem|null>{
 const supabase=createServerSupabase(); if(!supabase)return null;
 const {data}=await supabase.from("ai_prompts").select("*").eq("slug",slug).eq("status","published").maybeSingle();
 return (data as PromptItem|null)||null;
}

export async function generateMetadata(props:{params: Promise<{slug:string}>}):Promise<Metadata> {
 const params = await props.params;
 const p=await getPrompt(params.slug);if(!p)return{title:"Prompt tidak ditemukan",robots:{index:false,follow:false}};
 const title=(p.seo_title||`${p.title} - Prompt AI Siap Salin`).replace(/\u00e2\u20ac[\u201c\u201d]/g,"-").replace(/(?:\s*\|\s*AIUpdateId)+\s*$/i,"");
 const description=p.meta_description||p.description||`Prompt AI ${p.title} siap digunakan dan disesuaikan.`;
 return{title,description,alternates:{canonical:`/prompts/${p.slug}`},openGraph:{title,description,type:"article"}};
}

export default async function PromptDetail(props:{params: Promise<{slug:string}>}) {
 const params = await props.params;
 const p=await getPrompt(params.slug);if(!p)notFound();
 const base=getSiteUrl();
 const schema={"@context":"https://schema.org","@type":"HowTo",name:p.title,description:p.description,url:`${base}/prompts/${p.slug}`,step:[{"@type":"HowToStep",name:"Sesuaikan variabel",text:"Ganti bagian dalam tanda kurung siku dengan kebutuhan Anda."},{"@type":"HowToStep",name:"Salin prompt",text:"Salin prompt ke tool AI yang sesuai."},{"@type":"HowToStep",name:"Evaluasi hasil",text:"Periksa hasil, lalu beri konteks tambahan atau revisi bila diperlukan."}]};
 return <main className="page promptDetailPage"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><section className="container promptDetailWrap">
   <Link className="back" href="/prompts"><ArrowLeft size={17}/> Kembali ke Prompt Library</Link>
   <header className="promptDetailHero">
    <div><div className="promptDetailMeta"><span>{p.category||"Prompt AI"}</span>{p.level&&<span>{p.level}</span>}{p.featured&&<span className="promptFeaturedBadge"><Sparkles size={13}/> Pilihan Editor</span>}</div><h1>{p.title}</h1><p>{p.description}</p></div>
    <aside><small>DIREKOMENDASIKAN UNTUK</small><b>{p.tool_name||p.tool_slug||"AI Chatbot"}</b>{p.tool_slug&&<Link href={`/tools/${p.tool_slug}`}>Lihat tool <ArrowUpRight size={15}/></Link>}</aside>
   </header>
   <div className="promptDetailLayout"><article className="promptDetailMain">
    <PromptCopyBox text={p.prompt_text}/>
    {p.variables?.length?<section className="promptDetailCard"><h2>Variabel yang perlu diganti</h2><div className="promptVariableList">{p.variables.map(v=><span key={v}>[{v}]</span>)}</div></section>:null}
    {p.example_input?<section className="promptDetailCard"><h2>Contoh penggunaan</h2><div className="exampleBox"><b>Contoh input</b><p>{p.example_input}</p></div>{p.example_output&&<div className="exampleBox"><b>Contoh arah hasil</b><p>{p.example_output}</p></div>}</section>:null}
    {p.tips?.length?<section className="promptDetailCard"><h2>Tips mendapatkan hasil lebih baik</h2><div className="promptTips">{p.tips.map(t=><div key={t}><Lightbulb size={17}/><span>{t}</span></div>)}</div></section>:null}
    <section className="promptResponsible"><span>PANDANGAN AIUPDATEID</span><p>Prompt adalah titik awal, bukan jaminan jawaban selalu benar. Beri konteks yang cukup, periksa fakta penting, dan jangan langsung memakai hasil AI untuk keputusan berisiko tanpa verifikasi.</p></section>
    {p.faq?.length?<section className="promptDetailCard promptFaq"><h2>FAQ</h2>{p.faq.map((f,i)=><details key={i}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</section>:null}
   </article>
   <aside className="promptDetailSidebar"><h3>Ringkasan</h3><dl><dt>Kategori</dt><dd>{p.category||"Prompt AI"}</dd><dt>Level</dt><dd>{p.level||"Pemula"}</dd>{p.tool_name&&<><dt>Tool</dt><dd>{p.tool_name}</dd></>}</dl>{p.tags?.length?<div className="promptTagList">{p.tags.map(t=><span key={t}>{t}</span>)}</div>:null}<div className="promptChecklist"><b>Sebelum kirim</b><span><CheckCircle2 size={15}/> Ganti semua variabel</span><span><CheckCircle2 size={15}/> Tambahkan konteks</span><span><CheckCircle2 size={15}/> Tentukan format hasil</span></div></aside>
   </div>
 </section></main>;
}
