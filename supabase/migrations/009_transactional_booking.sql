create table public.payments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  provider text not null check (provider in ('simulation', 'stripe')),
  provider_reference text not null unique,
  status text not null check (status in ('pending', 'captured', 'failed', 'refunded')),
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null default 'GEL' check (currency = 'GEL'),
  captured_at timestamptz,
  created_at timestamptz not null default now()
);

create index payments_reservation on public.payments (reservation_id);
alter table public.payments enable row level security;
create policy owner_all on public.payments
  for all to authenticated using (private.is_owner()) with check (private.is_owner());
grant select, insert, update, delete on public.payments to authenticated;

create function public.create_direct_booking(
  p_room_type_id uuid,
  p_check_in date,
  p_check_out date,
  p_adults integer,
  p_children integer,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_locale text,
  p_special_requests text,
  p_payment_reference text
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_room public.rooms%rowtype;
  selected_type public.room_types%rowtype;
  selected_property public.properties%rowtype;
  guest_id uuid;
  reservation_id uuid;
  stay_id uuid;
  folio_id uuid;
  confirmation text;
  stay_dates daterange;
  nights integer;
  subtotal integer;
  tax integer;
  total integer;
  nightly_rates jsonb;
begin
  if p_check_in < current_date or p_check_out <= p_check_in or p_check_out - p_check_in > 60 then
    raise exception 'Choose a valid stay of 1 to 60 nights' using errcode = '22023';
  end if;
  if p_adults < 1 or p_children < 0 then
    raise exception 'Guest counts are invalid' using errcode = '22023';
  end if;
  if p_locale not in ('en', 'ka') then
    raise exception 'Locale is invalid' using errcode = '22023';
  end if;
  if trim(p_first_name) = '' or trim(p_last_name) = '' or trim(p_email) = '' then
    raise exception 'Guest contact details are required' using errcode = '22023';
  end if;

  select rt.* into selected_type
  from public.room_types rt
  join public.properties p on p.id = rt.property_id
  where rt.id = p_room_type_id and rt.active and p.status = 'published';
  if not found then
    raise exception 'This room type is not available' using errcode = 'P0002';
  end if;
  if p_adults + p_children > selected_type.max_guests then
    raise exception 'This room does not fit the selected guests' using errcode = '22023';
  end if;

  select * into selected_property from public.properties where id = selected_type.property_id;
  stay_dates := daterange(p_check_in, p_check_out, '[)');

  select r.* into selected_room
  from public.rooms r
  where r.property_id = selected_property.id
    and r.room_type_id = selected_type.id
    and r.active
    and not exists (
      select 1 from public.room_assignments ra
      where ra.room_id = r.id and ra.status = 'active' and ra.stay_range && stay_dates
    )
    and not exists (
      select 1 from public.room_blocks rb
      where rb.room_id = r.id and rb.active and rb.stay_range && stay_dates
    )
  order by r.number
  for update of r skip locked
  limit 1;
  if not found then
    raise exception 'No rooms remain for those dates' using errcode = 'P0001';
  end if;

  nights := p_check_out - p_check_in;
  subtotal := selected_type.base_rate_minor * nights;
  tax := round(subtotal * 0.10);
  total := subtotal + tax;
  confirmation := 'VLR-' || to_char(current_date, 'YYMM') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  select jsonb_agg(jsonb_build_object('date', day::date, 'amount_minor', selected_type.base_rate_minor) order by day)
  into nightly_rates
  from generate_series(p_check_in::timestamp, (p_check_out - 1)::timestamp, interval '1 day') day;

  insert into public.guests (first_name, last_name, email, phone, locale)
  values (trim(p_first_name), trim(p_last_name), lower(trim(p_email)), nullif(trim(p_phone), ''), p_locale)
  returning id into guest_id;

  insert into public.reservations (
    confirmation_number, property_id, primary_guest_id, status, source,
    check_in, check_out, adults, children, total_minor, special_requests
  ) values (
    confirmation, selected_property.id, guest_id, 'confirmed', 'direct',
    p_check_in, p_check_out, p_adults, p_children, total, nullif(trim(p_special_requests), '')
  ) returning id into reservation_id;

  insert into public.reservation_stays (reservation_id, room_type_id, stay_range, nightly_rates)
  values (reservation_id, selected_type.id, stay_dates, nightly_rates)
  returning id into stay_id;

  insert into public.room_assignments (property_id, reservation_stay_id, room_id, stay_range)
  values (selected_property.id, stay_id, selected_room.id, stay_dates);

  insert into public.folios (reservation_id) values (reservation_id) returning id into folio_id;
  insert into public.folio_entries (folio_id, entry_type, description, amount_minor)
  values
    (folio_id, 'room_charge', nights || ' nights accommodation', subtotal),
    (folio_id, 'tax', 'Taxes and fees', tax),
    (folio_id, 'payment', 'Payment received', -total);

  insert into public.payments (reservation_id, provider, provider_reference, status, amount_minor, captured_at)
  values (reservation_id, 'simulation', p_payment_reference, 'captured', total, now());

  insert into public.audit_events (action, entity_type, entity_id, after_data)
  values ('reservation.created', 'reservation', reservation_id, jsonb_build_object('source', 'direct', 'confirmation_number', confirmation));

  return jsonb_build_object(
    'reservation_id', reservation_id,
    'confirmation_number', confirmation,
    'room_id', selected_room.id,
    'total_minor', total,
    'currency', 'GEL'
  );
end;
$$;

revoke all on function public.create_direct_booking(
  uuid, date, date, integer, integer, text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.create_direct_booking(
  uuid, date, date, integer, integer, text, text, text, text, text, text, text
) to service_role;

alter publication supabase_realtime add table public.payments;
