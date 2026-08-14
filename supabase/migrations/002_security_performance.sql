create schema if not exists private;

create or replace function private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_users
    where id = (select auth.uid()) and role = 'owner' and active
  );
$$;

revoke all on function private.is_owner() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_owner() to authenticated;

alter policy app_users_self_read on public.app_users
  using (id = (select auth.uid()) or private.is_owner());

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
      'alter policy owner_all on public.%I using (private.is_owner()) with check (private.is_owner())',
      table_name
    );
  end loop;
end $$;

alter policy published_properties_read on public.properties to anon;
alter policy published_property_translations_read on public.property_translations to anon;
alter policy published_property_media_read on public.property_media to anon;
alter policy active_amenities_read on public.amenities to anon;
alter policy published_property_amenities_read on public.property_amenities to anon;
alter policy published_room_types_read on public.room_types to anon;
alter policy published_room_type_translations_read on public.room_type_translations to anon;
alter policy published_room_type_media_read on public.room_type_media to anon;
alter policy published_room_type_amenities_read on public.room_type_amenities to anon;

alter policy owner_upload_property_media on storage.objects
  with check (bucket_id = 'property-media' and private.is_owner());
alter policy owner_update_property_media on storage.objects
  using (bucket_id = 'property-media' and private.is_owner())
  with check (bucket_id = 'property-media' and private.is_owner());
alter policy owner_delete_property_media on storage.objects
  using (bucket_id = 'property-media' and private.is_owner());

drop function public.is_owner();
alter extension btree_gist set schema extensions;

create index daily_rates_rate_plan on public.daily_rates (rate_plan_id);
create index folio_entries_folio on public.folio_entries (folio_id);
create index folio_entries_reversal on public.folio_entries (reverses_entry_id) where reverses_entry_id is not null;
create index folios_reservation on public.folios (reservation_id);
create index housekeeping_reservation on public.housekeeping_tasks (reservation_id) where reservation_id is not null;
create index housekeeping_room on public.housekeeping_tasks (room_id);
create index property_amenities_amenity on public.property_amenities (amenity_id);
create index reservation_stays_rate_plan on public.reservation_stays (rate_plan_id) where rate_plan_id is not null;
create index reservation_stays_reservation on public.reservation_stays (reservation_id);
create index reservation_stays_room_type on public.reservation_stays (room_type_id);
create index reservations_primary_guest on public.reservations (primary_guest_id);
create index room_assignments_property on public.room_assignments (property_id);
create index room_assignments_stay on public.room_assignments (reservation_stay_id);
create index room_blocks_property on public.room_blocks (property_id);
create index room_type_amenities_amenity on public.room_type_amenities (amenity_id);
create index service_order_items_catalog on public.service_order_items (catalog_item_id);
create index service_order_items_order on public.service_order_items (order_id);
create index service_orders_reservation on public.service_orders (reservation_id) where reservation_id is not null;
create index service_orders_room on public.service_orders (room_id) where room_id is not null;
