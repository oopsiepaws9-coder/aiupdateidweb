import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Kebijakan Privasi | AIUpdateId" },
  description: "Pelajari bagaimana AIUpdateId menangani informasi, data penggunaan, cookie, layanan pihak ketiga, dan privasi pengunjung situs.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privasi" },
  openGraph: {
    title: "Kebijakan Privasi | AIUpdateId",
    description: "Pelajari bagaimana AIUpdateId menangani informasi, data penggunaan, cookie, layanan pihak ketiga, dan privasi pengunjung situs.",
    url: "/privasi",
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
    title: "Kebijakan Privasi | AIUpdateId",
    description: "Pelajari bagaimana AIUpdateId menangani informasi, data penggunaan, cookie, layanan pihak ketiga, dan privasi pengunjung situs.",
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
