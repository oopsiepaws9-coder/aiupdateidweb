import type { Metadata } from "next";
import PromptCategoryClient from "@/components/PromptCategoryClient";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";
import type { PromptItem } from "@/lib/prompt-types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Prompt Artikel AI untuk Membuat dan Mengoptimasi Artikel",
  description: "Etalase prompt artikel AI siap pakai untuk membuat artikel SEO, outline, pembuka, FAQ, CTA, internal link, update artikel lama, dan audit konten.",
  alternates: { canonical: "/prompt/artikel" },
  openGraph: {
    title: "Prompt Artikel AI Siap Pakai",
    description: "Kumpulan prompt artikel untuk membuat, mengoptimasi, audit, dan memperbaiki artikel dengan bantuan AI.",
    type: "website",
    url: "/prompt/artikel"
  }
};

export default async function PromptArtikelPage() {
  const supabase = createServerSupabase();
  let prompts: PromptItem[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("ai_prompts")
      .select("*")
      .eq("status", "published")
      .eq("category", "Artikel")
      .order("featured", { ascending: false })
      .order("updated_at", { ascending: false });

    prompts = (data || []) as PromptItem[];
  }

  const base = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Prompt Artikel AIUpdateId",
    url: `${base}/prompt/artikel`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: prompts.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${base}/prompts/${p.slug}`,
        name: p.title
      }))
    }
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <PromptCategoryClient prompts={prompts} />
  </>;
}
