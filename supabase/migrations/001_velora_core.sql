create extension if not exists btree_gist;

create table public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null default 'owner' check (role = 'owner'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_users
    where id = auth.uid() and role = 'owner' and active
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to authenticated;

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  property_type text not null check (property_type in ('hotel', 'apartment', 'aparthotel')),
  status text not null default 'draft' check (status in ('draft', 'published', 'paused', 'archived')),
  address text not null,
  area text not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  timezone text not null default 'Asia/Tbilisi',
  currency text not null default 'GEL' check (currency = 'GEL'),
  check_in_time time not null default '15:00',
  check_out_time time not null default '12:00',
  contact_email text,
  contact_phone text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_translations (
  property_id uuid not null references public.properties(id) on delete cascade,
  locale text not null check (locale in ('en', 'ka')),
  name text not null,
  short_description text not null,
  description text not null,
  policies text,
  primary key (property_id, locale)
);

create table public.property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null unique,
  alt_en text not null,
  alt_ka text not null,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  focal_x numeric(4,3) not null default 0.5 check (focal_x between 0 and 1),
  focal_y numeric(4,3) not null default 0.5 check (focal_y between 0 and 1),
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index property_media_one_cover
  on public.property_media(property_id) where is_cover;

create table public.amenities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_ka text not null,
  icon text not null,
  active boolean not null default true
);

create table public.property_amenities (
  property_id uuid not null references public.properties(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete restrict,
  included boolean not null default true,
  note_en text,
  note_ka text,
  primary key (property_id, amenity_id)
);

create table public.room_types (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete restrict,
  code text not null,
  slug text not null unique,
  max_guests integer not null check (max_guests > 0),
  size_m2 numeric(6,2) check (size_m2 is null or size_m2 > 0),
  bed_type text not null,
  accessible boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, code)
);

create table public.room_type_translations (
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  locale text not null check (locale in ('en', 'ka')),
  name text not null,
  description text not null,
  primary key (room_type_id, locale)
);

create table public.room_type_media (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  storage_path text not null unique,
  alt_en text not null,
  alt_ka text not null,
  sort_order integer not null default 0,
  is_cover boolean not null default false
);

create unique index room_type_media_one_cover
  on public.room_type_media(room_type_id) where is_cover;

create table public.room_type_amenities (
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete restrict,
  included boolean not null default true,
  primary key (room_type_id, amenity_id)
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete restrict,
  room_type_id uuid not null references public.room_types(id) on delete restrict,
  number text not null,
  floor integer,
  occupancy_status text not null default 'vacant' check (occupancy_status in ('vacant', 'occupied')),
  condition_status text not null default 'inspected' check (condition_status in ('dirty', 'cleaning', 'clean', 'inspected')),
  privacy_status text not null default 'none' check (privacy_status in ('none', 'dnd')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, number)
);

create table public.rate_plans (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete restrict,
  code text not null,
  name_en text not null,
  name_ka text not null,
  cancellation_policy_en text not null,
  cancellation_policy_ka text not null,
  active boolean not null default true,
  unique (property_id, code)
);

create table public.daily_rates (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  rate_plan_id uuid not null references public.rate_plans(id) on delete cascade,
  stay_date date not null,
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null default 'GEL' check (currency = 'GEL'),
  closed boolean not null default false,
  minimum_stay integer not null default 1 check (minimum_stay > 0),
  unique (room_type_id, rate_plan_id, stay_date)
);

