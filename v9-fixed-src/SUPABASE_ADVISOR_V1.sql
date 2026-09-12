-- AIUpdateId Advisor V1 — feedback learning dataset
-- Applied to production Supabase via migration add_advisor_feedback_v1.

create table if not exists public.advisor_feedback (
  id uuid primary key default gen_random_uuid(),
  task_key text not null check (char_length(task_key) between 2 and 40),
  tool_id uuid not null references public.ai_tools(id) on delete cascade,
  helpful boolean not null,
  task_profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint advisor_feedback_profile_object check (jsonb_typeof(task_profile) = 'object'),
  constraint advisor_feedback_profile_size check (octet_length(task_profile::text) <= 4000)
);

create index if not exists advisor_feedback_task_key_idx on public.advisor_feedback(task_key);
create index if not exists advisor_feedback_tool_id_idx on public.advisor_feedback(tool_id);
create index if not exists advisor_feedback_created_at_idx on public.advisor_feedback(created_at desc);

alter table public.advisor_feedback enable row level security;

revoke all on table public.advisor_feedback from anon, authenticated;
grant insert on table public.advisor_feedback to anon, authenticated;

create policy "public_can_submit_advisor_feedback"
on public.advisor_feedback
for insert
to anon, authenticated
with check (
  task_key in ('research','writing','coding','documents','image','video','study','marketing','productivity')
  and jsonb_typeof(task_profile) = 'object'
  and octet_length(task_profile::text) <= 4000
);
