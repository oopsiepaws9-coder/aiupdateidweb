"use client";
import { Copy, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { promptLibrary } from "@/lib/portal-data";
export default function Page(){
 const[q,setQ]=useState("");const[copied,setCopied]=useState("");
 const items=useMemo(()=>promptLibrary.filter(p=>`${p.title} ${p.category} ${p.description}`.toLowerCase().includes(q.toLowerCase())),[q]);
 const copy=async(slug:string,prompt:string)=>{await navigator.clipboard.writeText(prompt);setCopied(slug);setTimeout(()=>setCopied(""),1500)};
 return <main className="page"><section className="container intro"><small>PROMPT LIBRARY</small><h1>Prompt AI siap salin untuk pekerjaan sehari-hari.</h1><p>Gunakan prompt sebagai titik awal, lalu sesuaikan bagian di dalam tanda kurung siku.</p><label className="search promptSearch"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari prompt..."/></label></section><section className="container compact"><div className="promptGrid full">{items.map(p=><article className="promptCard" key={p.slug}><small>{p.category}</small><h2>{p.title}</h2><p>{p.description}</p><pre>{p.prompt}</pre><button onClick={()=>copy(p.slug,p.prompt)}><Copy size={16}/>{copied===p.slug?"Tersalin":"Salin prompt"}</button></article>)}</div></section></main>
}
