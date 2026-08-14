create extension if not exists btree_gist;

create table if not exists public.demo_snapshots (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.room_assignments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null,
  reservation_id uuid not null,
  room_id uuid not null,
  stay_range daterange not null,
  status text not null check (status in ('active', 'released')) default 'active',
  created_at timestamptz not null default now()
);

alter table public.room_assignments
  add constraint room_assignments_no_overlap
  exclude using gist (property_id with =, room_id with =, stay_range with &&)
  where (status = 'active');

alter table public.demo_snapshots enable row level security;
alter table public.room_assignments enable row level security;

create policy "authenticated demo readers" on public.demo_snapshots
  for select to authenticated using (true);
create policy "authenticated demo writers" on public.demo_snapshots
  for all to authenticated using (true) with check (true);

alter publication supabase_realtime add table public.demo_snapshots;
