import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Disclaimer | AIUpdateId" },
  description: "Baca batasan tanggung jawab, ketentuan informasi, penggunaan referensi, dan prinsip editorial yang diterapkan oleh AIUpdateId.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/disclaimer" },
  openGraph: {
    title: "Disclaimer | AIUpdateId",
    description: "Baca batasan tanggung jawab, ketentuan informasi, penggunaan referensi, dan prinsip editorial yang diterapkan oleh AIUpdateId.",
    url: "/disclaimer",
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
    title: "Disclaimer | AIUpdateId",
    description: "Baca batasan tanggung jawab, ketentuan informasi, penggunaan referensi, dan prinsip editorial yang diterapkan oleh AIUpdateId.",
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
