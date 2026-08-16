import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createServerSupabase } from "@/lib/supabase-server";

type MetadataProps = {
  params: Promise<{ slug: string }>;
};

type LayoutProps = MetadataProps & {
  children: ReactNode;
};

function cleanText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function missingMetadata(canonical: string): Metadata {
  return {
    title: { absolute: "Istilah AI tidak ditemukan | AIUpdateId" },
    description: "Istilah AI yang Anda cari tidak tersedia atau belum dipublikasikan.",
    robots: { index: false, follow: false },
    alternates: { canonical },
  };
}

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `/glossary/${slug}`;
  const supabase = createServerSupabase();

  if (!supabase) return missingMetadata(canonical);

  const { data: item } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!item) return missingMetadata(canonical);

  const title = `${item.term}: Pengertian dan Contoh`;
  const baseDefinition = cleanText(
    item.short_definition || item.definition || item.explanation
  );
  const fallbackDescription = `Pelajari pengertian ${item.term}, cara kerjanya, contoh penggunaan, dan hubungannya dengan istilah AI lainnya.`;
  const rawDescription = baseDefinition
    ? `Apa itu ${item.term}? ${baseDefinition}`
    : fallbackDescription;
  const description =
    rawDescription.length > 160
      ? `${rawDescription.slice(0, 157).trimEnd()}...`
      : rawDescription;

  return {
    title: { absolute: `${title} | AIUpdateId` },
    description,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title: `${title} | AIUpdateId`,
      description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AIUpdateId`,
      description,
    },
  };
}

export default function SlugLayout({ children }: LayoutProps) {
  return children;
}
