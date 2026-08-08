# AIUpdateId — Prompt Library V1

## Public V9.3.0
- `/prompts` — direktori Prompt Library baru.
- `/prompts/[slug]` — detail prompt SEO-friendly.
- `/prompt` lama otomatis diarahkan ke `/prompts`.
- Search, filter kategori, level, dan tool.
- Featured prompts / Pilihan Editor.
- Tombol salin prompt.
- Variabel prompt, contoh penggunaan, tips, FAQ.
- Link internal ke AI Tools terkait.
- Canonical, metadata, CollectionPage + HowTo schema.
- Prompt published ikut sitemap.

## CMS V1.2.0
- Menu `/admin/prompts`.
- Editor prompt lengkap: identitas, kategori, tool, level, prompt utama, variables, tips, contoh, tags, FAQ, SEO, Featured, Draft/Published.
- Preview ke website public.

## Supabase
WAJIB jalankan sekali:
`SUPABASE_PROMPT_LIBRARY_V1.sql`

OPSIONAL starter data:
`SUPABASE_PROMPT_LIBRARY_STARTER_20_DRAFT.sql`

Starter berisi 20 prompt berkualitas dalam status DRAFT. Review di CMS lalu publish satu per satu.

## Urutan pemasangan
1. Supabase → SQL Editor → jalankan `SUPABASE_PROMPT_LIBRARY_V1.sql`.
2. Deploy CMS V1.2.0.
3. Cek `/admin/prompts`.
4. Jalankan starter seed 20 draft jika diinginkan.
5. Review prompt di CMS dan publish beberapa prompt.
6. Deploy Public V9.3.0.
7. Cek `/prompts`, `/prompts/belajar-topik-dari-nol`, dan `/sitemap.xml`.

Paket ini dibangun dari Public V9.2.0 + CMS V1.1.0 yang sudah berisi AI Tools Directory. V9.2.1 tidak digunakan.
