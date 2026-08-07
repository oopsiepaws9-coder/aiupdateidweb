-- AIUpdateId V8.2 Sprint 1 — Media Library
-- Jalankan seluruh query ini di Supabase SQL Editor.

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text unique not null,
  public_url text not null,
  mime_type text,
  file_size bigint default 0,
  width integer,
  height integer,
  alt_text text,
  caption text,
  photographer text,
  source text,
  folder text default 'general',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.media enable row level security;

drop policy if exists "Public can read media metadata" on public.media;
drop policy if exists "Authenticated users can insert media" on public.media;
drop policy if exists "Authenticated users can update media" on public.media;
drop policy if exists "Authenticated users can delete media" on public.media;

create policy "Public can read media metadata"
on public.media for select
to public
using (true);

create policy "Authenticated users can insert media"
on public.media for insert
to authenticated
with check (true);

create policy "Authenticated users can update media"
on public.media for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete media"
on public.media for delete
to authenticated
using (true);

create index if not exists media_created_at_idx on public.media(created_at desc);
create index if not exists media_folder_idx on public.media(folder);
create index if not exists media_file_name_idx on public.media(file_name);
