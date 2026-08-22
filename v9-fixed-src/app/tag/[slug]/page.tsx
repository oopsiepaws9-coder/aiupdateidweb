import ArticleCard from "@/components/ArticleCard";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";
import { notFound } from "next/navigation";

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

export default async function TagPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const requestedSlug = normalizeRequestedSlug(params.slug);

  const supabase = createServerSupabase();

  let items: Article[] = [];
  let label = decodeURIComponent(params.slug).replace(/-/g, " ");

  if (supabase) {
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
      notFound();
    }

    label = matchingTags[0];

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .overlaps("tags", matchingTags)
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
