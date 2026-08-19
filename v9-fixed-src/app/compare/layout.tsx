import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Perbandingan AI: Fitur, Harga, dan Kegunaan | AIUpdateId" },
  description: "Bandingkan fitur, kemampuan, harga, kelebihan, dan kekurangan berbagai AI untuk memilih alat yang paling sesuai dengan kebutuhan Anda.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Perbandingan AI: Fitur, Harga, dan Kegunaan | AIUpdateId",
    description: "Bandingkan fitur, kemampuan, harga, kelebihan, dan kekurangan berbagai AI untuk memilih alat yang paling sesuai dengan kebutuhan Anda.",
    url: "/compare",
    type: "website",
    locale: "id_ID",
    siteName: "AIUpdateId",
    images: [
      {
        url: "/aiupdateid-icon-v2-512.png",
        width: 512,
        height: 512,
        alt: "AIUpdateId",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perbandingan AI: Fitur, Harga, dan Kegunaan | AIUpdateId",
    description: "Bandingkan fitur, kemampuan, harga, kelebihan, dan kekurangan berbagai AI untuk memilih alat yang paling sesuai dengan kebutuhan Anda.",
    images: ["/aiupdateid-icon-v2-512.png"],
  },
};

export default function RouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
