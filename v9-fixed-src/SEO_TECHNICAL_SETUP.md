# AIUpdateId V9 Full + Technical SEO

## Supabase
Jalankan `SUPABASE_V9_MIGRATION.sql` sebelum deploy jika belum pernah dijalankan.

## Environment Variables Vercel
Wajib:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Sangat disarankan:
- NEXT_PUBLIC_SITE_URL

Contoh setelah punya domain:
NEXT_PUBLIC_SITE_URL=https://aiupdateid.com

Opsional untuk Google Search Console:
- GOOGLE_SITE_VERIFICATION

Isi hanya token verifikasi, bukan seluruh meta tag.

## SEO teknis
- Metadata global
- Metadata artikel dinamis
- Canonical URL
- Open Graph
- Twitter Card
- Sitemap dinamis
- Robots.txt
- RSS dinamis
- Organization schema
- WebSite/SearchAction schema
- Article/FAQ schema yang sudah ada
- 404 khusus
- Header keamanan
- Cache favicon

## Setelah deploy
1. Buka `/robots.txt`
2. Buka `/sitemap.xml`
3. Buka `/rss.xml`
4. Daftarkan website ke Google Search Console.
5. Kirim URL sitemap.
6. Gunakan URL Inspection untuk meminta indeks halaman utama dan artikel pilar.

Catatan:
Jika NEXT_PUBLIC_SITE_URL belum diisi, sistem memakai domain produksi Vercel secara otomatis bila tersedia.
