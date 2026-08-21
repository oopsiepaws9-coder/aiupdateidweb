import Link from "next/link";
import { ArrowRight, BookOpen, Search, Tag } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";

export const revalidate = 300;

function toTagSlug(tag: string) {
  return encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"));
}

export default async function TagIndex() {
  const supabase = createServerSupabase();
  let articles: Pick<Article, "id" | "tags">[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("articles")
      .select("id,tags")
      .eq("status", "published");

    articles = (data || []) as Pick<Article, "id" | "tags">[];
  }

  const counts = new Map<string, number>();
  articles.forEach((article) =>
    (article.tags || []).forEach((tag) =>
      counts.set(tag, (counts.get(tag) || 0) + 1)
    )
  );

  const tags = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const totalTaggedArticles = articles.filter((article) => (article.tags || []).length > 0).length;

  return (
    <main className="page">
      <section className="container intro tagHero">
        <small>TAG AIUPDATEID</small>
        <h1>Jelajahi topik AI berdasarkan tag.</h1>
        <p>
          Gunakan halaman tag untuk menemukan artikel AIUpdateId yang saling berkaitan berdasarkan tema,
          tools, model, istilah, dan kebutuhan pembaca.
        </p>

        <div className="tagStats">
          <div>
            <strong>{tags.length}</strong>
            <span>tag tersedia</span>
          </div>
          <div>
            <strong>{totalTaggedArticles}</strong>
            <span>artikel bertag</span>
          </div>
          <div>
            <strong>SEO</strong>
            <span>untuk eksplorasi topik</span>
          </div>
        </div>
      </section>

      <section className="container tagGuide">
        <div>
          <small>CARA PAKAI</small>
          <h2>Mulai dari masalah atau topik yang ingin dipahami</h2>
          <p>
            Jika ingin belajar dari nol, mulai dari tag seperti Artificial Intelligence, ChatGPT, Prompt AI,
            atau Belajar AI. Jika ingin membandingkan tools, gunakan tag yang mengarah ke produk atau kategori.
          </p>
        </div>

        <div className="tagGuideGrid">
          <article>
            <Search size={20} />
            <h3>Temukan cluster</h3>
            <p>Lihat kumpulan artikel yang membahas tema serupa agar pembaca tidak berhenti di satu halaman.</p>
          </article>
          <article>
            <BookOpen size={20} />
            <h3>Bangun pemahaman</h3>
            <p>Gunakan tag untuk melanjutkan bacaan dari artikel dasar ke tutorial, prompt, tools, dan perbandingan.</p>
          </article>
          <article>
            <Tag size={20} />
            <h3>Ikuti perkembangan</h3>
            <p>Tag membantu menemukan update baru tentang tools, model, dan istilah AI yang sering berubah.</p>
          </article>
        </div>
      </section>

      <section className="container compact">
        <div className="directorySectionHead">
          <small>SEMUA TAG</small>
          <h2>Topik yang tersedia</h2>
          <p>{tags.length} tag ditemukan dari artikel yang sudah diterbitkan.</p>
        </div>

        <div className="tagCloud enhancedTagCloud">
          {tags.map(([tag, count]) => (
            <Link href={`/tag/${toTagSlug(tag)}`} key={tag} aria-label={`Buka tag ${tag}, ${count} artikel`}>
              <Tag size={16} />
              <span>{tag}</span>
              <b>({count})</b>
            </Link>
          ))}
        </div>

        {!tags.length && <div className="empty">Belum ada tag.</div>}
      </section>

      <section className="container tagPath">
        <div>
          <small>JALUR LANJUT</small>
          <h2>Lanjutkan eksplorasi AI</h2>
        </div>
        <div className="tagPathGrid">
          <Link href="/artikel">
            <span>Semua Artikel</span>
            <p>Baca panduan, tutorial, berita, dan analisis AI terbaru.</p>
            <ArrowRight size={18} />
          </Link>
          <Link href="/tools">
            <span>Tools AI</span>
            <p>Temukan aplikasi AI yang cocok untuk belajar, kerja, riset, dan konten.</p>
            <ArrowRight size={18} />
          </Link>
          <Link href="/glossary">
            <span>Glosarium AI</span>
            <p>Pahami istilah AI yang sering muncul di artikel dan tools.</p>
            <ArrowRight size={18} />
          </Link>
          <Link href="/prompts">
            <span>Prompt AI</span>
            <p>Gunakan template prompt untuk kebutuhan belajar, menulis, dan produktivitas.</p>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
