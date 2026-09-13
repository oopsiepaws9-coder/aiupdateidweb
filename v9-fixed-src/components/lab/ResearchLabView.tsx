"use client";

import {useMemo,useState} from "react";
import {AlertTriangle,CheckCircle2,FileSearch,FlaskConical,ShieldCheck} from "lucide-react";
import {buildCustomReport,defaultReport,type ClaimStatus,type ResearchReport} from "@/app/lab/research-data";

const statusOrder: ClaimStatus[]=["TERVERIFIKASI","DIDUKUNG SEBAGIAN","BERTENTANGAN","BELUM TERVERIFIKASI"];

export default function ResearchLabView(){
  const[question,setQuestion]=useState(defaultReport.question);
  const[source,setSource]=useState("");
  const[report,setReport]=useState<ResearchReport>(defaultReport);
  const[filter,setFilter]=useState<ClaimStatus|"SEMUA">("SEMUA");
  const visibleClaims=useMemo(()=>filter==="SEMUA"?report.claims:report.claims.filter(c=>c.status===filter),[filter,report]);
  const counts=useMemo(()=>Object.fromEntries(statusOrder.map(s=>[s,report.claims.filter(c=>c.status===s).length])),[report]);
  function analyze(){setReport(buildCustomReport(question,source));setFilter("SEMUA");setTimeout(()=>document.getElementById("research-report")?.scrollIntoView({behavior:"smooth",block:"start"}),20)}
  function loadDemo(){setQuestion(defaultReport.question);setSource("");setReport(defaultReport);setFilter("SEMUA")}

  return <div className="labWrap">
    <section className="labHero">
      <div className="labEyebrow"><FlaskConical size={16}/> AIUPDATEID LABS · PROTOTYPE</div>
      <h1>Research & Verification Lab</h1>
      <p>Memisahkan <strong>klaim</strong>, <strong>bukti</strong>, <strong>sumber</strong>, konflik, freshness, dan bagian yang masih perlu diperiksa manusia.</p>
      <div className="labGuard"><ShieldCheck size={17}/><span>Tanpa Gemini API · Tanpa Supabase · Tanpa billing · Data demo tidak dianggap sebagai fakta.</span></div>
    </section>

    <section className="labInput card">
      <div className="sectionHead"><div><small>LANGKAH 1</small><h2>Masukkan pertanyaan riset</h2></div><button type="button" onClick={loadDemo}>Muat demo</button></div>
      <label>Pertanyaan / topik<textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={3}/></label>
      <label>Sumber / URL / kutipan sumber<textarea value={source} onChange={e=>setSource(e.target.value)} rows={5} placeholder="Tempel URL atau potongan sumber. Pada prototype ini, input belum dianalisis otomatis dan tetap memerlukan verifikasi manusia."/></label>
      <button type="button" className="analyze" onClick={analyze}><FileSearch size={18}/> Analyze Evidence</button>
      <p className="micro">Prototype deterministik: sistem tidak akan mengubah teks menjadi “fakta terverifikasi” hanya karena sebuah sumber ditempel.</p>
    </section>

    <section id="research-report" className="reportBlock">
      <div className="reportTop"><div><small>RESEARCH REPORT</small><h2>{report.question}</h2></div><span className="demoBadge">SAMPLE / VALIDATION MODE</span></div>
      <div className="summary card"><h3>Ringkasan</h3><p>{report.summary}</p></div>

      <div className="statusGrid">
        {statusOrder.map(s=><button type="button" key={s} onClick={()=>setFilter(s)} className={filter===s?"active":""}><b>{counts[s]??0}</b><span>{s}</span></button>)}
      </div>
      <button type="button" className="showAll" onClick={()=>setFilter("SEMUA")}>Tampilkan semua klaim</button>

      <div className="matrix card">
        <div className="sectionHead"><div><small>CLAIM–EVIDENCE MATRIX</small><h2>Klaim tidak boleh berdiri tanpa bukti</h2></div></div>
        <div className="claimList">{visibleClaims.map(claim=>{
          const src=report.sources.find(s=>s.id===claim.sourceId);
          return <article key={claim.id} className="claimCard">
            <div className="claimMeta"><span className={`status s-${claim.status.toLowerCase().replaceAll(" ","-")}`}>{claim.status}</span><span>Human review: <b>{claim.humanReview?"YA":"TIDAK"}</b></span></div>
            <h3>{claim.claim}</h3>
            <dl><div><dt>Evidence</dt><dd>{claim.evidence}</dd></div><div><dt>Source</dt><dd>{src?`${src.title} · Tier ${src.tier}`:"Belum ada sumber"}</dd></div><div><dt>Source type</dt><dd>{src?.sourceType??"Belum ditentukan"}</dd></div><div><dt>Alasan status</dt><dd>{claim.explanation}</dd></div></dl>
          </article>})}</div>
      </div>

      <div className="twoCol">
        <section className="card"><h3>Source Quality</h3>{report.sources.length?report.sources.map(s=><div className="sourceRow" key={s.id}><b>Tier {s.tier}</b><div><strong>{s.title}</strong><p>{s.sourceType} · {s.freshness}</p><small>{s.note}</small></div></div>):<p className="muted">Belum ada sumber.</p>}</section>
        <section className="card"><h3>Contradictions</h3>{report.contradictions.length?report.contradictions.map(x=><p className="warning" key={x}><AlertTriangle size={16}/>{x}</p>):<p className="muted">Belum ada pertentangan yang teridentifikasi.</p>}</section>
      </div>

      <div className="threeCol">
        <section className="card"><h3>Unverified Claims</h3>{report.unverified.map(x=><p key={x}>• {x}</p>)}</section>
        <section className="card"><h3>Freshness Warning</h3>{report.freshnessWarnings.map(x=><p key={x}>• {x}</p>)}</section>
        <section className="card"><h3>Human Review Required</h3>{report.humanReview.map(x=><p key={x}><CheckCircle2 size={14}/> {x}</p>)}</section>
      </div>

      <section className="finalNote card"><small>FINAL RESEARCH NOTES</small><p>{report.finalNotes}</p></section>
    </section>

    <style jsx>{`
      .labWrap{max-width:1180px;margin:0 auto;padding:58px 20px 90px}.labHero{padding:28px 0 30px}.labEyebrow{display:inline-flex;gap:8px;align-items:center;color:#46b8ff;font-size:12px;font-weight:900;letter-spacing:.08em}.labHero h1{font-size:clamp(38px,7vw,72px);line-height:1.02;margin:14px 0 14px;letter-spacing:-.045em}.labHero>p{max-width:780px;font-size:18px;line-height:1.7;color:var(--muted)}.labGuard{display:flex;gap:9px;align-items:flex-start;margin-top:18px;color:var(--muted);font-size:13px}.card{background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:24px;box-shadow:var(--shadow)}.labInput{display:grid;gap:15px}.sectionHead{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.sectionHead small,.reportTop small,.finalNote small{color:var(--primary);font-weight:900;letter-spacing:.08em}.sectionHead h2,.reportTop h2{margin:4px 0 0}.sectionHead button,.showAll{border:1px solid var(--line);background:var(--soft);color:var(--text);padding:8px 12px;border-radius:10px;font-weight:800;cursor:pointer}.labInput label{display:grid;gap:7px;font-size:13px;font-weight:850}.labInput textarea{width:100%;resize:vertical;border:1px solid var(--line);background:var(--bg);color:var(--text);padding:14px;border-radius:13px;line-height:1.55}.analyze{display:flex;gap:8px;align-items:center;justify-content:center;min-height:50px;border:0;border-radius:13px;background:linear-gradient(135deg,#0c5ec8,#1986ef 65%,#5d2fe0);color:white;font-weight:900;cursor:pointer}.micro,.muted{color:var(--muted);font-size:12px}.reportBlock{padding-top:32px;scroll-margin-top:110px}.reportTop{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px}.demoBadge{font-size:10px;font-weight:900;letter-spacing:.08em;color:#63d2ff;border:1px solid #2a6b8d;background:#08263a;padding:7px 10px;border-radius:999px}.summary{margin-bottom:14px}.summary h3,.card h3{margin-top:0}.summary p{margin-bottom:0;color:var(--muted);line-height:1.7}.statusGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0 8px}.statusGrid button{padding:15px;border-radius:14px;border:1px solid var(--line);background:var(--surface);color:var(--text);text-align:left;cursor:pointer}.statusGrid button.active{outline:2px solid var(--primary)}.statusGrid b{display:block;font-size:25px}.statusGrid span{font-size:10px;font-weight:850}.showAll{margin-bottom:16px}.matrix{margin-bottom:14px}.claimList{display:grid;gap:12px;margin-top:16px}.claimCard{border:1px solid var(--line);background:var(--bg);border-radius:16px;padding:18px}.claimCard h3{font-size:17px;line-height:1.45}.claimMeta{display:flex;justify-content:space-between;gap:10px;font-size:11px;color:var(--muted)}.status{font-size:9px;font-weight:950;letter-spacing:.05em;padding:5px 8px;border-radius:999px;background:var(--soft);color:var(--text)}dl{display:grid;gap:8px;margin:12px 0 0}dl div{display:grid;grid-template-columns:110px 1fr;gap:10px;padding-top:8px;border-top:1px solid var(--line)}dt{font-size:11px;color:var(--muted);font-weight:850}dd{margin:0;font-size:12px;line-height:1.55}.twoCol{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}.threeCol{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px}.threeCol p{font-size:12px;line-height:1.6;color:var(--muted);display:flex;gap:6px}.sourceRow{display:grid;grid-template-columns:64px 1fr;gap:10px;padding:11px 0;border-bottom:1px solid var(--line)}.sourceRow>b{color:var(--primary);font-size:11px}.sourceRow p,.sourceRow small{margin:3px 0;color:var(--muted);font-size:11px}.warning{display:flex;gap:8px;color:var(--muted);font-size:12px;line-height:1.55}.finalNote p{margin-bottom:0;line-height:1.7;color:var(--muted)}
      @media(max-width:760px){.labWrap{padding:36px 14px 64px}.labHero>p{font-size:16px}.card{padding:17px;border-radius:17px}.statusGrid{grid-template-columns:1fr 1fr}.twoCol,.threeCol{grid-template-columns:1fr}.reportTop{display:grid}.sectionHead{align-items:center}.claimMeta{display:grid}dl div{grid-template-columns:1fr}dt{margin-bottom:-4px}}
    `}</style>
  </div>
}
