"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import type { AITool } from "@/lib/tool-types";
import type { AdvisorInput, AdvisorTaskKey } from "@/lib/advisor-engine";
import { buildWorkflow, rankIntelligence, type IntelligenceProfile } from "@/lib/advisor-intelligence";
import styles from "@/components/Advisor.module.css";

const TASKS:Array<{value:AdvisorTaskKey;label:string;helper:string}>=[
{value:"research",label:"Riset & sumber",helper:"Cari, bandingkan, dan verifikasi informasi."},{value:"documents",label:"Dokumen & PDF",helper:"Analisis file dan sumber panjang."},{value:"writing",label:"Menulis",helper:"Artikel, copy, editing, dan drafting."},{value:"coding",label:"Coding",helper:"Implementasi, debugging, dan review."},{value:"study",label:"Belajar",helper:"Memahami materi dan sumber."},{value:"image",label:"Gambar",helper:"Visual, desain, dan image generation."},{value:"video",label:"Video",helper:"Video generatif dan konten pendek."},{value:"marketing",label:"Marketing",helper:"SEO, kampanye, brand, dan konten."},{value:"productivity",label:"Produktivitas",helper:"Workflow dan pekerjaan harian."}];
const defaults:AdvisorInput={task:"research",priorities:{freePlan:true,easyToUse:true,indonesian:true,evidence:true,documentHeavy:false}};
const MODES:Array<{value:IntelligenceProfile["mode"];label:string}>=[{value:"balanced",label:"Seimbang"},{value:"quality",label:"Kualitas"},{value:"budget",label:"Hemat"},{value:"simple",label:"Paling mudah"}];
const OUTCOMES=[{value:"success",label:"Berhasil"},{value:"partial",label:"Sebagian"},{value:"failed",label:"Gagal"},{value:"switched_tool",label:"Ganti tool"}] as const;

