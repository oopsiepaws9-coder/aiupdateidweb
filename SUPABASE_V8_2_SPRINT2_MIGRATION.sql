-- AIUpdateId V8.2 Sprint 2 — Smart Homepage
-- Jalankan seluruh query ini di Supabase SQL Editor.

alter table public.articles add column if not exists editor_pick boolean default false;
alter table public.articles add column if not exists view_count bigint default 0;

create index if not exists articles_editor_pick_idx on public.articles(editor_pick);
create index if not exists articles_breaking_idx on public.articles(breaking);
create index if not exists articles_featured_idx on public.articles(featured);
create index if not exists articles_view_count_idx on public.articles(view_count desc);
