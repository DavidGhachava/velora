alter table public.catalog_items
  add column pricing_unit text not null default 'item'
  check (pricing_unit in ('item', 'stay', 'person', 'night'));

insert into public.catalog_items (
  property_id, catalog, sku, name_en, name_ka, description_en, description_ka,
  image_path, amount_minor, pricing_unit, active
)
select p.id, 'extra', v.sku, v.name_en, v.name_ka, v.description_en, v.description_ka,
  v.image_path, v.amount_minor, v.pricing_unit, true
from public.properties p
cross join (values
  ('extra-transfer', 'Airport transfer', 'აეროპორტის ტრანსფერი', 'Private transfer from Batumi International Airport.', 'პირადი ტრანსფერი ბათუმის საერთაშორისო აეროპორტიდან.', '/images/velora/transfer-1600.webp', 9500, 'stay'),
  ('extra-breakfast', 'Breakfast', 'საუზმე', 'Daily breakfast for one guest.', 'ყოველდღიური საუზმე ერთი სტუმრისთვის.', '/images/velora/dining-1600.webp', 3800, 'person'),
  ('extra-spa', '60-minute spa treatment', '60-წუთიანი სპა პროცედურა', 'One wellness treatment for one guest.', 'ერთი სპა პროცედურა ერთი სტუმრისთვის.', '/images/velora/pool-1600.webp', 16500, 'person'),
  ('extra-sail', 'Two-hour boat trip', 'ორსაათიანი ნავით გასეირნება', 'Private Black Sea boat trip for the reservation.', 'პირადი გასეირნება შავ ზღვაზე.', '/images/velora/coast-1600.webp', 28000, 'stay')
) as v(sku, name_en, name_ka, description_en, description_ka, image_path, amount_minor, pricing_unit)
where p.slug in ('white-sails-residential', 'solis-residence')
on conflict (property_id, catalog, sku) do update set
  name_en = excluded.name_en,
  name_ka = excluded.name_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  image_path = excluded.image_path,
  amount_minor = excluded.amount_minor,
  pricing_unit = excluded.pricing_unit,
  active = true;

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
  p_extras jsonb,
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
  room_subtotal integer;
  extras_total integer := 0;
  subtotal integer;
  tax integer;
  total integer;
  nightly_rates jsonb;
  requested_extras integer;
  matched_extras integer;
begin
  if p_check_in < current_date or p_check_out <= p_check_in or p_check_out - p_check_in > 60 then
    raise exception 'Choose a valid stay of 1 to 60 nights' using errcode = '22023';
  end if;
  if p_adults < 1 or p_children < 0 or p_adults + p_children > 20 then
    raise exception 'Guest counts are invalid' using errcode = '22023';
  end if;
  if p_locale not in ('en', 'ka') then
    raise exception 'Locale is invalid' using errcode = '22023';
  end if;
  if trim(p_first_name) = '' or trim(p_last_name) = '' or trim(p_email) = '' then
    raise exception 'Guest contact details are required' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_extras, '[]'::jsonb)) <> 'array' or jsonb_array_length(coalesce(p_extras, '[]'::jsonb)) > 10 then
    raise exception 'Extras are invalid' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_to_recordset(coalesce(p_extras, '[]'::jsonb)) as x(sku text, quantity integer)
    where x.sku is null or x.quantity is null or x.quantity < 1 or x.quantity > 10
  ) then
    raise exception 'Extra quantities are invalid' using errcode = '22023';
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
  room_subtotal := selected_type.base_rate_minor * nights;
  requested_extras := jsonb_array_length(coalesce(p_extras, '[]'::jsonb));

  select count(*), coalesce(sum(
    ci.amount_minor * x.quantity *
    case ci.pricing_unit when 'person' then p_adults + p_children when 'night' then nights else 1 end
  ), 0)::integer
  into matched_extras, extras_total
  from jsonb_to_recordset(coalesce(p_extras, '[]'::jsonb)) as x(sku text, quantity integer)
  join public.catalog_items ci
    on ci.property_id = selected_property.id and ci.catalog = 'extra' and ci.sku = x.sku and ci.active;

  if matched_extras <> requested_extras then
    raise exception 'One or more extras are unavailable' using errcode = '22023';
  end if;
  if requested_extras <> (
    select count(distinct x.sku) from jsonb_to_recordset(coalesce(p_extras, '[]'::jsonb)) as x(sku text, quantity integer)
  ) then
    raise exception 'Duplicate extras are not allowed' using errcode = '22023';
  end if;

  subtotal := room_subtotal + extras_total;
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
  values (folio_id, 'room_charge', nights || ' nights accommodation', room_subtotal);

  insert into public.folio_entries (folio_id, entry_type, description, amount_minor, source_type, source_id)
  select folio_id, 'extra',
    case when p_locale = 'ka' then ci.name_ka else ci.name_en end,
    ci.amount_minor * x.quantity *
      case ci.pricing_unit when 'person' then p_adults + p_children when 'night' then nights else 1 end,
    'catalog_item', ci.id
  from jsonb_to_recordset(coalesce(p_extras, '[]'::jsonb)) as x(sku text, quantity integer)
  join public.catalog_items ci
    on ci.property_id = selected_property.id and ci.catalog = 'extra' and ci.sku = x.sku and ci.active;

  insert into public.folio_entries (folio_id, entry_type, description, amount_minor)
  values
    (folio_id, 'tax', 'Taxes and fees', tax),
    (folio_id, 'payment', 'Payment received', -total);

  insert into public.payments (reservation_id, provider, provider_reference, status, amount_minor, captured_at)
  values (reservation_id, 'simulation', p_payment_reference, 'captured', total, now());

  insert into public.audit_events (action, entity_type, entity_id, after_data)
  values ('reservation.created', 'reservation', reservation_id, jsonb_build_object(
    'source', 'direct', 'confirmation_number', confirmation, 'extras_total_minor', extras_total
  ));

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
  uuid, date, date, integer, integer, text, text, text, text, text, text, jsonb, text
) from public, anon, authenticated;
grant execute on function public.create_direct_booking(
  uuid, date, date, integer, integer, text, text, text, text, text, text, jsonb, text
) to service_role;