create table public.room_blocks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  kind text not null check (kind in ('out_of_service', 'owner_block')),
  stay_range daterange not null,
  reason text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  exclude using gist (room_id with =, stay_range with &&) where (active)
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  locale text not null default 'en' check (locale in ('en', 'ka')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  confirmation_number text not null unique,
  property_id uuid not null references public.properties(id) on delete restrict,
  primary_guest_id uuid not null references public.guests(id) on delete restrict,
  status text not null check (status in ('held', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  source text not null default 'direct',
  check_in date not null,
  check_out date not null,
  adults integer not null check (adults > 0),
  children integer not null default 0 check (children >= 0),
  currency text not null default 'GEL' check (currency = 'GEL'),
  total_minor integer not null check (total_minor >= 0),
  special_requests text,
  actual_check_in timestamptz,
  actual_check_out timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (check_out > check_in)
);

create table public.reservation_stays (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  room_type_id uuid not null references public.room_types(id) on delete restrict,
  rate_plan_id uuid references public.rate_plans(id) on delete restrict,
  stay_range daterange not null,
  nightly_rates jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'cancelled'))
);

create table public.room_assignments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete restrict,
  reservation_stay_id uuid not null references public.reservation_stays(id) on delete restrict,
  room_id uuid not null references public.rooms(id) on delete restrict,
  stay_range daterange not null,
  status text not null default 'active' check (status in ('active', 'released')),
  created_at timestamptz not null default now(),
  exclude using gist (room_id with =, stay_range with &&) where (status = 'active')
);

