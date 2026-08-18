/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/kategori/tools-ai", destination: "/kategori/ai-tools", permanent: true },
      { source: "/kategori/review", destination: "/kategori/perbandingan-ai", permanent: true },
      { source: "/kategori/prompt-ai", destination: "/kategori/prompt", permanent: true },
      { source: "/prompt", destination: "/prompts", permanent: true }
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
