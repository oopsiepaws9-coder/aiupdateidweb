import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/lib/site-url";
import { GoogleAnalytics } from "@next/third-parties/google";
const siteUrl = getSiteUrl();
const googleAnalyticsId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "AIUpdateId",
  title: {
    default: "AIUpdateId — Portal AI Indonesia",
    template: "%s | AIUpdateId"
  },
  description:
    "Portal AI Indonesia untuk berita, tutorial, review, direktori tools, model AI, glossary, perbandingan, dan prompt yang mudah dipahami.",
  keywords: [
    "AI Indonesia",
    "berita AI",
    "tools AI",
    "model AI",
    "tutorial AI",
    "prompt AI",
    "ChatGPT Indonesia"
  ],
  authors: [{ name: "AIUpdateId", url: siteUrl }],
  creator: "AIUpdateId",
  publisher: "AIUpdateId",
  category: "technology",
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "RSS AIUpdateId" }]
    }
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/aiupdateid-favicon-v2.ico" },
      { url: "/aiupdateid-favicon-v2-32.png", sizes: "32x32", type: "image/png" },
      { url: "/aiupdateid-favicon-v2-16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [{ url: "/aiupdateid-apple-touch-v2.png", sizes: "180x180" }]
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "AIUpdateId",
    title: "AIUpdateId — Portal AI Indonesia",
    description:
      "Berita, tutorial, review, tools, model AI, glossary, perbandingan, dan prompt AI dalam bahasa Indonesia.",
    images: [{ url: "/aiupdateid-og-v1.png", width: 1731, height: 909, alt: "AIUpdateId — Portal AI Indonesia" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AIUpdateId — Portal AI Indonesia",
    description: "Portal referensi AI berbahasa Indonesia.",
    images: ["/aiupdateid-og-v1.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
    verification: {
    google: [
      ...(process.env.GOOGLE_SITE_VERIFICATION
        ? [process.env.GOOGLE_SITE_VERIFICATION]
        : []),
      "7OwR3XW--ifz2thEjkRxQkyVV1PQ9_cZYNaUv5O3g0A"
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#06182f" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AIUpdateId",
    url: siteUrl,
    logo: `${siteUrl}/aiupdateid-icon-v2-512.png`
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AIUpdateId",
    url: siteUrl,
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Header />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
      {googleAnalyticsId ? (
        <GoogleAnalytics gaId={googleAnalyticsId} />
      ) : null}
    </html>
  );
}
