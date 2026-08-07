"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, FileText, Image as ImageIcon, Search, Settings2 } from "lucide-react";
import MediaPicker from "@/components/MediaPicker";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import { makeCanonical, makeMetaDescription, makeOgDescription, makeSeoTitle } from "@/lib/seo-helpers";

type FAQ = { question: string; answer: string };

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  status: string;
  featured: boolean;
  breaking: boolean;
  editor_pick: boolean;
  read_time: string;
  cover_image: string;
  alt_text: string;
  image_caption: string;
  image_source: string;
  seo_title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  no_index: boolean;
  faq: FAQ[];
  call_to_action: string;
  scheduled_at: string;
};

const categories = ["Berita AI","Tools AI","Tutorial","Review","Prompt AI","Belajar AI"];

const blank: Form = {
  title:"", slug:"", excerpt:"", content:"", category:"Berita AI", tags:"",
  status:"draft", featured:false, breaking:false, editor_pick:false, read_time:"5 menit",
  cover_image:"", alt_text:"", image_caption:"", image_source:"",
  seo_title:"", meta_description:"", focus_keyword:"", canonical_url:"",
  og_title:"", og_description:"", no_index:false,
  faq:[{question:"",answer:""}], call_to_action:"", scheduled_at:""
};

const tabs = [
  { id:"content", label:"Konten", icon:FileText },
  { id:"seo", label:"SEO", icon:Search },
  { id:"image", label:"Gambar", icon:ImageIcon },
  { id:"publish", label:"Publikasi", icon:Settings2 },
  { id:"preview", label:"Pratinjau", icon:Eye }
];

