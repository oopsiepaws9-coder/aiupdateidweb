-- AIUpdateId V8.2 Sprint 3 — Tag System & Smart Search
-- Jalankan seluruh query ini di Supabase SQL Editor.

create index if not exists articles_tags_gin_search_idx
on public.articles using gin(tags);

create extension if not exists pg_trgm;

create index if not exists articles_title_trgm_idx
on public.articles using gin(title gin_trgm_ops);

create index if not exists articles_excerpt_trgm_idx
on public.articles using gin(excerpt gin_trgm_ops);
