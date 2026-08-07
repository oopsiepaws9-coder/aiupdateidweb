-- AIUpdateId V9 Full Release Candidate
-- Jalankan seluruh query ini di Supabase SQL Editor.

create table if not exists public.ai_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  category text,
  logo_url text,
  cover_image text,
  official_url text,
  pricing text,
  has_free_plan boolean default false,
  platforms text[] default '{}',
  tags text[] default '{}',
  rating numeric(3,1) default 0,
  ease_score numeric(3,1) default 0,
  feature_score numeric(3,1) default 0,
  value_score numeric(3,1) default 0,
  indonesia_score numeric(3,1) default 0,
  pros text[] default '{}',
  cons text[] default '{}',
  faq jsonb default '[]'::jsonb,
  status text default 'draft',
  featured boolean default false,
  view_count bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ai_models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  provider text,
  short_description text,
  description text,
  model_type text,
  context_window text,
  multimodal boolean default false,
  availability text,
  pricing text,
  official_url text,
  tags text[] default '{}',
  strengths text[] default '{}',
  limitations text[] default '{}',
  status text default 'draft',
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  slug text unique not null,
  short_definition text,
  definition text,
  example text,
  related_terms text[] default '{}',
  status text default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.comparisons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  item_a_name text not null,
  item_b_name text not null,
  summary text,
  verdict text,
  comparison_rows jsonb default '[]'::jsonb,
  faq jsonb default '[]'::jsonb,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ai_tools enable row level security;
alter table public.ai_models enable row level security;
alter table public.glossary_terms enable row level security;
alter table public.comparisons enable row level security;

-- Public read published
do $$ begin
  if not exists (select 1 from pg_policies where policyname='Public read published ai tools') then
    create policy "Public read published ai tools" on public.ai_tools for select to anon using (status='published');
  end if;
  if not exists (select 1 from pg_policies where policyname='Auth manage ai tools') then
    create policy "Auth manage ai tools" on public.ai_tools for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname='Public read published ai models') then
    create policy "Public read published ai models" on public.ai_models for select to anon using (status='published');
  end if;
  if not exists (select 1 from pg_policies where policyname='Auth manage ai models') then
    create policy "Auth manage ai models" on public.ai_models for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname='Public read glossary') then
    create policy "Public read glossary" on public.glossary_terms for select to anon using (status='published');
  end if;
  if not exists (select 1 from pg_policies where policyname='Auth manage glossary') then
    create policy "Auth manage glossary" on public.glossary_terms for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname='Public read comparisons') then
    create policy "Public read comparisons" on public.comparisons for select to anon using (status='published');
  end if;
  if not exists (select 1 from pg_policies where policyname='Auth manage comparisons') then
    create policy "Auth manage comparisons" on public.comparisons for all to authenticated using (true) with check (true);
  end if;
end $$;

create index if not exists ai_tools_slug_idx on public.ai_tools(slug);
create index if not exists ai_tools_category_idx on public.ai_tools(category);
create index if not exists ai_tools_status_idx on public.ai_tools(status);
create index if not exists ai_models_slug_idx on public.ai_models(slug);
create index if not exists glossary_slug_idx on public.glossary_terms(slug);
create index if not exists comparisons_slug_idx on public.comparisons(slug);
