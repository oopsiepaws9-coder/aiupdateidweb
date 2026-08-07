# AIUpdateId Public 9.1.0

Website publik hasil pemisahan dari V9.0.3.

## Perubahan
- Route `/admin` dihapus total dari aplikasi publik.
- Link Admin di header dihapus.
- Komponen Editor/MediaPicker/SimpleCrud tidak ikut aplikasi publik.
- Sitemap, robots, canonical, RSS, artikel, tools, models, glossary, comparison, search, dan SEO tetap tersedia.
- Tetap membaca data publik dari project Supabase yang sama.
- Next.js dinaikkan dari 14.2.31 ke patch 14.2.35.
- Canonical artikel yang tersimpan dengan domain deployment lama otomatis dinormalisasi ke domain Production utama.

## Environment Variables
- `NEXT_PUBLIC_SITE_URL` = URL website publik utama
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `GOOGLE_SITE_VERIFICATION` (tetap di PUBLIC saja)

## Database
Tidak perlu SQL atau migrasi database.
