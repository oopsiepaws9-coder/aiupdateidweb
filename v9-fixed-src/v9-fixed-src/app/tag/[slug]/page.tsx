"use client";

import ArticleCard from "@/components/ArticleCard";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import { useEffect, useState } from "react";

function humanize(slug:string){
  return decodeURIComponent(slug).replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
}

export default function TagPage({params}:{params:{slug:string}}){
  const label=humanize(params.slug);
  const[items,setItems]=useState<Article[]>([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    supabase.from("articles").select("*")
      .eq("status","published")
      .contains("tags",[label])
      .order("published_at",{ascending:false})
      .then(({data})=>{setItems(data||[]);setLoading(false)});
  },[label]);

  return <main className="page"><section className="container intro"><small>TAG</small><h1>{label}</h1><p>Kumpulan artikel AIUpdateId dengan tag {label}.</p></section><section className="container compact">{loading?<div className="empty">Memuat...</div>:<div className="grid">{items.map(a=><ArticleCard key={a.id} a={a}/>)}</div>}{!loading&&!items.length&&<div className="empty">Belum ada artikel dengan tag ini.</div>}</section></main>
}
