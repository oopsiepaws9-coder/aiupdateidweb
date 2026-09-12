"use client";
import Link from "next/link";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Logo(){
  return <Link className="logo" href="/" aria-label="AIUpdateId — Beranda"><img src="/aiupdateid-icon-v2-192.png" alt="" className="brandMark"/><span className="brandWord"><span className="brandAi">AI</span>Update<span className="brandId">ID</span></span></Link>
}

export default function Header(){
  const[open,setOpen]=useState(false);
  const[dark,setDark]=useState(false);
  useEffect(()=>{
    const d=localStorage.getItem("theme")==="dark";
    setDark(d);
    document.documentElement.dataset.theme=d?"dark":"light";
  },[]);
  const toggle=()=>{
    const n=!dark;
    setDark(n);
    document.documentElement.dataset.theme=n?"dark":"light";
    localStorage.setItem("theme",n?"dark":"light");
  };
  return <>
    <div className="topbar"><span>Portal AI Indonesia</span></div>
    <header><div className="container nav">
      <Logo/>
        <nav className={open?"open":""}>
          <Link href="/" onClick={()=>setOpen(false)}>Beranda</Link>
          <Link href="/artikel" onClick={()=>setOpen(false)}>Artikel</Link>
          <Link href="/kategori/berita-ai" onClick={()=>setOpen(false)}>Berita AI</Link>
          <Link href="/tools" onClick={()=>setOpen(false)}>Tools AI</Link>
          <Link href="/models" onClick={()=>setOpen(false)}>Model AI</Link>
          <Link href="/glossary" onClick={()=>setOpen(false)}>Glosarium</Link>
          <Link href="/compare" onClick={()=>setOpen(false)}>Perbandingan</Link>
          <Link href="/prompts" onClick={()=>setOpen(false)}>Prompt AI</Link>
          <Link href="/workflow" onClick={()=>setOpen(false)}>Workflow</Link>
          <Link href="/tentang" onClick={()=>setOpen(false)}>Tentang</Link>
        </nav>
      <div className="actions">
        <Link className="iconLink" href="/search" aria-label="Cari"><Search size={20}/></Link>
        <button onClick={toggle} aria-label="Ganti tema">{dark?<Sun size={20}/>:<Moon size={20}/>}</button>
        <button className="mobile" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
    </div></header>
  </>
}
