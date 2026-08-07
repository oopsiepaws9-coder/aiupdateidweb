"use client";

import { useEffect, useState } from "react";
import { Check, Image as ImageIcon, Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { MediaItem } from "@/lib/media-types";

export default function MediaPicker({
  open,
  onClose,
  onSelect
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}) {
  const [items,setItems]=useState<MediaItem[]>([]);
  const [query,setQuery]=useState("");
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    if(!open)return;
    setLoading(true);
    supabase.from("media").select("*").order("created_at",{ascending:false})
      .then(({data})=>{setItems(data||[]);setLoading(false)});
  },[open]);

  if(!open)return null;
  const filtered=items.filter(item=>
    `${item.file_name} ${item.alt_text||""} ${item.caption||""}`
      .toLowerCase().includes(query.toLowerCase())
  );

  return <div className="mediaModalBackdrop">
    <section className="mediaModal">
      <div className="mediaModalHeader">
        <div><ImageIcon size={20}/><h3>Pilih dari Media Library</h3></div>
        <button type="button" onClick={onClose}><X size={20}/></button>
      </div>
      <label className="mediaSearch"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari gambar..."/></label>
      {loading?<div className="empty">Memuat media...</div>:<div className="mediaPickerGrid">
        {filtered.map(item=><button type="button" key={item.id} className="mediaPickItem" onClick={()=>{onSelect(item);onClose()}}>
          <img src={item.public_url} alt={item.alt_text||item.file_name}/>
          <span>{item.file_name}</span>
          <i><Check size={16}/></i>
        </button>)}
      </div>}
    </section>
  </div>
}
