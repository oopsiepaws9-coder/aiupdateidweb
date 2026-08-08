"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle2, ExternalLink, Link2, Tag } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

type Props = { table: string; slug: string; backHref: string; backLabel: string };

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).map(v => v[0]).join("").slice(0, 2).toUpperCase();
}

export default function V9Detail({ table, slug, backHref, backLabel }: Props) {
  const [x, setX] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const { data } = await supabase.from(table).select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (active) {
        setX(data || null);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [table, slug]);

  if (loading) {
    return <main className="page"><div className="container v9Detail"><div className="empty">Memuat...</div></div></main>;
  }

  if (!x) {
    return (
      <main className="page">
        <div className="container v9Detail">
          <Link className="back" href={backHref}><ArrowLeft size={17}/> {backLabel}</Link>
          <div className="empty">Data tidak ditemukan atau belum dipublikasikan.</div>
        </div>
      </main>
    );
  }

  const isModel = table === "ai_models";
  const isGlossary = table === "glossary_terms";
  const isComparison = table === "comparisons";
  const name = x.name || x.term || x.title || "Detail";
  const short = x.short_description || x.short_definition || x.description || "";
  const description = x.description || x.definition || "";
  const related = Array.isArray(x.related_terms) ? x.related_terms : [];
  const tags = Array.isArray(x.tags) ? x.tags : [];
  const strengths = Array.isArray(x.strengths) ? x.strengths : [];
  const limitations = Array.isArray(x.limitations) ? x.limitations : [];

  return (
    <main className="page">
      <div className="container v9Detail">
        <Link className="back" href={backHref}><ArrowLeft size={17}/> {backLabel}</Link>

        <header className="v9DetailHero">
          {isModel
            ? <BrandLogo provider={x.provider} name={name} logoUrl={x.logo_url} large />
            : <div className={`toolLogo large ${isGlossary ? "glossaryLogo" : ""}`}>{isGlossary ? "AI" : initials(name)}</div>
          }

          <div>
            <div className="v9DetailEyebrow">
              {isGlossary && <span>GLOSSARY AI</span>}
              {isModel && <span>{x.provider || "AI MODEL"}</span>}
              {isComparison && <span>PERBANDINGAN AI</span>}
              {x.category && <span>{x.category}</span>}
            </div>
            <h1>{name}</h1>
            {short && <p>{short}</p>}
          </div>
        </header>

        <div className="v9DetailGrid">
          <article>
            {isGlossary ? (
              <>
                <section className="glossaryDefinition">
                  <small>DEFINISI</small>
                  <h2>Apa itu {name}?</h2>
                  <p>{description || short}</p>
                </section>

                {x.example && (
                  <section className="glossaryExample">
                    <small>CONTOH SEDERHANA</small>
                    <p>{x.example}</p>
                  </section>
                )}

                {related.length > 0 && (
                  <section className="glossaryRelatedSection">
                    <div className="glossarySectionHeading">
                      <Link2 size={18}/>
                      <div><small>LANJUT BELAJAR</small><h2>Istilah terkait</h2></div>
                    </div>
                    <div className="glossaryRelatedLinks">
                      {related.map((item: string) => (
                        <Link key={item} href={`/glossary/${item}`}>
                          {item.replace(/-/g, " ")} <span>→</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <>
                {description && <p className="v9DetailDescription">{description}</p>}
                {strengths.length > 0 && (
                  <>
                    <h2>Kekuatan</h2>
                    <ul className="v9DetailFeatureList">
                      {strengths.map((v: string) => <li key={v}><CheckCircle2 size={17}/>{v}</li>)}
                    </ul>
                  </>
                )}
                {limitations.length > 0 && (
                  <>
                    <h2>Keterbatasan</h2>
                    <ul>{limitations.map((v: string) => <li key={v}>{v}</li>)}</ul>
                  </>
                )}
                {x.example && <><h2>Contoh</h2><p>{x.example}</p></>}
              </>
            )}
          </article>

          <aside className={isGlossary ? "glossaryInfoBox" : ""}>
            <h3>Informasi</h3>

            {isGlossary ? (
              <>
                {x.category && (
                  <div className="glossaryInfoItem">
                    <span>Kategori</span>
                    <b>{x.category}</b>
                  </div>
                )}

                {related.length > 0 && (
                  <div className="glossaryInfoItem">
                    <span>Istilah terkait</span>
                    <div className="glossaryInfoLinks">
                      {related.map((item: string) => (
                        <Link key={item} href={`/glossary/${item}`}>{item.replace(/-/g, " ")}</Link>
                      ))}
                    </div>
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="glossaryInfoItem">
                    <span><Tag size={13}/> Tags</span>
                    <div className="glossaryTags">
                      {tags.map((tag: string) => <em key={tag}>{tag}</em>)}
                    </div>
                  </div>
                )}

                {(x.updated_at || x.created_at) && (
                  <div className="glossaryInfoItem">
                    <span>Terakhir diperbarui</span>
                    <b>{formatDate(x.updated_at || x.created_at)}</b>
                  </div>
                )}

                <Link className="secondary glossaryBackLink" href="/glossary">Lihat semua istilah</Link>
              </>
            ) : (
              <>
                {x.model_type && <p><b>Tipe:</b> {x.model_type}</p>}
                {x.provider && <p><b>Provider:</b> {x.provider}</p>}
                {isModel && x.multimodal != null && <p><b>Multimodal:</b> {x.multimodal ? "Ya" : "Tidak"}</p>}
                {x.context_window && <p><b>Context:</b> {x.context_window}</p>}
                {x.pricing && <p><b>Harga:</b> {x.pricing}</p>}
                {x.availability && <p><b>Ketersediaan:</b> {x.availability}</p>}
                {x.official_url && (
                  <a className="primary" href={x.official_url} target="_blank" rel="noopener noreferrer nofollow">
                    Website resmi <ExternalLink size={16}/>
                  </a>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
