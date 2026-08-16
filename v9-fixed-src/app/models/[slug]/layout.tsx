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
    title: "Model AI tidak ditemukan",
    description: "Data model AI yang Anda cari tidak tersedia atau belum dipublikasikan.",
    robots: { index: false, follow: false },
    alternates: { canonical },
  };
}

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `/models/${slug}`;
  const supabase = createServerSupabase();

  if (!supabase) return missingMetadata(canonical);

  const { data: model } = await supabase
    .from("ai_models")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!model) return missingMetadata(canonical);

  const title = `${model.name}: Fitur dan Spesifikasi`;
  const fallbackDescription = `Pelajari fitur, spesifikasi, kemampuan, kelebihan, dan kegunaan ${model.name} untuk berbagai kebutuhan AI.`;
  const rawDescription = cleanText(
    model.short_description || model.description || fallbackDescription
  );
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
