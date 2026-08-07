import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ArticleCard({a}:{a:Article}){
  return <article className="card">
    {a.cover_image
      ? <div className="thumb image" style={{backgroundImage:`url("${a.cover_image}")`}}><span>{a.category}</span></div>
      : <div className="thumb"><span>{a.category}</span><Bot size={38}/></div>}
    <div className="cardBody">
      <div className="meta"><span>{formatDate(a.published_at||a.created_at)}</span><span>{a.read_time||"5 menit"}</span></div>
      <h3>{a.title}</h3><p>{a.excerpt}</p>
      <Link href={`/artikel/${a.slug}`}>Baca selengkapnya <ArrowRight size={16}/></Link>
    </div>
  </article>
}
