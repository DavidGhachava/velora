grant usage on schema public to anon, authenticated;

grant select on table
  public.properties,
  public.property_translations,
  public.property_media,
  public.amenities,
  public.property_amenities,
  public.room_types,
  public.room_type_translations,
  public.room_type_media,
  public.room_type_amenities
to anon;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant usage, select on sequences to authenticated;

create policy owner_read_property_media on storage.objects
  for select to authenticated
  using (bucket_id = 'property-media' and private.is_owner());
