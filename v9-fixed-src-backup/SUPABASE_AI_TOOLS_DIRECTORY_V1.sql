-- AIUpdateId AI Tools Directory V1
-- Jalankan sekali di Supabase SQL Editor. Aman untuk tabel V9 yang sudah ada.
alter table public.ai_tools add column if not exists provider text;
alter table public.ai_tools add column if not exists best_for text[] default '{}';
alter table public.ai_tools add column if not exists key_features text[] default '{}';
alter table public.ai_tools add column if not exists alternatives text[] default '{}';
alter table public.ai_tools add column if not exists seo_title text;
alter table public.ai_tools add column if not exists meta_description text;
alter table public.ai_tools add column if not exists editor_note text;
alter table public.ai_tools add column if not exists last_reviewed_at date;
create index if not exists ai_tools_featured_idx on public.ai_tools(featured);
create index if not exists ai_tools_rating_idx on public.ai_tools(rating desc);
create index if not exists ai_tools_tags_gin_idx on public.ai_tools using gin(tags);
create index if not exists ai_tools_best_for_gin_idx on public.ai_tools using gin(best_for);
