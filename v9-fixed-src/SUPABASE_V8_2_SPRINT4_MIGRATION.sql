-- AIUpdateId V8.2 Sprint 4 — Dashboard & SEO Automation
-- Jalankan seluruh query ini di Supabase SQL Editor.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text default 'active',
  created_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public can subscribe newsletter" on public.newsletter_subscribers;
drop policy if exists "Authenticated can read newsletter subscribers" on public.newsletter_subscribers;

create policy "Public can subscribe newsletter"
on public.newsletter_subscribers
for insert
to anon
with check (true);

create policy "Authenticated can read newsletter subscribers"
on public.newsletter_subscribers
for select
to authenticated
using (true);

create index if not exists newsletter_created_at_idx
on public.newsletter_subscribers(created_at desc);
