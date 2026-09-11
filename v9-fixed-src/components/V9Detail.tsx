"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Link2, Tag } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import AdUnit from "@/components/AdUnit";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { table: string; slug: string; initialItem?: any; back?: string; backHref?: string; backLabel?: string };

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
}

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).map(v => v[0]).join("").slice(0, 2).toUpperCase();
}

function ComparisonMarkdown({
  value,
  className = ""
}: {
  value?: string | null;
  className?: string;
}) {
  if (!value) return null;

  return (
    <div className={`comparisonMarkdown ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {value}
      </ReactMarkdown>
    </div>
  );
}

export default function V9Detail({ table, slug, initialItem, back, backHref, backLabel }: Props) {
  const resolvedBackHref = backHref || back || "/";
  const resolvedBackLabel = backLabel || (table === "glossary_terms" ? "Kembali ke Glossary" : table === "ai_models" ? "Kembali ke AI Models" : table === "comparisons" ? "Kembali ke Perbandingan" : "Kembali");
  const x = initialItem || null;

  if (!x) {
    return (
      <main className="page">
        <div className="container v9Detail">
          <Link className="back" href={resolvedBackHref}><ArrowLeft size={17}/> {resolvedBackLabel}</Link>
          <div className="empty">Data tidak ditemukan atau belum dipublikasikan.</div>
        </div>
      </main>
    );
  }

  const isModel = table === "ai_models";
  const isGlossary = table === "glossary_terms";
  const isComparison = table === "comparisons";
  const name = x.name || x.term || x.title || "Detail";
  const short = isComparison
    ? ""
    : x.short_description || x.short_definition || x.description || "";
  const description = x.description || x.definition || "";
  const related = Array.isArray(x.related_terms) ? x.related_terms : [];
  const tags = Array.isArray(x.tags) ? x.tags : [];
  const strengths = Array.isArray(x.strengths) ? x.strengths : [];
  const limitations = Array.isArray(x.limitations) ? x.limitations : [];
  const comparisonRows = Array.isArray(x.comparison_rows) ? x.comparison_rows : [];
  const comparisonFaq = Array.isArray(x.faq) ? x.faq : [];
  const comparisonSources = Array.isArray(x.sources) ? x.sources : [];
  const relatedGlossary = Array.isArray(x.related_glossary) ? x.related_glossary : [];
  const relatedModels = Array.isArray(x.related_models) ? x.related_models : [];
  const glossaryLessons = isGlossary ? [
    { eyebrow: "CARA KERJA SEDERHANA", title: "Cara kerja sederhana", content: x.how_it_works },
    { eyebrow: "KENAPA PENTING", title: "Kenapa Anda perlu memahaminya?", content: x.why_it_matters },
    { eyebrow: "JANGAN TERTUKAR", title: "Kesalahpahaman yang umum", content: x.common_confusions },
    { eyebrow: "BATASAN YANG PERLU DIKETAHUI", title: "Catatan penting sebelum menggunakannya", content: typeof x.limitations === "string" ? x.limitations : "" }
  ].filter((lesson) => lesson.content) : [];

  return (
    <main className="page">
      <div className="container v9Detail">
        <Link className="back" href={resolvedBackHref}><ArrowLeft size={17}/> {resolvedBackLabel}</Link>

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

        {isComparison && (
          <AdUnit
            slot={process.env.NEXT_PUBLIC_ADSENSE_COMPARE_TOP_SLOT || process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_TOP_SLOT}
            placement="comparison-top"
            format="horizontal"
          />
        )}

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

                {glossaryLessons.map((lesson) => (
                  <section className="glossaryExample" key={lesson.eyebrow}>
                    <small>{lesson.eyebrow}</small>
                    <h2>{lesson.title}</h2>
                    <p>{lesson.content}</p>
                  </section>
                ))}

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
            ) : isComparison ? (
              <>
                <section className="comparisonIntro">
                  <small>RINGKASAN</small>
                  <ComparisonMarkdown value={x.summary} className="comparisonIntroBody" />
                </section>

                <section className="comparisonVsGrid">
                  <div className="comparisonSideCard">
                    <span>A</span>
                    <h2>{x.item_a_name}</h2>
                    {x.item_a_slug && <Link href={`/tools/${x.item_a_slug}`}>Lihat AI Tool →</Link>}
                  </div>
                  <div className="comparisonVsBadge">VS</div>
                  <div className="comparisonSideCard">
                    <span>B</span>
                    <h2>{x.item_b_name}</h2>
                    {x.item_b_slug && <Link href={`/tools/${x.item_b_slug}`}>Lihat AI Tool →</Link>}
                  </div>
                </section>

                {comparisonRows.length > 0 && (
                  <section className="comparisonSection">
                    <small>PERBEDAAN UTAMA</small>
                    <h2>Perbandingan {x.item_a_name} vs {x.item_b_name}</h2>
                    <div className="comparisonRows">
                      {comparisonRows.map((row: any, index: number) => (
                        <div className="comparisonRow" key={`${row.aspect}-${index}`}>
                          <h3>{row.aspect}</h3>
                          <div className={`comparisonCell ${row.edge === "a" ? "edge" : ""}`}>
                            <b>{x.item_a_name}</b>
                            <ComparisonMarkdown value={row.a} className="comparisonCellBody" />
                            {row.edge === "a" && <span>Unggul di aspek ini</span>}
                          </div>
                          <div className={`comparisonCell ${row.edge === "b" ? "edge" : ""}`}>
                            <b>{x.item_b_name}</b>
                            <ComparisonMarkdown value={row.b} className="comparisonCellBody" />
                            {row.edge === "b" && <span>Unggul di aspek ini</span>}
                          </div>
                          {row.edge === "tie" && <em>Seimbang / tergantung kebutuhan</em>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {x.verdict && (
                  <section className="comparisonVerdict">
                    <small>PANDANGAN AIUPDATEID</small>
                    <h2>Jadi, pilih yang mana?</h2>
                    <ComparisonMarkdown value={x.verdict} className="comparisonVerdictBody" />
                  </section>
                )}

                {(x.related_article_slug || relatedGlossary.length > 0 || relatedModels.length > 0) && (
                  <section className="comparisonInternalLinks">
                    <small>LANJUT BELAJAR</small>
                    <h2>Pelajari lebih dalam</h2>

                    {x.related_article_slug && (
                      <Link className="comparisonArticleLink" href={`/artikel/${x.related_article_slug}`}>
                        <span>Artikel terkait</span>
                        <b>Baca analisis lengkap →</b>
                      </Link>
                    )}

                    {relatedGlossary.length > 0 && (
                      <div className="comparisonLinkGroup">
                        <span>Istilah AI terkait</span>
                        <div>
                          {relatedGlossary.map((slug: string) => (
                            <Link key={slug} href={`/glossary/${slug}`}>{slug.replace(/-/g, " ")}</Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {relatedModels.length > 0 && (
                      <div className="comparisonLinkGroup">
                        <span>Model AI terkait</span>
                        <div>
                          {relatedModels.map((slug: string) => (
                            <Link key={slug} href={`/models/${slug}`}>{slug.replace(/-/g, " ")}</Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {comparisonFaq.length > 0 && (
                  <section className="comparisonFaq">
                    <small>FAQ</small>
                    <h2>Pertanyaan yang sering ditanyakan</h2>
                    {comparisonFaq.map((item: any, index: number) => (
                      <details key={`${item.question}-${index}`}>
                        <summary>{item.question}</summary>
                        <p>{item.answer}</p>
                      </details>
                    ))}
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
            ) : isComparison ? (
              <>
                {x.category && <p><b>Kategori:</b> {x.category}</p>}
                {x.last_reviewed_at && <p><b>Ditinjau:</b> {formatDate(x.last_reviewed_at)}</p>}
                {tags.length > 0 && (
                  <div className="comparisonAsideTags">
                    {tags.map((tag: string) => <span key={tag}>{tag}</span>)}
                  </div>
                )}
                {comparisonSources.length > 0 && (
                  <div className="comparisonSources">
                    <h4>Sumber resmi</h4>
                    {comparisonSources.map((source: any, index: number) => (
                      <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noopener noreferrer nofollow">
                        {source.label || "Sumber"} <ExternalLink size={14}/>
                      </a>
                    ))}
                  </div>
                )}
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
            {isComparison && (
              <AdUnit
                slot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT}
                placement="sidebar"
                format="vertical"
              />
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
