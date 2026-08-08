import Link from "next/link";
import { Tag } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";

export const revalidate=300;

export default async function TagIndex(){
  const supabase=createServerSupabase();
  let articles:Pick<Article,"id"|"tags">[]=[];
  if(supabase){
    const {data}=await supabase.from("articles").select("id,tags").eq("status","published");
    articles=(data||[]) as Pick<Article,"id"|"tags">[];
  }

  const counts=new Map<string,number>();
  articles.forEach(a=>(a.tags||[]).forEach(tag=>counts.set(tag,(counts.get(tag)||0)+1)));
  const tags=Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]);

  return <main className="page"><section className="container intro"><small>TAG</small><h1>Jelajahi topik AI berdasarkan tag.</h1><p>Temukan artikel yang saling berkaitan berdasarkan tema dan teknologi.</p></section><section className="container compact"><div className="tagCloud">{tags.map(([tag,count])=><Link href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g,"-"))}`} key={tag}><Tag size={16}/><span>{tag}</span><b>{count}</b></Link>)}</div>{!tags.length&&<div className="empty">Belum ada tag.</div>}</section></main>;
}
