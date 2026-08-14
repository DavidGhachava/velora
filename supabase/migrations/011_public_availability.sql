create function public.search_available_room_types(
  p_check_in date,
  p_check_out date,
  p_guests integer
)
returns table (room_type_id uuid, available_count bigint)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_check_in < current_date or p_check_out <= p_check_in or p_check_out - p_check_in > 60 then
    raise exception 'Choose a valid stay of 1 to 60 nights' using errcode = '22023';
  end if;
  if p_guests < 1 or p_guests > 20 then
    raise exception 'Guest count is invalid' using errcode = '22023';
  end if;

  return query
  select rt.id, count(r.id)
  from public.room_types rt
  join public.properties p on p.id = rt.property_id and p.status = 'published'
  join public.rooms r on r.room_type_id = rt.id and r.active
  where rt.active
    and rt.max_guests >= p_guests
    and not exists (
      select 1 from public.room_assignments ra
      where ra.room_id = r.id and ra.status = 'active'
        and ra.stay_range && daterange(p_check_in, p_check_out, '[)')
    )
    and not exists (
      select 1 from public.room_blocks rb
      where rb.room_id = r.id and rb.active
        and rb.stay_range && daterange(p_check_in, p_check_out, '[)')
    )
  group by rt.id
  having count(r.id) > 0;
end;
$$;

revoke all on function public.search_available_room_types(date, date, integer) from public, anon, authenticated;
grant execute on function public.search_available_room_types(date, date, integer) to service_role;
