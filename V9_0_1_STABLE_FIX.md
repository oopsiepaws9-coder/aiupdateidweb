# AIUpdateId V9.0.1 Stable Hotfix

Basis: AIUpdateId V9 Full + Technical SEO.

## Diperbaiki
- Tabel artikel tidak lagi memperlebar seluruh halaman pada HP.
- Hanya tabel yang scroll horizontal.
- Kolom artikel diberi `min-width: 0` agar tidak terdorong oleh tabel 680px.
- Header image 16:9 selalu mengikuti lebar artikel.
- Sidebar artikel desktop tidak mengganggu mobile.
- Markdown `#`, `##Judul`, indentasi Markdown, dan outer code fence lebih tahan terhadap copy/paste.
- H1 di isi artikel otomatis menjadi H2 karena judul halaman sudah menjadi H1.
- Daftar Isi membaca heading setelah Markdown selesai dirender.
- Internal link tetap di tab yang sama; external link membuka tab baru.
- Box editorial otomatis untuk Tips, Kesalahan Umum, Intinya, Pandangan AIUpdateId, Lanjut Belajar, dan Contoh yang Baik.
- Tipografi list, heading, tabel, dan artikel mobile dirapikan.

## SQL
Tidak ada migrasi SQL baru.

## Setelah push ke GitHub
Vercel yang sudah terkoneksi ke `oopsiepaws9-coder/aiupdateidweb` akan membuat deployment baru otomatis.
