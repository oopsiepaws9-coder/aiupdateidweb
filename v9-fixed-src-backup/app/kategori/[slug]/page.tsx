"use client";
import { useEffect,useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";
const map:Record<string,string>={"berita-ai":"Berita AI","tools-ai":"Tools AI","tutorial":"Tutorial","review":"Review","prompt-ai":"Prompt AI"};
export default function Page({params}:{params:{slug:string}}){
  const title=map[params.slug]||"Artikel";const[items,setItems]=useState<Article[]>([]);
  useEffect(()=>{supabase.from("articles").select("*").eq("status","published").eq("category",title).order("published_at",{ascending:false}).then(({data})=>setItems(data||[]))},[title]);
  return <main className="page"><section className="container intro"><small>KATEGORI</small><h1>{title}</h1><p>Kumpulan artikel {title.toLowerCase()} dari AIUpdateId.</p></section><section className="container compact"><div className="grid">{items.map(a=><ArticleCard key={a.id} a={a}/>)}</div>{!items.length&&<div className="empty">Belum ada artikel.</div>}</section></main>
}
