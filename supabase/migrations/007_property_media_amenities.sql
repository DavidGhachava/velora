insert into public.amenities (code, name_en, name_ka, icon) values
  ('wifi', 'Free Wi-Fi', 'უფასო Wi-Fi', 'Wifi'),
  ('air_conditioning', 'Air conditioning', 'კონდიციონერი', 'Snowflake'),
  ('kitchen', 'Kitchen', 'სამზარეულო', 'CookingPot'),
  ('microwave', 'Microwave', 'მიკროტალღური ღუმელი', 'Microwave'),
  ('washing_machine', 'Washing machine', 'სარეცხი მანქანა', 'WashingMachine'),
  ('refrigerator', 'Refrigerator', 'მაცივარი', 'Refrigerator'),
  ('balcony', 'Private balcony', 'პირადი აივანი', 'PanelsTopLeft'),
  ('sea_view', 'Sea view', 'ზღვის ხედი', 'Waves'),
  ('parking', 'Parking', 'პარკინგი', 'CircleParking'),
  ('pool', 'Swimming pool', 'საცურაო აუზი', 'WavesLadder'),
  ('elevator', 'Elevator', 'ლიფტი', 'ArrowUpDown'),
  ('accessible', 'Accessible option', 'ადაპტირებული გარემო', 'Accessibility'),
  ('breakfast', 'Breakfast available', 'საუზმე', 'Coffee'),
  ('pets', 'Pet friendly', 'შინაური ცხოველები დაშვებულია', 'PawPrint'),
  ('gym', 'Fitness centre', 'ფიტნეს ცენტრი', 'Dumbbell'),
  ('spa', 'Spa and wellness', 'სპა და ველნესი', 'Sparkles')
on conflict (code) do update
set name_en = excluded.name_en,
    name_ka = excluded.name_ka,
    icon = excluded.icon,
    active = true;

create function public.set_property_cover(p_property_id uuid, p_media_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.property_media
  set is_cover = false
  where property_id = p_property_id and is_cover;

  update public.property_media
  set is_cover = true
  where id = p_media_id and property_id = p_property_id;

  if not found then
    raise exception 'Property image not found or access denied' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.set_property_cover(uuid, uuid) from public, anon;
grant execute on function public.set_property_cover(uuid, uuid) to authenticated;

alter publication supabase_realtime add table public.properties;
alter publication supabase_realtime add table public.property_translations;
alter publication supabase_realtime add table public.property_media;
alter publication supabase_realtime add table public.property_amenities;
alter publication supabase_realtime add table public.room_types;
