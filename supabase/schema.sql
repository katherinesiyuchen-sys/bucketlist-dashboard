-- Run this in your Supabase project: SQL Editor → New query
-- (If table already exists, run only the ALTER TABLE line at the bottom)

create table public.goals (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  title        text not null,
  target_date  text,
  tags         text[]   default '{}',
  notes        text     default '',
  steps        jsonb    default '[]',
  location     text     default '',
  image_url    text     default '',
  spotify_url  text     default '',
  completed    boolean  default false,
  completed_at timestamptz,
  created_at   timestamptz default now()
);

alter table public.goals enable row level security;

create policy "Users can manage their own goals"
  on public.goals
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Migration: run this if the table already exists ──
-- alter table public.goals add column if not exists spotify_url text default '';
