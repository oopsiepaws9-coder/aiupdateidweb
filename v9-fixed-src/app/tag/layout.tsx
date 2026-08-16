import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Tag AI: Jelajahi Topik dan Panduan AI | AIUpdateId" },
  description: "Jelajahi artikel, tutorial, berita, dan panduan AI berdasarkan tag agar Anda lebih mudah menemukan topik yang dibutuhkan.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/tag" },
  openGraph: {
    title: "Tag AI: Jelajahi Topik dan Panduan AI | AIUpdateId",
    description: "Jelajahi artikel, tutorial, berita, dan panduan AI berdasarkan tag agar Anda lebih mudah menemukan topik yang dibutuhkan.",
    url: "/tag",
    type: "website",
    locale: "id_ID",
    siteName: "AIUpdateId",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "AIUpdateId",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tag AI: Jelajahi Topik dan Panduan AI | AIUpdateId",
    description: "Jelajahi artikel, tutorial, berita, dan panduan AI berdasarkan tag agar Anda lebih mudah menemukan topik yang dibutuhkan.",
    images: ["/icon-512.png"],
  },
};

export default function RouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
