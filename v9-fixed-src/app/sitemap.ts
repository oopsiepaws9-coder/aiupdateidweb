import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";

// Refresh dynamic CMS URLs reasonably quickly after publish/unpublish.
export const revalidate = 60;

const RETIRED_ARTICLE_SLUGS = new Set([
  "chatgpt-5-bukan-sekadar-chatbot-10-hal-penting-yang-harus-diketahui-semua-orang-kategori-ai"
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const supabase = createServerSupabase();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/models`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/glossary`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/compare`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/prompts`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tag`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tentang`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kontak`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privasi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/disclaimer`, changeFrequency: "yearly", priority: 0.2 }
  ];

  if (!supabase) return staticPages;

  const [articles, tools, models, glossary, comparisons, prompts] = await Promise.all([
    supabase.from("articles").select("slug,updated_at,published_at").eq("status","published"),
    supabase.from("ai_tools").select("slug,updated_at").eq("status","published"),
    supabase.from("ai_models").select("slug,updated_at").eq("status","published"),
    supabase.from("glossary_terms").select("slug,updated_at").eq("status","published"),
    supabase.from("comparisons").select("slug,updated_at").eq("status","published"),
    supabase.from("ai_prompts").select("slug,updated_at").eq("status","published")
  ]);

  const dynamic: MetadataRoute.Sitemap = [
    ...(articles.data || []).filter(item => !RETIRED_ARTICLE_SLUGS.has(item.slug)).map(item => ({
      url: `${base}/artikel/${item.slug}`,
      lastModified: item.updated_at || item.published_at || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...(tools.data || []).map(item => ({
      url: `${base}/tools/${item.slug}`,
      lastModified: item.updated_at || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...(models.data || []).map(item => ({
      url: `${base}/models/${item.slug}`,
      lastModified: item.updated_at || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...(glossary.data || []).map(item => ({
      url: `${base}/glossary/${item.slug}`,
      lastModified: item.updated_at || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6
    })),
    ...(comparisons.data || []).map(item => ({
      url: `${base}/compare/${item.slug}`,
      lastModified: item.updated_at || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...(prompts.data || []).map(item => ({
      url: `${base}/prompts/${item.slug}`,
      lastModified: item.updated_at || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.75
    }))
  ];

  return [...staticPages, ...dynamic];
}
