-- AIUpdateId V8.1 CMS Professional
-- Jalankan seluruh query ini di Supabase SQL Editor.

alter table public.articles add column if not exists seo_title text;
alter table public.articles add column if not exists meta_description text;
alter table public.articles add column if not exists tags text[] default '{}';
alter table public.articles add column if not exists focus_keyword text;
alter table public.articles add column if not exists canonical_url text;
alter table public.articles add column if not exists og_title text;
alter table public.articles add column if not exists og_description text;
alter table public.articles add column if not exists alt_text text;
alter table public.articles add column if not exists image_caption text;
alter table public.articles add column if not exists image_source text;
alter table public.articles add column if not exists faq jsonb default '[]'::jsonb;
alter table public.articles add column if not exists call_to_action text;
alter table public.articles add column if not exists breaking boolean default false;
alter table public.articles add column if not exists scheduled_at timestamptz;
alter table public.articles add column if not exists no_index boolean default false;

create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_category_idx on public.articles(category);
create index if not exists articles_published_at_idx on public.articles(published_at desc);
create index if not exists articles_tags_gin_idx on public.articles using gin(tags);
