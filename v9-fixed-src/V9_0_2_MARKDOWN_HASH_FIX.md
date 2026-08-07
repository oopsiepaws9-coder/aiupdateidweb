# V9.0.2 Markdown Hash Fix

Patch kecil di atas V9.0.1 Stable.

## Yang diperbaiki
- Menghapus tanda `#` ekstra yang masih terlihat di judul artikel.
- Menangani pola seperti `## # Judul`, `### # Subjudul`, dan variasi hash ganda lainnya.
- Tetap mempertahankan heading sebagai H2/H3 yang benar.
- Tidak mengubah layout mobile, tabel, gambar header, SEO, CMS, atau database.

## Database
Tidak perlu SQL dan artikel lama tidak perlu diedit satu per satu.

## File utama yang berubah
- `components/ArticleBody.tsx`
- `package.json` (versi 9.0.2)
