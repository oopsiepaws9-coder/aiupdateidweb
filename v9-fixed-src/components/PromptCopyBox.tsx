"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
export default function PromptCopyBox({text}:{text:string}){
 const[copied,setCopied]=useState(false);
 const copy=async()=>{await navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1700)};
 return <div className="promptCopyBox"><div className="promptCopyTop"><span>PROMPT SIAP SALIN</span><button onClick={copy}>{copied?<Check size={17}/>:<Copy size={17}/>} {copied?"Tersalin":"Salin prompt"}</button></div><pre>{text}</pre></div>;
}
