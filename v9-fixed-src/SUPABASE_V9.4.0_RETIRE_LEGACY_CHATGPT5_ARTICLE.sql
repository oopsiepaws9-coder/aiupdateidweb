-- AIUpdateId V9.4.0 — retire legacy ChatGPT-5 duplicate/cannibalization candidate
-- NON-DESTRUCTIVE: keeps the row/content, only changes public status to draft.
-- Safe to inspect before and after.

begin;

-- Confirm both rows exist before change.
select title, slug, status, category, updated_at
from public.articles
where slug in (
  'chatgpt-5-resmi-hadir',
  'chatgpt-5-bukan-sekadar-chatbot-10-hal-penting-yang-harus-diketahui-semua-orang-kategori-ai'
)
order by slug;

-- Retire only the malformed legacy URL. Content remains stored in Supabase.
update public.articles
set status = 'draft', updated_at = now()
where slug = 'chatgpt-5-bukan-sekadar-chatbot-10-hal-penting-yang-harus-diketahui-semua-orang-kategori-ai'
  and status = 'published';

commit;

-- Verify final state.
select title, slug, status, category, updated_at
from public.articles
where slug in (
  'chatgpt-5-resmi-hadir',
  'chatgpt-5-bukan-sekadar-chatbot-10-hal-penting-yang-harus-diketahui-semua-orang-kategori-ai'
)
order by slug;
