import ArticleCard from "@/components/ArticleCard";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";

export const revalidate=300;

const categories:Record<string,{title:string;aliases:string[]}>= {
  "berita-ai":{title:"Berita AI",aliases:["Berita AI"]},
  "tools-ai":{title:"Tools AI",aliases:["Tools AI","AI Tools"]},
  "ai-tools":{title:"AI Tools",aliases:["AI Tools","Tools AI"]},
  "tutorial":{title:"Tutorial",aliases:["Tutorial"]},
  "review":{title:"Review & Perbandingan AI",aliases:["Review","Perbandingan AI"]},
  "perbandingan-ai":{title:"Perbandingan AI",aliases:["Perbandingan AI","Review"]},
  "prompt-ai":{title:"Prompt AI",aliases:["Prompt AI","Prompt"]},
  "prompt":{title:"Prompt",aliases:["Prompt","Prompt AI"]},
  "belajar-ai":{title:"Belajar AI",aliases:["Belajar AI"]},
  "ai-models":{title:"AI Models",aliases:["AI Models"]},
};

function fallbackTitle(slug:string){
  return decodeURIComponent(slug).replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
}

export default async function Page(props:{params: Promise<{slug:string}>}) {
  const params = await props.params;
  const config=categories[params.slug]||{title:fallbackTitle(params.slug),aliases:[fallbackTitle(params.slug)]};
  const supabase=createServerSupabase();
  let items:Article[]=[];

  if(supabase){
    const {data}=await supabase
      .from("articles")
      .select("*")
      .eq("status","published")
      .in("category",config.aliases)
      .order("published_at",{ascending:false,nullsFirst:false});
    items=(data||[]) as Article[];
  }

  return <main className="page"><section className="container intro"><small>KATEGORI</small><h1>{config.title}</h1><p>Kumpulan artikel {config.title.toLowerCase()} dari AIUpdateId.</p></section><section className="container compact"><div className="grid">{items.map(a=><ArticleCard key={a.id} a={a}/>)}</div>{!items.length&&<div className="empty">Belum ada artikel.</div>}</section></main>;
}
