drop function public.save_property(
  uuid, text, text, text, text, text, numeric, numeric, time, time,
  text, text, text, text, text, text, text, text, text, text
);

create function public.manage_property(
  p_slug text,
  p_property_type text,
  p_status text,
  p_address text,
  p_area text,
  p_check_in_time time,
  p_check_out_time time,
  p_name_en text,
  p_short_description_en text,
  p_description_en text,
  p_name_ka text,
  p_short_description_ka text,
  p_description_ka text,
  p_policies_en text default null,
  p_policies_ka text default null,
  p_latitude numeric default null,
  p_longitude numeric default null,
  p_contact_email text default null,
  p_contact_phone text default null,
  p_id uuid default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_id uuid;
begin
  if p_id is null then
    insert into public.properties (
      slug, property_type, status, address, area, latitude, longitude,
      check_in_time, check_out_time, contact_email, contact_phone
    ) values (
      lower(trim(p_slug)), p_property_type, p_status, trim(p_address), trim(p_area),
      p_latitude, p_longitude, p_check_in_time, p_check_out_time,
      nullif(trim(p_contact_email), ''), nullif(trim(p_contact_phone), '')
    )
    returning id into saved_id;
  else
    update public.properties
    set slug = lower(trim(p_slug)),
        property_type = p_property_type,
        status = p_status,
        address = trim(p_address),
        area = trim(p_area),
        latitude = p_latitude,
        longitude = p_longitude,
        check_in_time = p_check_in_time,
        check_out_time = p_check_out_time,
        contact_email = nullif(trim(p_contact_email), ''),
        contact_phone = nullif(trim(p_contact_phone), ''),
        updated_at = now()
    where id = p_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Property not found or access denied' using errcode = 'P0002';
    end if;
  end if;

  insert into public.property_translations (
    property_id, locale, name, short_description, description, policies
  ) values
    (
      saved_id, 'en', trim(p_name_en), trim(p_short_description_en),
      trim(p_description_en), nullif(trim(p_policies_en), '')
    ),
    (
      saved_id, 'ka', trim(p_name_ka), trim(p_short_description_ka),
      trim(p_description_ka), nullif(trim(p_policies_ka), '')
    )
  on conflict (property_id, locale) do update
  set name = excluded.name,
      short_description = excluded.short_description,
      description = excluded.description,
      policies = excluded.policies;

  return saved_id;
end;
$$;

revoke all on function public.manage_property(
  text, text, text, text, text, time, time, text, text, text, text, text,
  text, text, text, numeric, numeric, text, text, uuid
) from public, anon;
grant execute on function public.manage_property(
  text, text, text, text, text, time, time, text, text, text, text, text,
  text, text, text, numeric, numeric, text, text, uuid
) to authenticated;
