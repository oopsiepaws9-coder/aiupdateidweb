import ArticleCard from "@/components/ArticleCard";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";

export const revalidate=300;

function humanize(slug:string){
  return decodeURIComponent(slug).replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
}

export default async function TagPage(props:{params: Promise<{slug:string}>}) {
  const params = await props.params;
  const label=humanize(params.slug);
  const supabase=createServerSupabase();
  let items:Article[]=[];

  if(supabase){
    const {data}=await supabase
      .from("articles")
      .select("*")
      .eq("status","published")
      .contains("tags",[label])
      .order("published_at",{ascending:false,nullsFirst:false});
    items=(data||[]) as Article[];
  }

  return <main className="page"><section className="container intro"><small>TAG</small><h1>{label}</h1><p>Kumpulan artikel AIUpdateId dengan tag {label}.</p></section><section className="container compact"><div className="grid">{items.map(a=><ArticleCard key={a.id} a={a}/>)}</div>{!items.length&&<div className="empty">Belum ada artikel dengan tag ini.</div>}</section></main>;
}
