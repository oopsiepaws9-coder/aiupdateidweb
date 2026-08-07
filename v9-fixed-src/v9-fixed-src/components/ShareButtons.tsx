"use client";
import { Facebook, Link2, Send, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({title}:{title:string}){
  const[copied,setCopied]=useState(false);
  const url=typeof window!=="undefined"?window.location.href:"";
  const share=async()=>{
    if(navigator.share) await navigator.share({title,url});
    else {await navigator.clipboard.writeText(url);setCopied(true)}
  };
  const open=(target:string)=>window.open(target,"_blank","noopener,noreferrer");
  return <div className="shareBox"><span>Bagikan artikel</span><div>
    <button onClick={share}><Share2 size={17}/><b>Bagikan</b></button>
    <button onClick={()=>open(`https://wa.me/?text=${encodeURIComponent(title+" "+url)}`)}><Send size={17}/><b>WhatsApp</b></button>
    <button onClick={()=>open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}><Facebook size={17}/><b>Facebook</b></button>
    <button onClick={()=>open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)}><span className="xIcon">X</span><b>X</b></button>
    <button onClick={async()=>{await navigator.clipboard.writeText(url);setCopied(true)}}><Link2 size={17}/><b>{copied?"Tersalin":"Salin link"}</b></button>
  </div></div>
}
