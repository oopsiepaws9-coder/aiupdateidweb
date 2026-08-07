"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";

export default function TagIndex(){
  const[articles,setArticles]=useState<Article[]>([]);
  useEffect(()=>{supabase.from("articles").select("id,tags").eq("status","published").then(({data})=>setArticles((data||[]) as Article[]))},[]);
  const tags=useMemo(()=>{
    const counts=new Map<string,number>();
    articles.forEach(a=>(a.tags||[]).forEach(tag=>counts.set(tag,(counts.get(tag)||0)+1)));
    return Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]);
  },[articles]);

  return <main className="page"><section className="container intro"><small>TAG</small><h1>Jelajahi topik AI berdasarkan tag.</h1><p>Temukan artikel yang saling berkaitan berdasarkan tema dan teknologi.</p></section><section className="container compact"><div className="tagCloud">{tags.map(([tag,count])=><Link href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g,"-"))}`} key={tag}><Tag size={16}/><span>{tag}</span><b>{count}</b></Link>)}</div>{!tags.length&&<div className="empty">Belum ada tag.</div>}</section></main>
}
