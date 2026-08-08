-- AIUpdateId Prompt Library V1
-- Jalankan SEKALI di Supabase SQL Editor.

create table if not exists public.ai_prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  description text,
  prompt_text text not null,
  tool_slug text,
  tool_name text,
  level text default 'Pemula',
  variables text[] default '{}',
  example_input text,
  example_output text,
  tips text[] default '{}',
  tags text[] default '{}',
  faq jsonb default '[]'::jsonb,
  featured boolean default false,
  status text default 'draft' check (status in ('draft','published')),
  seo_title text,
  meta_description text,
  view_count bigint default 0,
  copy_count bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ai_prompts enable row level security;

drop policy if exists "Public can read published prompts" on public.ai_prompts;
create policy "Public can read published prompts" on public.ai_prompts
for select to anon, authenticated
using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Authenticated can insert prompts" on public.ai_prompts;
create policy "Authenticated can insert prompts" on public.ai_prompts
for insert to authenticated with check (true);

drop policy if exists "Authenticated can update prompts" on public.ai_prompts;
create policy "Authenticated can update prompts" on public.ai_prompts
for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated can delete prompts" on public.ai_prompts;
create policy "Authenticated can delete prompts" on public.ai_prompts
for delete to authenticated using (true);

create index if not exists ai_prompts_status_idx on public.ai_prompts(status);
create index if not exists ai_prompts_category_idx on public.ai_prompts(category);
create index if not exists ai_prompts_featured_idx on public.ai_prompts(featured);
create index if not exists ai_prompts_tags_gin_idx on public.ai_prompts using gin(tags);