export default function Editor({ id }: { id?: string }) {
  const router = useRouter();
  const [tab,setTab]=useState("content");
  const [form,setForm]=useState<Form>(blank);
  const [busy,setBusy]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [mediaPickerOpen,setMediaPickerOpen]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{
      if(!data.session){router.replace("/admin");return}
      if(id){
        const{data,error}=await supabase.from("articles").select("*").eq("id",id).single();
        if(error){setError(error.message);return}
        if(data){
          setForm({
            title:data.title||"", slug:data.slug||"", excerpt:data.excerpt||"",
            content:data.content||"", category:data.category||"Berita AI",
            tags:(data.tags||[]).join(", "), status:data.status||"draft",
            featured:!!data.featured, breaking:!!data.breaking, editor_pick:!!data.editor_pick,
            read_time:data.read_time||"5 menit", cover_image:data.cover_image||"",
            alt_text:data.alt_text||"", image_caption:data.image_caption||"",
            image_source:data.image_source||"", seo_title:data.seo_title||"",
            meta_description:data.meta_description||"", focus_keyword:data.focus_keyword||"",
            canonical_url:data.canonical_url||"", og_title:data.og_title||"",
            og_description:data.og_description||"", no_index:!!data.no_index,
            faq:Array.isArray(data.faq)&&data.faq.length?data.faq:[{question:"",answer:""}],
            call_to_action:data.call_to_action||"",
            scheduled_at:data.scheduled_at?data.scheduled_at.slice(0,16):""
          });
        }
      }
    });
  },[id,router]);

  const set=(key:keyof Form,value:any)=>setForm(prev=>({...prev,[key]:value}));

  const addFaq=()=>set("faq",[...form.faq,{question:"",answer:""}]);
  const setFaq=(index:number,key:keyof FAQ,value:string)=>{
    const next=[...form.faq]; next[index]={...next[index],[key]:value}; set("faq",next);
  };
  const removeFaq=(index:number)=>set("faq",form.faq.filter((_,i)=>i!==index));

  const upload=async(file:File)=>{
    setUploading(true);setError("");
    const ext=file.name.split(".").pop()||"jpg";
    const path=`covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const{error}=await supabase.storage.from("article-images").upload(path,file);
    if(error)setError(error.message);
    else {
      const{data}=supabase.storage.from("article-images").getPublicUrl(path);
      set("cover_image",data.publicUrl);
    }
    setUploading(false);
  };

  const seoScore=useMemo(()=>{
    let score=0;
    if(form.seo_title.length>=30&&form.seo_title.length<=60)score+=20;
    if(form.meta_description.length>=120&&form.meta_description.length<=160)score+=20;
    if(form.focus_keyword&&form.title.toLowerCase().includes(form.focus_keyword.toLowerCase()))score+=15;
    if(form.slug)score+=10;
    if(form.alt_text)score+=10;
    if(form.excerpt)score+=10;
    if(form.faq.some(x=>x.question&&x.answer))score+=10;
    if(form.tags.split(",").filter(Boolean).length>=3)score+=5;
    return score;
  },[form]);


  const autoSeo=()=>{
    const slug=form.slug||slugify(form.title);
    const seoTitle=makeSeoTitle(form.title,form.focus_keyword);
    const meta=makeMetaDescription(form.excerpt,form.content);
    setForm(prev=>({
      ...prev,
      slug,
      seo_title:prev.seo_title||seoTitle,
      meta_description:prev.meta_description||meta,
      canonical_url:prev.canonical_url||makeCanonical(slug),
      og_title:prev.og_title||seoTitle,
      og_description:prev.og_description||makeOgDescription(meta,prev.excerpt)
    }));
  };

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setBusy(true);setError("");
    const cleanTitle=form.title.replace(/#{1,6}\s*/g,"").replace(/\s{2,}/g," ").trim();
    const now=new Date().toISOString();
    const tags=form.tags.split(",").map(x=>x.trim()).filter(Boolean);
    const faq=form.faq.filter(x=>x.question.trim()&&x.answer.trim());
    const payload={
      title:cleanTitle,
      slug:form.slug||slugify(cleanTitle),
      excerpt:form.excerpt,
      content:form.content,
      category:form.category,
      tags,
      status:form.status,
      featured:form.featured,
      breaking:form.breaking,
      editor_pick:form.editor_pick,
      read_time:form.read_time,
      cover_image:form.cover_image,
      alt_text:form.alt_text,
      image_caption:form.image_caption,
      image_source:form.image_source,
      seo_title:form.seo_title||cleanTitle,
      meta_description:form.meta_description||form.excerpt,
      focus_keyword:form.focus_keyword,
      canonical_url:form.canonical_url,
      og_title:form.og_title||form.seo_title||cleanTitle,
      og_description:form.og_description||form.meta_description||form.excerpt,
      no_index:form.no_index,
      faq,
      call_to_action:form.call_to_action,
      scheduled_at:form.scheduled_at?new Date(form.scheduled_at).toISOString():null,
      published_at:form.status==="published"?now:null,
      updated_at:now
    };
    const result=id
      ? await supabase.from("articles").update(payload).eq("id",id)
      : await supabase.from("articles").insert(payload);
    setBusy(false);
    if(result.error)setError(result.error.message);
    else router.push("/admin/dashboard");
  };

  return <form className="cmsEditor" onSubmit={submit}>
    <div className="quickPublishBar"><span>Status: <b>{form.status}</b></span><button type="button" onClick={()=>{set("status","draft");setTab("publish")}}>Draft</button><button type="button" className="publishNow" onClick={()=>{set("status","published");setTab("publish")}}>Publish</button></div><div className="cmsTop">
      <div><small>AIUPDATEID CMS</small><h1>{id?"Edit Artikel":"Artikel Baru"}</h1></div>
      <div><button type="button" className="secondary" onClick={()=>router.back()}>Batal</button><button className="primary" disabled={busy}>{busy?"Menyimpan...":"Simpan"}</button></div>
    </div>

    {error&&<div className="errorBox">{error}</div>}

    <div className="cmsTabs">
      {tabs.map(t=>{const Icon=t.icon;return <button type="button" key={t.id} className={tab===t.id?"active":""} onClick={()=>setTab(t.id)}><Icon size={17}/>{t.label}</button>})}
    </div>

    <div className="cmsPanel">
      {tab==="content"&&<div className="cmsGrid">
        <section>
          <label>Judul Artikel<input required value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Judul yang tampil di halaman"/></label>
          <label>Slug URL<input value={form.slug} onChange={e=>set("slug",e.target.value)} placeholder="otomatis-dari-judul"/></label>
          <div className="twoCols">
            <label>Kategori<select value={form.category} onChange={e=>set("category",e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
            <label>Tag<input value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="AI, ChatGPT, Tutorial"/></label>
          </div>
          <label>Ringkasan / Excerpt<textarea rows={4} value={form.excerpt} onChange={e=>set("excerpt",e.target.value)} placeholder="Ringkasan singkat untuk kartu artikel dan SEO"/></label>
          <label>Isi Artikel<textarea required rows={24} value={form.content} onChange={e=>set("content",e.target.value)} placeholder={"Pembuka...\n\n## Judul Bagian\n\nIsi artikel..."}/></label>
          <label>Call to Action<textarea rows={4} value={form.call_to_action} onChange={e=>set("call_to_action",e.target.value)} placeholder="Ajakan di akhir artikel"/></label>
        </section>
        <aside>
          <div className="faqHeader"><h3>FAQ</h3><button type="button" onClick={addFaq}>+ Tambah</button></div>
          {form.faq.map((f,i)=><div className="faqItem" key={i}>
            <input value={f.question} onChange={e=>setFaq(i,"question",e.target.value)} placeholder="Pertanyaan"/>
            <textarea rows={3} value={f.answer} onChange={e=>setFaq(i,"answer",e.target.value)} placeholder="Jawaban"/>
            {form.faq.length>1&&<button type="button" onClick={()=>removeFaq(i)}>Hapus</button>}
          </div>)}
        </aside>
      </div>}

      {tab==="seo"&&<div className="cmsGrid">
        <section>
          <div className="seoAutoBar"><span>Isi metadata SEO otomatis dari judul dan ringkasan.</span><button type="button" onClick={autoSeo}>Generate SEO</button></div><label>SEO Title<input value={form.seo_title} onChange={e=>set("seo_title",e.target.value)} placeholder="Ideal 30–60 karakter"/></label>
          <label>Meta Description<textarea rows={4} value={form.meta_description} onChange={e=>set("meta_description",e.target.value)} placeholder="Ideal 120–160 karakter"/></label>
          <label>Focus Keyword<input value={form.focus_keyword} onChange={e=>set("focus_keyword",e.target.value)}/></label>
          <label>Canonical URL<input value={form.canonical_url} onChange={e=>set("canonical_url",e.target.value)} placeholder="Kosongkan jika memakai URL artikel ini"/></label>
          <label>Open Graph Title<input value={form.og_title} onChange={e=>set("og_title",e.target.value)}/></label>
          <label>Open Graph Description<textarea rows={3} value={form.og_description} onChange={e=>set("og_description",e.target.value)}/></label>
          <label className="check"><input type="checkbox" checked={form.no_index} onChange={e=>set("no_index",e.target.checked)}/> Jangan indeks halaman ini</label>
        </section>
        <aside>
          <div className="seoScore"><span>SEO Score</span><b>{seoScore}/100</b><div><i style={{width:`${seoScore}%`}}/></div></div>
          <ul className="seoChecklist">
            <li className={form.seo_title?"ok":""}>SEO title terisi</li>
            <li className={form.meta_description?"ok":""}>Meta description terisi</li>
            <li className={form.focus_keyword?"ok":""}>Focus keyword terisi</li>
            <li className={form.alt_text?"ok":""}>Alt text gambar terisi</li>
            <li className={form.faq.some(x=>x.question&&x.answer)?"ok":""}>FAQ tersedia</li>
          </ul>
        </aside>
      </div>}

      {tab==="image"&&<div className="cmsGrid">
        <section>
          <div className="imageSourceButtons">
            <label className="secondary">Upload Baru<input hidden type="file" accept="image/*" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0])}/></label>
            <button type="button" className="secondary" onClick={()=>setMediaPickerOpen(true)}>Pilih dari Library</button>
          </div>
          {uploading&&<p>Mengunggah gambar...</p>}
          {form.cover_image&&<img className="imagePreviewLarge" src={form.cover_image} alt="Preview"/>}
          <label>URL Gambar<input value={form.cover_image} onChange={e=>set("cover_image",e.target.value)}/></label>
        </section>
        <aside>
          <label>Alt Text<textarea rows={3} value={form.alt_text} onChange={e=>set("alt_text",e.target.value)} placeholder="Jelaskan isi gambar untuk aksesibilitas dan SEO"/></label>
          <label>Caption<textarea rows={3} value={form.image_caption} onChange={e=>set("image_caption",e.target.value)}/></label>
          <label>Sumber Gambar<input value={form.image_source} onChange={e=>set("image_source",e.target.value)} placeholder="AIUpdateId / sumber resmi"/></label>
        </aside>
      </div>}

      {tab==="publish"&&<div className="cmsGrid">
        <section>
          <label>Status<select value={form.status} onChange={e=>set("status",e.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option></select></label>
          {form.status==="scheduled"&&<label>Jadwal Terbit<input type="datetime-local" value={form.scheduled_at} onChange={e=>set("scheduled_at",e.target.value)}/></label>}
          <label>Estimasi Waktu Baca<input value={form.read_time} onChange={e=>set("read_time",e.target.value)}/></label>
          <label className="check"><input type="checkbox" checked={form.featured} onChange={e=>set("featured",e.target.checked)}/> Artikel unggulan</label>
          <label className="check"><input type="checkbox" checked={form.breaking} onChange={e=>set("breaking",e.target.checked)}/> Breaking news</label>
          <label className="check"><input type="checkbox" checked={form.editor_pick} onChange={e=>set("editor_pick",e.target.checked)}/> Pilihan editor</label>
        </section>
        <aside className="publishSummary">
          <h3>Ringkasan Publikasi</h3>
          <p><b>Status:</b> {form.status}</p>
          <p><b>Kategori:</b> {form.category}</p>
          <p><b>Tag:</b> {form.tags||"Belum ada"}</p>
          <p><b>Unggulan:</b> {form.featured?"Ya":"Tidak"}</p><p><b>Pilihan editor:</b> {form.editor_pick?"Ya":"Tidak"}</p>
        </aside>
      </div>}

      {tab==="preview"&&<div className="previewStack">
        <div className="googlePreview">
          <span>Pratinjau Google</span>
          <h3>{form.seo_title||form.title||"Judul artikel"}</h3>
          <p className="previewUrl">aiupdateid.com/artikel/{form.slug||slugify(form.title||"judul-artikel")}</p>
          <p>{form.meta_description||form.excerpt||"Meta description akan tampil di sini."}</p>
        </div>
        <div className="articlePreview">
          {form.cover_image&&<img src={form.cover_image} alt={form.alt_text||"Preview gambar"}/>}
          <span>{form.category}</span>
          <h2>{form.title||"Judul Artikel"}</h2>
          <p>{form.excerpt}</p>
        </div>
      </div>}
    </div>
  <MediaPicker
      open={mediaPickerOpen}
      onClose={()=>setMediaPickerOpen(false)}
      onSelect={(item)=>{
        set("cover_image",item.public_url);
        set("alt_text",item.alt_text||"");
        set("image_caption",item.caption||"");
        set("image_source",item.source||"");
      }}
    />
  </form>
}