export default function AdvisorClient({tools}:{tools:AITool[]}){
 const[input,setInput]=useState(defaults); const[mode,setMode]=useState<IntelligenceProfile["mode"]>("balanced");
 const[sent,setSent]=useState<Record<string,boolean>>({}); const[outcomeSent,setOutcomeSent]=useState<Record<string,boolean>>({});
 const profile=useMemo(()=>({...input,mode}),[input,mode]); const results=useMemo(()=>rankIntelligence(tools,profile,5),[tools,profile]); const workflow=useMemo(()=>buildWorkflow(input.task,results),[input.task,results]);
 const toggle=(key:keyof AdvisorInput["priorities"])=>setInput(c=>({...c,priorities:{...c.priorities,[key]:!c.priorities[key]}}));
 async function feedback(toolId:string,helpful:boolean){if(sent[toolId])return;setSent(c=>({...c,[toolId]:true}));try{await fetch("/api/advisor/feedback",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({taskKey:input.task,toolId,helpful,taskProfile:{...input.priorities,mode}})})}catch{}}
 async function outcome(toolId:string,value:string){if(outcomeSent[toolId])return;setOutcomeSent(c=>({...c,[toolId]:true}));try{await fetch("/api/advisor/outcome",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({taskKey:input.task,toolId,outcome:value,source:"advisor",context:{mode,...input.priorities}})})}catch{}}
 return <div className={styles.shell}>
  <section className={styles.controls}>
   <div className={styles.controlHeader}><div><span className={styles.eyebrow}>AI DECISION ENGINE V2</span><h2>Apa yang ingin Anda selesaikan?</h2></div><Sparkles/></div>
   <div className={styles.taskGrid}>{TASKS.map(t=><button key={t.value} className={input.task===t.value?styles.taskActive:styles.task} onClick={()=>setInput(c=>({...c,task:t.value}))}><strong>{t.label}</strong><span>{t.helper}</span></button>)}</div>
   <div className={styles.priorityBlock}><span className={styles.eyebrow}>STRATEGI KEPUTUSAN</span><div className={styles.pills}>{MODES.map(m=><button key={m.value} aria-pressed={mode===m.value} onClick={()=>setMode(m.value)}>{m.label}</button>)}</div></div>
   <div className={styles.priorityBlock}><span className={styles.eyebrow}>KONDISI ANDA</span><div className={styles.pills}><button aria-pressed={input.priorities.freePlan} onClick={()=>toggle("freePlan")}>Paket gratis</button><button aria-pressed={input.priorities.easyToUse} onClick={()=>toggle("easyToUse")}>Mudah</button><button aria-pressed={input.priorities.indonesian} onClick={()=>toggle("indonesian")}>Indonesia</button><button aria-pressed={input.priorities.evidence} onClick={()=>toggle("evidence")}>Butuh bukti</button><button aria-pressed={input.priorities.documentHeavy} onClick={()=>toggle("documentHeavy")}>Banyak file</button></div></div>
   <div className={styles.localNote}><ShieldCheck size={18}/><p><strong>Tanpa API AI berbayar.</strong> Ranking dihitung lokal dari profil tool, freshness, evidence, value, ease, Indonesia fit, risiko, dan kebutuhan Anda.</p></div>
  </section>
  <section className={styles.results} aria-live="polite">
   <div className={styles.resultsHead}><div><span className={styles.eyebrow}>MULTI-OBJECTIVE RANKING</span><h2>Keputusan yang berubah mengikuti kondisi Anda</h2></div><span className={styles.dataBadge}>{tools.length} tool dianalisis</span></div>
   {results.map((r,i)=><article className={i===0?styles.bestCard:styles.card} key={r.tool.id}><div className={styles.rank}>{i+1}</div><div className={styles.cardMain}>
    <div className={styles.titleRow}><div>{i===0&&<span className={styles.bestLabel}>REKOMENDASI UTAMA</span>}<h3>{r.tool.name}</h3><p>{r.tool.short_description||r.tool.description||"Profil AI dari AIUpdateId."}</p></div><div className={styles.scoreBox}><strong>{r.total}</strong><span>/100 Decision</span></div></div>
    <div className={styles.metricGrid}><span>Fit <b>{r.fit}</b></span><span>Value <b>{r.value}</b></span><span>Ease <b>{r.ease}</b></span><span>Indonesia <b>{r.indonesia}</b></span><span>Evidence <b>{r.evidence}</b></span><span>Freshness <b>{r.freshness}</b></span><span>Risk <b>{r.risk}</b></span></div>
    <div className={styles.reasonGrid}><div><h4>Trade-off keputusan</h4>{r.tradeoffs.length?r.tradeoffs.map(x=><p key={x}>{x}</p>):<p>Belum ada trade-off besar yang terdeteksi dari data saat ini.</p>}</div><div><h4>Kenapa skor dapat berubah?</h4><p>Ranking dihitung ulang saat task, budget, kemudahan, bahasa, bukti, atau strategi keputusan berubah.</p></div></div>
    <div className={styles.actions}><Link href={`/tools/${r.tool.slug}`}>Periksa profil & keterbatasan <ChevronRight size={16}/></Link><div className={styles.feedback}><span>{sent[r.tool.id]?"Tersimpan":"Hasil ini cocok?"}</span><button disabled={sent[r.tool.id]} onClick={()=>feedback(r.tool.id,true)}><ThumbsUp size={15}/></button><button disabled={sent[r.tool.id]} onClick={()=>feedback(r.tool.id,false)}><ThumbsDown size={15}/></button></div></div>
    <div className={styles.outcomeRow}><span>{outcomeSent[r.tool.id]?"Outcome tersimpan":"Kalau sudah dicoba, hasilnya?"}</span>{OUTCOMES.map(o=><button key={o.value} disabled={outcomeSent[r.tool.id]} onClick={()=>outcome(r.tool.id,o.value)}>{o.label}</button>)}</div>
   </div></article>)}
   {!!workflow.length&&<div className={styles.workflow}><span className={styles.eyebrow}>MULTI-AI WORKFLOW</span><h3>Rute kerja yang disarankan</h3><div>{workflow.map((w,i)=><span key={w.stage}><b>{i+1}</b><small>{w.stage}</small><strong>{w.tool}</strong></span>)}</div><p>Workflow adalah starting point berbasis ranking saat ini; gunakan profil tool untuk memeriksa fitur dan batas terbaru.</p></div>}
   <p className={styles.disclaimer}>Decision Score bukan klaim AI terbaik secara universal. AIUpdateId memisahkan kecocokan, evidence, freshness, value, ease, Indonesia fit, dan risk agar keputusan dapat dijelaskan.</p>
  </section>
 </div>
}