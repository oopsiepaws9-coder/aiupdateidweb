"use client";

import { Copy, ImagePlus, Pencil, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { MediaItem } from "@/lib/media-types";

const folders=["general","artikel","tools","prompt","logo"];

export default function MediaPage(){
  const router=useRouter();
  const[items,setItems]=useState<MediaItem[]>([]);
  const[loading,setLoading]=useState(true);
  const[uploading,setUploading]=useState(false);
  const[query,setQuery]=useState("");
  const[folder,setFolder]=useState("all");
  const[selected,setSelected]=useState<MediaItem|null>(null);
  const[edit,setEdit]=useState({alt_text:"",caption:"",photographer:"",source:"",folder:"general"});
  const[message,setMessage]=useState("");

  const load=async()=>{
    const{data,error}=await supabase.from("media").select("*").order("created_at",{ascending:false});
    if(error)setMessage(error.message);else setItems(data||[]);
    setLoading(false);
  };

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if(!data.session)router.replace("/admin");
      else load();
    });
  },[router]);

  const uploadFiles=async(files:FileList|null)=>{
    if(!files?.length)return;
    setUploading(true);setMessage("");
    const session=(await supabase.auth.getSession()).data.session;
    for(const file of Array.from(files)){
      const ext=file.name.split(".").pop()||"jpg";
      const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-").toLowerCase();
      const path=`library/${Date.now()}-${Math.random().toString(36).slice(2)}-${safe}`;
      const{error:uploadError}=await supabase.storage.from("article-images").upload(path,file);
      if(uploadError){setMessage(uploadError.message);continue}
      const{data:urlData}=supabase.storage.from("article-images").getPublicUrl(path);
      const imageSize=await new Promise<{width:number;height:number}>((resolve)=>{
        const img=new Image();
        img.onload=()=>resolve({width:img.naturalWidth,height:img.naturalHeight});
        img.onerror=()=>resolve({width:0,height:0});
        img.src=urlData.publicUrl;
      });
      const{error:dbError}=await supabase.from("media").insert({
        file_name:file.name,
        file_path:path,
        public_url:urlData.publicUrl,
        mime_type:file.type,
        file_size:file.size,
        width:imageSize.width||null,
        height:imageSize.height||null,
        folder:"general",
        created_by:session?.user.id||null
      });
      if(dbError)setMessage(dbError.message);
    }
    setUploading(false);load();
  };

  const openEdit=(item:MediaItem)=>{
    setSelected(item);
    setEdit({
      alt_text:item.alt_text||"",
      caption:item.caption||"",
      photographer:item.photographer||"",
      source:item.source||"",
      folder:item.folder||"general"
    });
  };

  const saveEdit=async()=>{
    if(!selected)return;
    const{error}=await supabase.from("media").update({...edit,updated_at:new Date().toISOString()}).eq("id",selected.id);
    if(error)setMessage(error.message);else{setSelected(null);load()}
  };

  const remove=async(item:MediaItem)=>{
    if(!confirm(`Hapus ${item.file_name}?`))return;
    await supabase.storage.from("article-images").remove([item.file_path]);
    const{error}=await supabase.from("media").delete().eq("id",item.id);
    if(error)setMessage(error.message);else load();
  };

  const filtered=useMemo(()=>items.filter(item=>{
    const q=`${item.file_name} ${item.alt_text||""} ${item.caption||""}`.toLowerCase().includes(query.toLowerCase());
    const f=folder==="all"||item.folder===folder;
    return q&&f;
  }),[items,query,folder]);

  return <main className="adminPage"><div className="adminShell">
    <aside><b>AIUpdateId Admin</b><a href="/admin/dashboard">Artikel</a><a href="/admin/artikel/baru">Tulis Artikel</a><a className="active" href="/admin/media">Media Library</a><a href="/">Lihat Website</a></aside>
    <section className="adminContent">
      <div className="adminTop"><div><small>MEDIA LIBRARY</small><h1>Gambar</h1></div>
        <label className="primary uploadButton"><ImagePlus size={18}/>{uploading?"Mengunggah...":"Upload Gambar"}<input hidden multiple type="file" accept="image/*" onChange={e=>uploadFiles(e.target.files)}/></label>
      </div>
      {message&&<div className="errorBox">{message}</div>}
      <div className="mediaToolbar">
        <label><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari media..."/></label>
        <select value={folder} onChange={e=>setFolder(e.target.value)}><option value="all">Semua folder</option>{folders.map(f=><option key={f}>{f}</option>)}</select>
      </div>
      {loading?<div className="empty">Memuat media...</div>:<div className="mediaGrid">
        {filtered.map(item=><article className="mediaCard" key={item.id}>
          <img src={item.public_url} alt={item.alt_text||item.file_name}/>
          <div><h3>{item.file_name}</h3><p>{item.width&&item.height?`${item.width} × ${item.height}`:"Ukuran tidak tersedia"}</p><span>{item.folder||"general"}</span></div>
          <div className="mediaActions">
            <button onClick={()=>navigator.clipboard.writeText(item.public_url)} title="Copy URL"><Copy size={17}/></button>
            <button onClick={()=>openEdit(item)} title="Edit"><Pencil size={17}/></button>
            <button onClick={()=>remove(item)} title="Hapus"><Trash2 size={17}/></button>
          </div>
        </article>)}
      </div>}
    </section>
  </div>

  {selected&&<div className="mediaModalBackdrop"><section className="mediaEditModal">
    <div className="mediaModalHeader"><h3>Edit Media</h3><button onClick={()=>setSelected(null)}><X size={20}/></button></div>
    <img src={selected.public_url} alt={edit.alt_text||selected.file_name}/>
    <label>Alt Text<textarea rows={3} value={edit.alt_text} onChange={e=>setEdit({...edit,alt_text:e.target.value})}/></label>
    <label>Caption<textarea rows={3} value={edit.caption} onChange={e=>setEdit({...edit,caption:e.target.value})}/></label>
    <label>Photographer<input value={edit.photographer} onChange={e=>setEdit({...edit,photographer:e.target.value})}/></label>
    <label>Sumber<input value={edit.source} onChange={e=>setEdit({...edit,source:e.target.value})}/></label>
    <label>Folder<select value={edit.folder} onChange={e=>setEdit({...edit,folder:e.target.value})}>{folders.map(f=><option key={f}>{f}</option>)}</select></label>
    <button className="primary" onClick={saveEdit}>Simpan Perubahan</button>
  </section></div>}
  </main>
}
