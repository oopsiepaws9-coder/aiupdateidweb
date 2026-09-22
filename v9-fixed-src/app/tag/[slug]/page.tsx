import ArticleCard from "@/components/ArticleCard";
import { isTaxonomyHub } from "@/config/taxonomy";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export const revalidate = 300;

function toTagSlug(tag: string) {
  return encodeURIComponent(
    tag.toLowerCase().trim().replace(/\s+/g, "-")
  );
}

function normalizeRequestedSlug(slug: string) {
  return encodeURIComponent(
    decodeURIComponent(slug)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
  );
}

const resolvePublishedTag = cache(async (slug: string) => {
  const requestedSlug = normalizeRequestedSlug(slug);
  const supabase = createServerSupabase();

  if (!supabase) {
    return null;
  }

  const { data: tagRows, error: tagsError } = await supabase
    .from("articles")
    .select("tags")
    .eq("status", "published");

  if (tagsError) {
    throw tagsError;
  }

  const matchingTags = Array.from(
    new Set(
      (tagRows || [])
        .flatMap((article) => article.tags || [])
        .filter((tag) => toTagSlug(tag) === requestedSlug)
    )
  );

  if (!matchingTags.length) {
    return null;
  }

  return {
    requestedSlug,
    label: matchingTags[0],
    matchingTags,
  };
});

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resolvedTag = await resolvePublishedTag(slug);

  if (!resolvedTag) {
    notFound();
  }

  const isHub = isTaxonomyHub(resolvedTag.requestedSlug);
  const canonical = `https://aiupdateid.com/tag/${resolvedTag.requestedSlug}`;

  return {
    title: isHub
      ? `Topik: ${resolvedTag.label} | AIUpdateId`
      : `Arsip Navigasi: ${resolvedTag.label} | AIUpdateId`,
    robots: {
      index: isHub,
      follow: true,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const resolvedTag = await resolvePublishedTag(slug);

  if (!resolvedTag) {
    notFound();
  }

  const supabase = createServerSupabase();
  let items: Article[] = [];
  const label = resolvedTag.label;

  if (supabase) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .overlaps("tags", resolvedTag.matchingTags)
      .order("published_at", {
        ascending: false,
        nullsFirst: false,
      });

    if (error) {
      throw error;
    }

    items = (data || []) as Article[];
  }

  return (
    <main className="page">
      <section className="container intro">
        <small>TAG</small>
        <h1>{label}</h1>
        <p>Kumpulan artikel AIUpdateId dengan tag {label}.</p>
      </section>

      <section className="container compact">
        <div className="grid">
          {items.map((article) => (
            <ArticleCard key={article.id} a={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
