import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleCard, {
  type ArticleCardData
} from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { getArticleCategoryBySlug } from "@/lib/article-categories";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

const PAGE_SIZE = 18;

const ARTICLE_CARD_COLUMNS =
  "id,title,slug,excerpt,category,cover_image,read_time,created_at,published_at";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw || "1", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function categoryPath(slug: string, page: number) {
  const basePath = `/kategori/${slug}`;
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export async function generateMetadata({
  params,
  searchParams
}: CategoryPageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams
  ]);

  const category = getArticleCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori tidak ditemukan",
      robots: { index: false, follow: false }
    };
  }

  const currentPage = parsePage(query.page);
  const canonical = categoryPath(category.slug, currentPage);

  const title =
    currentPage > 1
      ? `${category.name}: Artikel AI — Halaman ${currentPage}`
      : `${category.name}: Artikel dan Panduan AI`;

  const description =
    `${category.description} Jelajahi artikel pilihan AIUpdateId dalam bahasa Indonesia.`;

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

export default async function CategoryPage({
  params,
  searchParams
}: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams
  ]);

  const category = getArticleCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const currentPage = parsePage(query.page);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const basePath = `/kategori/${category.slug}`;

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
      .in("category", [...category.databaseValues])
      .order("published_at", {
        ascending: false,
        nullsFirst: false
      })
      .range(from, to);

    if (error) {
      throw new Error(
        `Gagal mengambil kategori ${category.name}: ${error.message}`
      );
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
  const currentUrl =
    `${siteUrl}${categoryPath(category.slug, currentPage)}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      currentPage > 1
        ? `${category.name} — Halaman ${currentPage}`
        : category.name,
    description: category.description,
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
          <Link href="/artikel">Artikel</Link>
          <span>/</span>
          <span>{category.name}</span>
        </nav>

        <small>KATEGORI ARTIKEL</small>
        <h1>{category.name}</h1>
        <p>{category.description}</p>

        <Link className="secondary" href="/artikel">
          Lihat semua artikel
        </Link>
      </section>

      <section className="container compact">
        <div className="sectionHead">
          <div>
            <small>ARTIKEL DALAM KATEGORI</small>
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
            Belum ada artikel dalam kategori ini.
          </div>
        )}

        <Pagination
          basePath={basePath}
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
