import type { Metadata } from "next";
import { notFound } from "next/navigation";
import V9Detail from "@/components/V9Detail";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

// Comparison entries are edited/published from the CMS.
// Do not keep a stale 404 from when an entry was still draft.
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getComparison(slug: string) {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("comparisons")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return data;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const item = await getComparison(params.slug);
  const base = getSiteUrl();

  if (!item) {
    return {
      title: "Perbandingan AI",
      robots: { index: false, follow: true }
    };
  }

  const title = item.seo_title || item.title;
  const description = item.meta_description || item.summary ||
    `Bandingkan ${item.item_a_name} dan ${item.item_b_name} di AIUpdateId.`;

  return {
    title,
    description,
    keywords: item.focus_keyword ? [item.focus_keyword, item.item_a_name, item.item_b_name, "perbandingan AI"] : undefined,
    alternates: { canonical: `/compare/${item.slug}` },
    openGraph: {
      type: "article",
      url: `${base}/compare/${item.slug}`,
      siteName: "AIUpdateId",
      locale: "id_ID",
      title,
      description,
      images: [{ url: "/aiupdateid-icon-v2-512.png", width: 512, height: 512, alt: `${item.item_a_name} vs ${item.item_b_name}` }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/aiupdateid-icon-v2-512.png"]
    }
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const item = await getComparison(params.slug);
  if (!item) notFound();

  const base = getSiteUrl();

  const faq = Array.isArray(item.faq) ? item.faq : [];

  const webPageSchema = item ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: item.seo_title || item.title,
    description: item.meta_description || item.summary || "",
    url: `${base}/compare/${item.slug}`,
    inLanguage: "id-ID",
    dateModified: item.updated_at || undefined,
    about: [
      { "@type": "SoftwareApplication", name: item.item_a_name },
      { "@type": "SoftwareApplication", name: item.item_b_name }
    ]
  } : null;

  const faqSchema = faq.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((entry: any) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer
      }
    }))
  } : null;

  return (
    <>
      <V9Detail
        table="comparisons"
        slug={params.slug}
        initialItem={item}
        backHref="/compare"
        backLabel="Kembali ke Perbandingan"
      />
      {webPageSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
    </>
  );
}
