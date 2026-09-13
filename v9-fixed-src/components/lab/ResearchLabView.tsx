"use client";

import {useMemo,useState} from "react";
import {AlertTriangle,CheckCircle2,ChevronDown,FileSearch,FlaskConical,ShieldCheck} from "lucide-react";
import {buildCustomReport,defaultReport,type ClaimStatus,type ResearchReport} from "@/app/lab/research-data";

const statusOrder: ClaimStatus[]=["TERVERIFIKASI","DIDUKUNG SEBAGIAN","BERTENTANGAN","BELUM TERVERIFIKASI"];
const shortStatus:Record<ClaimStatus,string>={TERVERIFIKASI:"Terverifikasi","DIDUKUNG SEBAGIAN":"Sebagian","BERTENTANGAN":"Bertentangan","BELUM TERVERIFIKASI":"Belum terverifikasi"};

export default function ResearchLabView(){
  const[question,setQuestion]=useState(defaultReport.question);
  const[source,setSource]=useState("");
  const[report,setReport]=useState<ResearchReport>(defaultReport);
  const[filter,setFilter]=useState<ClaimStatus|"SEMUA">("SEMUA");
  const[hasRun,setHasRun]=useState(false);
  const visibleClaims=useMemo(()=>filter==="SEMUA"?report.claims:report.claims.filter(c=>c.status===filter),[filter,report]);
  const counts=useMemo(()=>Object.fromEntries(statusOrder.map(s=>[s,report.claims.filter(c=>c.status===s).length])),[report]);

  function showReport(next:ResearchReport){
    setReport(next);setFilter("SEMUA");setHasRun(true);
    setTimeout(()=>document.getElementById("research-report")?.scrollIntoView({behavior:"smooth",block:"start"}),40);
  }
  function analyze(){showReport(buildCustomReport(question,source))}
  function loadDemo(){setQuestion(defaultReport.question);setSource("");showReport(defaultReport)}

  return <div className="labWrap">
    <section className="labHero">
      <div className="labEyebrow"><FlaskConical size={15}/> AIUPDATEID LABS · PROTOTYPE</div>
      <h1>Research & Verification Lab</h1>
      <p>Periksa apakah sebuah jawaban benar-benar punya bukti—bukan sekadar terdengar meyakinkan.</p>
      <div className="labGuard"><ShieldCheck size={16}/><span>Tanpa Gemini API · Tanpa billing · Data demo bukan fakta live.</span></div>
    </section>

    <section className="labInput card">
      <div className="stepLine"><span>1</span><div><small>MULAI DI SINI</small><h2>Apa yang ingin kamu periksa?</h2></div></div>
      <label>Pertanyaan / topik<textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={3}/></label>
      <label>Sumber pendukung <em>opsional</em><textarea value={source} onChange={e=>setSource(e.target.value)} rows={4} placeholder="Tempel URL atau potongan sumber yang ingin diperiksa."/></label>
      <div className="inputActions"><button type="button" className="analyze" onClick={analyze}><FileSearch size={18}/> Analisis Bukti</button><button type="button" className="secondary" onClick={loadDemo}>Lihat contoh</button></div>
      <p className="micro">Prototype ini tidak menganggap teks yang ditempel sebagai fakta. Bukti tetap harus diperiksa.</p>
    </section>

    {!hasRun&&<section className="beforeRun">
      <div><b>Yang akan kamu dapat</b><span>Ringkasan → status klaim → bukti → konflik → bagian yang harus diperiksa manusia.</span></div>
    </section>}

    {hasRun&&<section id="research-report" className="reportBlock">
      <div className="reportTop"><div><small>HASIL ANALISIS</small><h2>{report.question}</h2></div><span className="demoBadge">VALIDATION MODE</span></div>

      <div className="summary card">
        <span className="summaryLabel">KESIMPULAN SEMENTARA</span>
        <p>{report.summary}</p>
        <div className="nextAction"><b>Yang perlu dilakukan berikutnya</b><span>{report.humanReview[0]??"Periksa sumber primer sebelum menarik kesimpulan."}</span></div>
      </div>

      <div className="statusGrid" aria-label="Filter status klaim">
        {statusOrder.map(s=><button type="button" key={s} onClick={()=>setFilter(s)} className={filter===s?"active":""}><b>{counts[s]??0}</b><span>{shortStatus[s]}</span></button>)}
      </div>
      {filter!=="SEMUA"&&<button type="button" className="showAll" onClick={()=>setFilter("SEMUA")}>Tampilkan semua klaim</button>}

      <section className="claimsBlock">
        <div className="sectionTitle"><small>CLAIM–EVIDENCE MATRIX</small><h2>Klaim dan bukti</h2><p>Buka kartu untuk melihat sumber dan alasan statusnya.</p></div>
        <div className="claimList">{visibleClaims.map(claim=>{
          const src=report.sources.find(s=>s.id===claim.sourceId);
          return <details key={claim.id} className="claimCard">
            <summary>
              <div><span className={`status s-${claim.status.toLowerCase().replaceAll(" ","-")}`}>{shortStatus[claim.status]}</span><h3>{claim.claim}</h3></div>
              <ChevronDown size={18}/>
            </summary>
            <div className="claimBody"><div><b>Bukti</b><p>{claim.evidence}</p></div><div><b>Sumber</b><p>{src?`${src.title} · Tier ${src.tier}`:"Belum ada sumber"}</p></div><div><b>Alasan status</b><p>{claim.explanation}</p></div><div className="reviewFlag">Human review: <strong>{claim.humanReview?"YA":"TIDAK"}</strong></div></div>
          </details>})}</div>
      </section>

      <details className="detailGroup"><summary><span><b>Source Quality</b><small>{report.sources.length} sumber</small></span><ChevronDown size={18}/></summary><div className="detailBody">{report.sources.length?report.sources.map(s=><div className="sourceRow" key={s.id}><b>Tier {s.tier}</b><div><strong>{s.title}</strong><p>{s.sourceType} · {s.freshness}</p><small>{s.note}</small></div></div>):<p className="muted">Belum ada sumber.</p>}</div></details>

      <details className="detailGroup"><summary><span><b>Kontradiksi & celah bukti</b><small>{report.contradictions.length+report.unverified.length} temuan</small></span><ChevronDown size={18}/></summary><div className="detailBody"><h4>Contradictions</h4>{report.contradictions.length?report.contradictions.map(x=><p className="warning" key={x}><AlertTriangle size={15}/>{x}</p>):<p className="muted">Belum ada pertentangan yang teridentifikasi.</p>}<h4>Belum terverifikasi</h4>{report.unverified.map(x=><p key={x}>• {x}</p>)}</div></details>

      <details className="detailGroup"><summary><span><b>Freshness & human review</b><small>{report.humanReview.length} pemeriksaan</small></span><ChevronDown size={18}/></summary><div className="detailBody"><h4>Freshness warning</h4>{report.freshnessWarnings.map(x=><p key={x}>• {x}</p>)}<h4>Perlu diperiksa manusia</h4>{report.humanReview.map(x=><p className="check" key={x}><CheckCircle2 size={14}/>{x}</p>)}</div></details>

      <section className="finalNote"><small>FINAL RESEARCH NOTES</small><p>{report.finalNotes}</p></section>
    </section>}

    <style jsx>{`
      .labWrap{max-width:920px;margin:0 auto;padding:48px 20px 84px}.labHero{padding:20px 0 26px}.labEyebrow{display:inline-flex;gap:7px;align-items:center;color:#46b8ff;font-size:11px;font-weight:900;letter-spacing:.08em}.labHero h1{max-width:760px;font-size:clamp(38px,7vw,66px);line-height:1.02;margin:13px 0;letter-spacing:-.045em}.labHero>p{max-width:690px;font-size:18px;line-height:1.65;color:var(--muted)}.labGuard{display:flex;gap:8px;align-items:flex-start;margin-top:15px;color:var(--muted);font-size:12px}.card,.detailGroup,.claimCard{background:var(--surface);border:1px solid var(--line);box-shadow:var(--shadow)}.card{border-radius:22px;padding:23px}.labInput{display:grid;gap:14px}.stepLine{display:flex;gap:12px;align-items:center}.stepLine>span{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--primary);color:white;font-weight:900}.stepLine small,.reportTop small,.summaryLabel,.sectionTitle small,.finalNote small{color:var(--primary);font-size:10px;font-weight:900;letter-spacing:.09em}.stepLine h2{margin:3px 0 0}.labInput label{display:grid;gap:7px;font-size:13px;font-weight:850}.labInput label em{font-style:normal;color:var(--muted);font-weight:600}.labInput textarea{width:100%;resize:vertical;border:1px solid var(--line);background:var(--bg);color:var(--text);padding:13px;border-radius:13px;line-height:1.55}.inputActions{display:grid;grid-template-columns:1fr auto;gap:9px}.analyze,.secondary,.showAll{border-radius:12px;font-weight:900;cursor:pointer}.analyze{min-height:50px;border:0;background:linear-gradient(135deg,#0c5ec8,#1986ef 65%,#5d2fe0);color:white;display:flex;align-items:center;justify-content:center;gap:8px}.secondary,.showAll{border:1px solid var(--line);background:var(--soft);color:var(--text);padding:0 14px}.micro,.muted{color:var(--muted);font-size:11px;margin:0}.beforeRun{padding:16px 2px;color:var(--muted);font-size:12px}.beforeRun div{display:grid;gap:3px}.beforeRun b{color:var(--text)}.reportBlock{padding-top:31px;scroll-margin-top:100px}.reportTop{display:grid;gap:10px;margin-bottom:14px}.reportTop h2{font-size:clamp(25px,4.5vw,37px);line-height:1.18;margin:4px 0 0}.demoBadge{width:max-content;font-size:9px;font-weight:900;letter-spacing:.08em;color:#63d2ff;border:1px solid #2a6b8d;background:#08263a;padding:6px 9px;border-radius:999px}.summary{margin-bottom:12px}.summary>p{font-size:15px;line-height:1.65;margin:8px 0 16px;color:var(--muted)}.nextAction{display:grid;gap:3px;padding:12px 14px;border-radius:12px;background:var(--soft);font-size:12px}.nextAction span{color:var(--muted)}.statusGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}.statusGrid button{min-width:0;padding:12px;border-radius:13px;border:1px solid var(--line);background:var(--surface);color:var(--text);text-align:left;cursor:pointer}.statusGrid button.active{outline:2px solid var(--primary)}.statusGrid b{display:block;font-size:22px}.statusGrid span{display:block;overflow:hidden;text-overflow:ellipsis;font-size:9px;font-weight:850;white-space:nowrap}.showAll{min-height:38px;margin-bottom:12px}.claimsBlock{margin-top:24px}.sectionTitle h2{margin:4px 0}.sectionTitle p{margin:0 0 12px;color:var(--muted);font-size:12px}.claimList{display:grid;gap:9px}.claimCard{border-radius:15px;overflow:hidden}.claimCard summary,.detailGroup summary{list-style:none;cursor:pointer}.claimCard summary::-webkit-details-marker,.detailGroup summary::-webkit-details-marker{display:none}.claimCard summary{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:15px}.claimCard summary h3{font-size:15px;line-height:1.45;margin:7px 0 0}.claimCard[open] summary svg,.detailGroup[open] summary svg{transform:rotate(180deg)}.status{display:inline-flex;font-size:9px;font-weight:950;letter-spacing:.04em;padding:5px 8px;border-radius:999px;background:var(--soft)}.claimBody{display:grid;gap:12px;padding:0 15px 15px;border-top:1px solid var(--line)}.claimBody>div{padding-top:12px}.claimBody b{font-size:11px;color:var(--muted)}.claimBody p{margin:3px 0 0;font-size:12px;line-height:1.6}.reviewFlag{font-size:11px;color:var(--muted)}.detailGroup{border-radius:15px;margin-top:9px;overflow:hidden}.detailGroup summary{display:flex;align-items:center;justify-content:space-between;padding:15px}.detailGroup summary span{display:grid;gap:2px}.detailGroup summary small{color:var(--muted)}.detailBody{padding:0 15px 15px;border-top:1px solid var(--line);font-size:12px;color:var(--muted);line-height:1.6}.detailBody h4{color:var(--text);margin:15px 0 7px}.sourceRow{display:grid;grid-template-columns:58px 1fr;gap:10px;padding:11px 0;border-bottom:1px solid var(--line)}.sourceRow>b{color:var(--primary);font-size:10px}.sourceRow p,.sourceRow small{margin:3px 0;font-size:11px}.warning,.check{display:flex;gap:7px;align-items:flex-start}.finalNote{margin-top:18px;padding:16px 2px;border-top:1px solid var(--line)}.finalNote p{margin:6px 0 0;color:var(--muted);font-size:12px;line-height:1.65}
      @media(max-width:640px){.labWrap{padding:29px 14px 58px}.labHero{padding-top:10px}.labHero h1{font-size:38px;letter-spacing:-.035em}.labHero>p{font-size:15px}.card{padding:16px;border-radius:17px}.inputActions{grid-template-columns:1fr}.secondary{min-height:42px}.statusGrid{grid-template-columns:1fr 1fr}.statusGrid span{white-space:normal}.reportTop h2{font-size:25px}.summary>p{font-size:14px}.claimCard summary{padding:13px}.claimCard summary h3{font-size:14px}.detailGroup summary{padding:14px}.beforeRun{padding-bottom:0}}
    `}</style>
  </div>
}
