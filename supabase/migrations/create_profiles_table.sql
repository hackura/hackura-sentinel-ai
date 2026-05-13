-- Create user_profiles table if it doesn't exist
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  company text,
  role text default 'analyst',
  display_name text,
  username text unique,
  discovery_source text,
  interest_reason text,
  onboarding_completed boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create indexes for better query performance
create index if not exists idx_user_profiles_id on public.user_profiles(id);
create index if not exists idx_user_profiles_email on public.user_profiles(email);
create index if not exists idx_user_profiles_username on public.user_profiles(username);
create index if not exists idx_user_profiles_onboarding_completed on public.user_profiles(onboarding_completed);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Drop existing policies if they exist, then recreate
drop policy if exists "Users can read own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;
drop policy if exists "Users can insert own profile" on public.user_profiles;

-- Create RLS policies
create policy "Users can read own profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.user_profiles
  for insert with check (auth.uid() = id);

-- Create or update trigger to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_user_profiles_updated_at on public.user_profiles;
create trigger handle_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.handle_updated_at();
