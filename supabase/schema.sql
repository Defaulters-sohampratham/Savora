-- ==============================================================================
-- Savora Database Schema & Auto-Profile Provisioning
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create Profiles Table (Linked 1:1 with auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null default 'Worker',
  role text not null default 'Gig Partner',
  category text default 'Rideshare',
  city text default 'Bengaluru',
  essential_expenses integer not null default 18000,
  monthly_emi integer not null default 3500,
  current_savings integer not null default 12000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create Monthly Income Records Table
create table if not exists public.income_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  income_date date not null,
  source_label text null,
  created_at timestamptz not null default now()
);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.income_records enable row level security;

-- Profiles RLS Policies:
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Income Records RLS Policies:
create policy "Users can view own income records"
  on public.income_records for select
  using (auth.uid() = profile_id);

create policy "Users can manage own income records"
  on public.income_records for all
  using (auth.uid() = profile_id);

-- 4. Automatic Trigger to Create Profile on User Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_name text;
  user_category text;
begin
  user_name := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Worker');
  user_category := coalesce(new.raw_user_meta_data->>'category', 'Rideshare');

  -- Insert profile
  insert into public.profiles (id, display_name, role, category, city, essential_expenses, monthly_emi, current_savings)
  values (
    new.id,
    user_name,
    user_category,
    user_category,
    'Bengaluru',
    18000,
    3500,
    14000
  )
  on conflict (id) do nothing;

  -- Seed initial 6-month demo income history so deterministic calculations work immediately
  insert into public.income_records (profile_id, amount, income_date, source_label)
  values
    (new.id, 26000, '2026-03-31', 'Platform Earnings'),
    (new.id, 28500, '2026-04-30', 'Platform Earnings'),
    (new.id, 24000, '2026-05-31', 'Platform Earnings'),
    (new.id, 31000, '2026-06-30', 'Platform Earnings'),
    (new.id, 29000, '2026-07-31', 'Platform Earnings'),
    (new.id, 32500, '2026-08-31', 'Platform Earnings')
  on conflict do nothing;

  return new;
end;
$$;

-- Drop trigger if it exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
