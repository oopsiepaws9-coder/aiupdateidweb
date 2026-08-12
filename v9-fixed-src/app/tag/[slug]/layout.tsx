import type { Metadata } from "next";
import type { ReactNode } from "react";

type MetadataProps = {
  params: Promise<{ slug: string }>;
};

type LayoutProps = MetadataProps & {
  children: ReactNode;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    alternates: {
      canonical: "/tag/" + slug,
    },
  };
}

export default function SlugLayout({ children }: LayoutProps) {
  return children;
}