create table public.housekeeping_tasks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete restrict,
  reservation_id uuid references public.reservations(id) on delete restrict,
  service_type text not null check (service_type in ('departure', 'stayover', 'touch_up', 'inspection', 'deep_clean')),
  status text not null default 'open' check (status in ('open', 'assigned', 'in_progress', 'clean_complete', 'inspection_required', 'completed', 'deferred', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  due_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  catalog text not null check (catalog in ('extra', 'minibar', 'room_service')),
  sku text not null,
  name_en text not null,
  name_ka text not null,
  description_en text,
  description_ka text,
  image_path text,
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null default 'GEL' check (currency = 'GEL'),
  stock integer check (stock is null or stock >= 0),
  active boolean not null default true,
  unique (property_id, catalog, sku)
);

create table public.service_orders (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  room_id uuid not null references public.rooms(id) on delete restrict,
  status text not null default 'received' check (status in ('received', 'accepted', 'preparing', 'ready', 'delivered', 'closed', 'cancelled')),
  total_minor integer not null default 0 check (total_minor >= 0),
  posted_to_folio boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.service_orders(id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_items(id) on delete restrict,
  name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_amount_minor integer not null check (unit_amount_minor >= 0)
);

create table public.folios (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  status text not null default 'open' check (status in ('open', 'settled', 'closed')),
  currency text not null default 'GEL' check (currency = 'GEL'),
  created_at timestamptz not null default now()
);

create table public.folio_entries (
  id uuid primary key default gen_random_uuid(),
  folio_id uuid not null references public.folios(id) on delete restrict,
  entry_type text not null check (entry_type in ('room_charge', 'extra', 'room_service', 'minibar', 'tax', 'fee', 'discount', 'adjustment', 'payment', 'refund')),
  description text not null,
  amount_minor integer not null,
  source_type text,
  source_id uuid,
  reverses_entry_id uuid references public.folio_entries(id) on delete restrict,
  posted_at timestamptz not null default now()
);

create unique index folio_entry_source_once
  on public.folio_entries(source_type, source_id, entry_type)
  where source_id is not null and reverses_entry_id is null;

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  reason text,
  occurred_at timestamptz not null default now()
);

create table public.demo_snapshots (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create index reservations_dates on public.reservations(property_id, check_in, check_out);
create index rooms_type on public.rooms(room_type_id) where active;
create index housekeeping_status on public.housekeeping_tasks(status, due_at);
create index service_orders_status on public.service_orders(status, created_at);

alter table public.app_users enable row level security;
alter table public.properties enable row level security;
alter table public.property_translations enable row level security;
alter table public.property_media enable row level security;
alter table public.amenities enable row level security;
alter table public.property_amenities enable row level security;
alter table public.room_types enable row level security;
alter table public.room_type_translations enable row level security;
alter table public.room_type_media enable row level security;
alter table public.room_type_amenities enable row level security;
alter table public.rooms enable row level security;
alter table public.rate_plans enable row level security;
alter table public.daily_rates enable row level security;
alter table public.room_blocks enable row level security;
alter table public.guests enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_stays enable row level security;
alter table public.room_assignments enable row level security;
alter table public.housekeeping_tasks enable row level security;
alter table public.catalog_items enable row level security;
alter table public.service_orders enable row level security;
alter table public.service_order_items enable row level security;
alter table public.folios enable row level security;
alter table public.folio_entries enable row level security;
alter table public.audit_events enable row level security;
alter table public.demo_snapshots enable row level security;

create policy app_users_self_read on public.app_users
  for select to authenticated using (id = auth.uid() or public.is_owner());

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'properties', 'property_translations', 'property_media', 'amenities',
    'property_amenities', 'room_types', 'room_type_translations',
    'room_type_media', 'room_type_amenities', 'rooms', 'rate_plans',
    'daily_rates', 'room_blocks', 'guests', 'reservations',
    'reservation_stays', 'room_assignments', 'housekeeping_tasks',
    'catalog_items', 'service_orders', 'service_order_items', 'folios',
    'folio_entries', 'audit_events', 'demo_snapshots'
  ] loop
    execute format(
      'create policy owner_all on public.%I for all to authenticated using (public.is_owner()) with check (public.is_owner())',
      table_name
    );
  end loop;
end $$;

create policy published_properties_read on public.properties
  for select to anon, authenticated using (status = 'published');

create policy published_property_translations_read on public.property_translations
  for select to anon, authenticated using (
    exists (select 1 from public.properties p where p.id = property_id and p.status = 'published')
  );

create policy published_property_media_read on public.property_media
  for select to anon, authenticated using (
    exists (select 1 from public.properties p where p.id = property_id and p.status = 'published')
  );

create policy active_amenities_read on public.amenities
  for select to anon, authenticated using (active);

create policy published_property_amenities_read on public.property_amenities
  for select to anon, authenticated using (
    exists (select 1 from public.properties p where p.id = property_id and p.status = 'published')
  );

create policy published_room_types_read on public.room_types
  for select to anon, authenticated using (
    active and exists (select 1 from public.properties p where p.id = property_id and p.status = 'published')
  );

create policy published_room_type_translations_read on public.room_type_translations
  for select to anon, authenticated using (
    exists (
      select 1 from public.room_types rt
      join public.properties p on p.id = rt.property_id
      where rt.id = room_type_id and rt.active and p.status = 'published'
    )
  );

create policy published_room_type_media_read on public.room_type_media
  for select to anon, authenticated using (
    exists (
      select 1 from public.room_types rt
      join public.properties p on p.id = rt.property_id
      where rt.id = room_type_id and rt.active and p.status = 'published'
    )
  );

create policy published_room_type_amenities_read on public.room_type_amenities
  for select to anon, authenticated using (
    exists (
      select 1 from public.room_types rt
      join public.properties p on p.id = rt.property_id
      where rt.id = room_type_id and rt.active and p.status = 'published'
    )
  );

insert into storage.buckets (id, name, public)
values ('property-media', 'property-media', true)
on conflict (id) do nothing;

create policy owner_upload_property_media on storage.objects
  for insert to authenticated
  with check (bucket_id = 'property-media' and public.is_owner());

create policy owner_update_property_media on storage.objects
  for update to authenticated
  using (bucket_id = 'property-media' and public.is_owner())
  with check (bucket_id = 'property-media' and public.is_owner());

create policy owner_delete_property_media on storage.objects
  for delete to authenticated
  using (bucket_id = 'property-media' and public.is_owner());

alter publication supabase_realtime add table public.demo_snapshots;
alter publication supabase_realtime add table public.reservations;
alter publication supabase_realtime add table public.housekeeping_tasks;
alter publication supabase_realtime add table public.service_orders;
