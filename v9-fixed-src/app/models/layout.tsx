import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Model AI Terbaru: Spesifikasi dan Perbandingan",
  description: "Jelajahi database model AI terbaru, lengkap dengan penyedia, kemampuan, konteks, harga, kelebihan, kekurangan, dan perbandingan praktis.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/models" },
  openGraph: {
    title: "Model AI Terbaru: Spesifikasi dan Perbandingan | AIUpdateId",
    description: "Jelajahi database model AI terbaru, lengkap dengan kemampuan, harga, kelebihan, kekurangan, dan perbandingan praktis.",
    url: "/models",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Model AI Terbaru: Spesifikasi dan Perbandingan | AIUpdateId",
    description: "Jelajahi database model AI terbaru dan bandingkan kemampuan setiap model secara praktis.",
  },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
