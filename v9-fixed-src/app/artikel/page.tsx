import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleCard, {
  type ArticleCardData
} from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { articleCategories } from "@/lib/article-categories";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

const PAGE_SIZE = 18;

const ARTICLE_CARD_COLUMNS = "id,title,slug,excerpt,category,cover_image,read_time,created_at,published_at";

type ArchiveProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw || "1", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function archivePath(page: number) {
  return page <= 1 ? "/artikel" : `/artikel?page=${page}`;
}

export async function generateMetadata({
  searchParams
}: ArchiveProps): Promise<Metadata> {
  const query = await searchParams;
  const currentPage = parsePage(query.page);
  const canonical = archivePath(currentPage);

  const title =
    currentPage > 1
      ? `Artikel AI Terbaru — Halaman ${currentPage}`
      : "Artikel AI Terbaru dan Panduan Lengkap";

  const description =
    "Jelajahi berita, panduan belajar, tutorial, tools, model, prompt, dan perbandingan AI dalam bahasa Indonesia.";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description
    }
  };
}

export default async function ArticlesArchive({
  searchParams
}: ArchiveProps) {
  const query = await searchParams;
  const currentPage = parsePage(query.page);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServerSupabase();

  let articles: ArticleCardData[] = [];
  let totalArticles = 0;

  if (supabase) {
    const {
      data,
      count,
      error
    } = await supabase
      .from("articles")
      .select(ARTICLE_CARD_COLUMNS, { count: "exact" })
      .eq("status", "published")
      .order("published_at", {
        ascending: false,
        nullsFirst: false
      })
      .range(from, to);

    if (error?.code === "PGRST103") {
      notFound();
    }

    if (error) {
      throw new Error(`Gagal mengambil daftar artikel: ${error.message}`);
    }

    articles = (data || []) as ArticleCardData[];
    totalArticles = count || 0;
  }

  const totalPages = Math.max(
    1,
    Math.ceil(totalArticles / PAGE_SIZE)
  );

  if (currentPage > totalPages) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const currentUrl = `${siteUrl}${archivePath(currentPage)}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      currentPage > 1
        ? `Artikel AIUpdateId Halaman ${currentPage}`
        : "Artikel AIUpdateId",
    url: currentUrl,
    inLanguage: "id-ID",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: from + index + 1,
        url: `${siteUrl}/artikel/${article.slug}`,
        name: article.title
      }))
    }
  };

  const schemaJson = JSON.stringify(collectionSchema).replace(
    /</g,
    "\\u003c"
  );

  return (
    <main className="page">
      <section className="container intro articleArchiveIntro">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span>/</span>
          <span>Artikel</span>
        </nav>

        <small>PUSAT ARTIKEL</small>
        <h1>Artikel AI yang terstruktur dan mudah dipahami</h1>
        <p>
          Temukan berita, panduan dasar, tutorial praktis,
          ulasan tools, model AI, prompt, dan perbandingan.
        </p>

        <div className="pills articleCategoryPills">
          {articleCategories.map(category => (
            <Link
              href={`/kategori/${category.slug}`}
              key={category.slug}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="container compact">
        <div className="sectionHead">
          <div>
            <small>SEMUA ARTIKEL</small>
            <h2>
              {currentPage > 1
                ? `Halaman ${currentPage}`
                : "Terbitan terbaru"}
            </h2>
          </div>

          <p>{totalArticles} artikel diterbitkan</p>
        </div>

        {articles.length > 0 ? (
          <div className="grid">
            {articles.map(article => (
              <ArticleCard key={article.id} a={article} />
            ))}
          </div>
        ) : (
          <div className="empty">
            Belum ada artikel yang diterbitkan.
          </div>
        )}

        <Pagination
          basePath="/artikel"
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    </main>
  );
}
