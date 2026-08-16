import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Kontak AIUpdateId — Hubungi Tim Editorial" },
  description: "Hubungi AIUpdateId untuk menyampaikan pertanyaan, koreksi, masukan editorial, kerja sama, atau informasi terkait konten AI.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/kontak" },
  openGraph: {
    title: "Kontak AIUpdateId — Hubungi Tim Editorial",
    description: "Hubungi AIUpdateId untuk menyampaikan pertanyaan, koreksi, masukan editorial, kerja sama, atau informasi terkait konten AI.",
    url: "/kontak",
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
    title: "Kontak AIUpdateId — Hubungi Tim Editorial",
    description: "Hubungi AIUpdateId untuk menyampaikan pertanyaan, koreksi, masukan editorial, kerja sama, atau informasi terkait konten AI.",
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
