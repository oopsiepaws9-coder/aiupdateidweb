/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pjdfbcsmhsbnqrtqjduq.supabase.co",
        pathname: "/storage/v1/object/public/article-images/**"
      }
    ]
  },
  async redirects() {
    return [
      { source: "/kategori/tools-ai", destination: "/kategori/ai-tools", permanent: true },
      { source: "/kategori/review", destination: "/kategori/perbandingan-ai", permanent: true },
      { source: "/kategori/prompt-ai", destination: "/kategori/prompt", permanent: true },
      { source: "/prompt", destination: "/prompts", permanent: true },
      // Taxonomy Migration RC v1: semantic aliases with URL-changing slugs.
      { source: "/tag/ai-generatif", destination: "/tag/generative-ai", permanent: true },
      { source: "/tag/ai-untuk-bekerja", destination: "/tag/ai-untuk-kerja", permanent: true },
      { source: "/tag/ai-untuk-content-creator", destination: "/tag/ai-untuk-kreator", permanent: true },
      { source: "/tag/ai-untuk-produktivitas", destination: "/tag/produktivitas-ai", permanent: true },
      { source: "/tag/gemini-notebook", destination: "/tag/notebooklm", permanent: true },
      { source: "/tag/membuat-konten-dengan-ai", destination: "/tag/content-creator", permanent: true },
      { source: "/tag/perplexity", destination: "/tag/perplexity-ai", permanent: true },
      { source: "/tag/gemini", destination: "/tag/google-gemini", permanent: true },
      { source: "/tag/gemini-ai", destination: "/tag/google-gemini", permanent: true },
      { source: "/tag/suno-v6", destination: "/tag/suno", permanent: true }
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      },
      {
        source: "/(favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|icon-192.png|icon-512.png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      }
    ];
  }
};

export default nextConfig;
