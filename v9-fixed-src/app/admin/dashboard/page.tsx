"use client";

import Link from "next/link";
import {
  BarChart3, Edit3, FilePlus2, Flame, Image as ImageIcon,
  LogOut, Mail, Newspaper, Star, Tags, Trash2, TrendingUp
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import type { MediaItem } from "@/lib/media-types";
import { formatDate } from "@/lib/utils";

export default function Page(){
  const router=useRouter();
  const[items,setItems]=useState<Article[]>([]);
  const[media,setMedia]=useState<MediaItem[]>([]);
  const[subscribers,setSubscribers]=useState(0);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState("");

  const load=async()=>{
    const[articlesResult,mediaResult,newsletterResult]=await Promise.all([
      supabase.from("articles").select("*").order("created_at",{ascending:false}),
      supabase.from("media").select("*").order("created_at",{ascending:false}).limit(6),
      supabase.from("newsletter_subscribers").select("id",{count:"exact",head:true})
    ]);
    if(articlesResult.error)setError(articlesResult.error.message);
    else setItems(articlesResult.data||[]);
    setMedia(mediaResult.data||[]);
    setSubscribers(newsletterResult.count||0);
    setLoading(false);
  };

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if(!data.session)router.replace("/admin");
      else load();
    })
  },[router]);

  const remove=async(id:string)=>{
    if(!confirm("Hapus artikel ini?"))return;
    const{error}=await supabase.from("articles").delete().eq("id",id);
    if(error)alert(error.message);else load();
  };

  const logout=async()=>{await supabase.auth.signOut();router.push("/admin")};

  const stats=useMemo(()=>{
    const tags=new Set<string>();
    items.forEach(a=>(a.tags||[]).forEach(t=>tags.add(t)));
    return {
      total:items.length,
      published:items.filter(x=>x.status==="published").length,
      draft:items.filter(x=>x.status==="draft").length,
      featured:items.filter(x=>x.featured).length,
      breaking:items.filter(x=>x.breaking).length,
      editorPick:items.filter(x=>x.editor_pick).length,
      views:items.reduce((n,a)=>n+(a.view_count||0),0),
      tags:tags.size
    }
  },[items]);

  const topArticles=[...items].sort((a,b)=>(b.view_count||0)-(a.view_count||0)).slice(0,5);

  return <main className="adminPage"><div className="adminShell">
    <aside>
      <b>AIUpdateId Admin</b>
      <Link className="active" href="/admin/dashboard"><BarChart3 size={17}/> Dashboard</Link>
      <Link href="/admin/artikel/baru"><FilePlus2 size={17}/> Tulis Artikel</Link>
      <Link href="/admin/media"><ImageIcon size={17}/> Media Library</Link>
      <Link href="/"><span>↗</span> Lihat Website</Link>
      <button onClick={logout}><LogOut size={17}/> Keluar</button>
    </aside>

    <section className="adminContent">
      <div className="adminTop">
        <div><small>DASHBOARD</small><h1>Ringkasan Portal</h1></div>
        <Link className="primary" href="/admin/artikel/baru"><FilePlus2 size={18}/> Artikel Baru</Link>
      </div>

      {error&&<div className="errorBox">{error}</div>}
      {loading?<div className="empty">Memuat dashboard...</div>:<>
        <div className="dashboardStats">
          <div><Newspaper/><b>{stats.total}</b><span>Total artikel</span></div>
          <div><TrendingUp/><b>{stats.published}</b><span>Published</span></div>
          <div><Edit3/><b>{stats.draft}</b><span>Draft</span></div>
          <div><Star/><b>{stats.featured}</b><span>Featured</span></div>
          <div><Flame/><b>{stats.breaking}</b><span>Breaking</span></div>
          <div><Tags/><b>{stats.tags}</b><span>Tag aktif</span></div>
          <div><ImageIcon/><b>{media.length}</b><span>Media terbaru</span></div>
          <div><Mail/><b>{subscribers}</b><span>Subscriber</span></div>
        </div>

        <div className="dashboardGrid">
          <section className="dashboardPanel">
            <div className="panelHeader"><div><small>ARTIKEL</small><h2>Artikel terbaru</h2></div><Link href="/admin/artikel/baru">Tambah</Link></div>
            <div className="tableWrap"><table><thead><tr><th>Judul</th><th>Status</th><th>Dibaca</th><th>Aksi</th></tr></thead><tbody>
              {items.slice(0,8).map(a=><tr key={a.id}>
                <td><b>{a.title}</b><small>{a.category} • {formatDate(a.created_at)}</small></td>
                <td><span className={`status ${a.status}`}>{a.status}</span></td>
                <td>{a.view_count||0}</td>
                <td><div className="rowActions"><Link href={`/admin/artikel/${a.id}`}><Edit3 size={17}/></Link><button onClick={()=>remove(a.id)}><Trash2 size={17}/></button></div></td>
              </tr>)}
            </tbody></table></div>
          </section>

          <aside className="dashboardPanel">
            <div className="panelHeader"><div><small>TRENDING</small><h2>Artikel teratas</h2></div></div>
            <div className="topArticleList">
              {topArticles.map((a,i)=><Link href={`/artikel/${a.slug}`} key={a.id}>
                <span>{i+1}</span><div><h3>{a.title}</h3><p>{a.view_count||0} pembaca</p></div>
              </Link>)}
            </div>
          </aside>
        </div>

        <section className="dashboardPanel mediaPanel">
          <div className="panelHeader"><div><small>MEDIA</small><h2>Media terbaru</h2></div><Link href="/admin/media">Buka Media Library</Link></div>
          <div className="dashboardMediaGrid">
            {media.map(item=><Link href="/admin/media" key={item.id}><img src={item.public_url} alt={item.alt_text||item.file_name}/><span>{item.file_name}</span></Link>)}
          </div>
        </section>
      </>}
    </section>
  </div></main>
}
