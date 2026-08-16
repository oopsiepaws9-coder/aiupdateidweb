import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Tentang AIUpdateId — Portal AI Indonesia" },
  description: "Kenali AIUpdateId, portal AI Indonesia yang menyajikan berita, tutorial, ulasan, glosarium, dan panduan AI yang mudah dipahami.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/tentang" },
  openGraph: {
    title: "Tentang AIUpdateId — Portal AI Indonesia",
    description: "Kenali AIUpdateId, portal AI Indonesia yang menyajikan berita, tutorial, ulasan, glosarium, dan panduan AI yang mudah dipahami.",
    url: "/tentang",
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
    title: "Tentang AIUpdateId — Portal AI Indonesia",
    description: "Kenali AIUpdateId, portal AI Indonesia yang menyajikan berita, tutorial, ulasan, glosarium, dan panduan AI yang mudah dipahami.",
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
