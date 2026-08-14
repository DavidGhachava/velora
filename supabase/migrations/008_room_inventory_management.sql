alter table public.room_types
  add column base_rate_minor integer not null default 0 check (base_rate_minor >= 0);

create function public.manage_room_type(
  p_property_id uuid,
  p_code text,
  p_slug text,
  p_max_guests integer,
  p_bed_type text,
  p_accessible boolean,
  p_active boolean,
  p_base_rate_minor integer,
  p_name_en text,
  p_description_en text,
  p_name_ka text,
  p_description_ka text,
  p_size_m2 numeric default null,
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
    insert into public.room_types (
      property_id, code, slug, max_guests, size_m2, bed_type,
      accessible, active, base_rate_minor
    ) values (
      p_property_id, upper(trim(p_code)), lower(trim(p_slug)), p_max_guests,
      p_size_m2, trim(p_bed_type), p_accessible, p_active, p_base_rate_minor
    )
    returning id into saved_id;
  else
    update public.room_types
    set code = upper(trim(p_code)),
        slug = lower(trim(p_slug)),
        max_guests = p_max_guests,
        size_m2 = p_size_m2,
        bed_type = trim(p_bed_type),
        accessible = p_accessible,
        active = p_active,
        base_rate_minor = p_base_rate_minor,
        updated_at = now()
    where id = p_id and property_id = p_property_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Room type not found or access denied' using errcode = 'P0002';
    end if;
  end if;

  insert into public.room_type_translations (room_type_id, locale, name, description)
  values
    (saved_id, 'en', trim(p_name_en), trim(p_description_en)),
    (saved_id, 'ka', trim(p_name_ka), trim(p_description_ka))
  on conflict (room_type_id, locale) do update
  set name = excluded.name,
      description = excluded.description;

  return saved_id;
end;
$$;

revoke all on function public.manage_room_type(
  uuid, text, text, integer, text, boolean, boolean, integer,
  text, text, text, text, numeric, uuid
) from public, anon;
grant execute on function public.manage_room_type(
  uuid, text, text, integer, text, boolean, boolean, integer,
  text, text, text, text, numeric, uuid
) to authenticated;

alter publication supabase_realtime add table public.room_type_translations;
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.daily_rates;
