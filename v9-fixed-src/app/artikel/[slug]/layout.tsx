import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";
import { cleanArticleTitle } from "@/lib/utils";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createServerSupabase();
  const siteUrl = getSiteUrl();

  if (!supabase) {
    return {
      title: "Artikel",
      alternates: { canonical: `/artikel/${params.slug}` }
    };
  }

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .maybeSingle();

  if (!article) {
    return {
      title: "Artikel tidak ditemukan",
      robots: { index: false, follow: false }
    };
  }

  const title = article.seo_title || cleanArticleTitle(article.title);
  const description =
    article.meta_description || article.excerpt || "Artikel AIUpdateId";
  const canonical =
    article.canonical_url || `${siteUrl}/artikel/${article.slug}`;
  const image = article.cover_image || `${siteUrl}/icon-512.png`;

  return {
    title,
    description,
    keywords: article.tags || undefined,
    alternates: { canonical },
    robots: article.no_index
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "AIUpdateId",
      locale: "id_ID",
      title: article.og_title || title,
      description: article.og_description || description,
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at,
      section: article.category || undefined,
      tags: article.tags || undefined,
      images: [{ url: image, alt: article.alt_text || title }]
    },
    twitter: {
      card: "summary_large_image",
      title: article.og_title || title,
      description: article.og_description || description,
      images: [image]
    }
  };
}

export default function ArticleLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
