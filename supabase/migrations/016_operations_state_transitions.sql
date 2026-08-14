create function public.check_in_reservation(p_reservation_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_reservation public.reservations%rowtype;
  selected_room public.rooms%rowtype;
begin
  if not private.is_owner() then raise exception 'Owner access required' using errcode = '42501'; end if;
  select * into selected_reservation from public.reservations where id = p_reservation_id for update;
  if not found or selected_reservation.status <> 'confirmed' then
    raise exception 'Only confirmed reservations can check in' using errcode = '22023';
  end if;
  select r.* into selected_room
  from public.room_assignments ra
  join public.reservation_stays rs on rs.id = ra.reservation_stay_id
  join public.rooms r on r.id = ra.room_id
  where rs.reservation_id = p_reservation_id and rs.status = 'active' and ra.status = 'active'
  for update of r;
  if not found then raise exception 'Assign a room before check-in' using errcode = '22023'; end if;
  if not selected_room.active or selected_room.condition_status <> 'inspected' or selected_room.occupancy_status <> 'vacant' then
    raise exception 'The assigned room must be active, vacant and inspected' using errcode = '22023';
  end if;
  update public.reservations set status = 'checked_in', actual_check_in = now(), updated_at = now() where id = p_reservation_id;
  update public.rooms set occupancy_status = 'occupied', updated_at = now() where id = selected_room.id;
  insert into public.audit_events (actor_id, action, entity_type, entity_id, before_data, after_data)
  values (auth.uid(), 'reservation.checked_in', 'reservation', p_reservation_id, jsonb_build_object('status', 'confirmed'), jsonb_build_object('status', 'checked_in', 'room_id', selected_room.id));
end;
$$;

create function public.check_out_reservation(p_reservation_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_reservation public.reservations%rowtype;
  selected_room public.rooms%rowtype;
  outstanding integer;
begin
  if not private.is_owner() then raise exception 'Owner access required' using errcode = '42501'; end if;
  select * into selected_reservation from public.reservations where id = p_reservation_id for update;
  if not found or selected_reservation.status <> 'checked_in' then
    raise exception 'Only checked-in reservations can check out' using errcode = '22023';
  end if;
  select coalesce(sum(fe.amount_minor), 0)::integer into outstanding
  from public.folios f join public.folio_entries fe on fe.folio_id = f.id
  where f.reservation_id = p_reservation_id;
  if outstanding > 0 then raise exception 'Settle the outstanding folio balance before checkout' using errcode = '22023'; end if;
  select r.* into selected_room
  from public.room_assignments ra
  join public.reservation_stays rs on rs.id = ra.reservation_stay_id
  join public.rooms r on r.id = ra.room_id
  where rs.reservation_id = p_reservation_id and rs.status = 'active' and ra.status = 'active'
  for update of r;
  if not found then raise exception 'The reservation has no active room assignment' using errcode = '22023'; end if;
  update public.reservations set status = 'checked_out', actual_check_out = now(), updated_at = now() where id = p_reservation_id;
  update public.rooms set occupancy_status = 'vacant', condition_status = 'dirty', privacy_status = 'none', updated_at = now() where id = selected_room.id;
  insert into public.housekeeping_tasks (room_id, reservation_id, service_type, status, priority, due_at, notes)
  values (selected_room.id, p_reservation_id, 'departure', 'open', 'high', now() + interval '90 minutes', 'Created automatically at checkout');
  insert into public.audit_events (actor_id, action, entity_type, entity_id, before_data, after_data)
  values (auth.uid(), 'reservation.checked_out', 'reservation', p_reservation_id, jsonb_build_object('status', 'checked_in'), jsonb_build_object('status', 'checked_out', 'room_id', selected_room.id));
end;
$$;

create function public.assign_reservation_room(p_reservation_id uuid, p_room_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_stay public.reservation_stays%rowtype;
  selected_room public.rooms%rowtype;
  property_id uuid;
begin
  if not private.is_owner() then raise exception 'Owner access required' using errcode = '42501'; end if;
  select rs.* into selected_stay
  from public.reservation_stays rs
  join public.reservations r on r.id = rs.reservation_id
  where rs.reservation_id = p_reservation_id and rs.status = 'active' and r.status in ('held', 'confirmed')
  for update of rs;
  if not found then raise exception 'Only future active stays can be assigned' using errcode = '22023'; end if;
  select * into selected_room from public.rooms where id = p_room_id and active for update;
  if not found or selected_room.room_type_id <> selected_stay.room_type_id then
    raise exception 'Choose an active room in the reserved category' using errcode = '22023';
  end if;
  property_id := selected_room.property_id;
  update public.room_assignments set status = 'released'
  where reservation_stay_id = selected_stay.id and status = 'active';
  begin
    insert into public.room_assignments (property_id, reservation_stay_id, room_id, stay_range)
    values (property_id, selected_stay.id, selected_room.id, selected_stay.stay_range);
  exception when exclusion_violation then
    raise exception 'That room overlaps another confirmed stay' using errcode = '23P01';
  end;
  insert into public.audit_events (actor_id, action, entity_type, entity_id, after_data)
  values (auth.uid(), 'reservation.room_assigned', 'reservation', p_reservation_id, jsonb_build_object('room_id', p_room_id));
end;
$$;

create function public.set_room_condition(p_room_id uuid, p_condition text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare current_condition text;
begin
  if not private.is_owner() then raise exception 'Owner access required' using errcode = '42501'; end if;
  select condition_status into current_condition from public.rooms where id = p_room_id for update;
  if not found then raise exception 'Room not found' using errcode = 'P0002'; end if;
  if not (
    (current_condition = 'dirty' and p_condition = 'cleaning') or
    (current_condition = 'cleaning' and p_condition in ('clean', 'inspected')) or
    (current_condition = 'clean' and p_condition in ('inspected', 'cleaning')) or
    (current_condition = 'inspected' and p_condition in ('dirty', 'cleaning'))
  ) then raise exception 'This housekeeping transition is not allowed' using errcode = '22023'; end if;
  update public.rooms set condition_status = p_condition, updated_at = now() where id = p_room_id;
  update public.housekeeping_tasks set
    status = case p_condition when 'cleaning' then 'in_progress' when 'clean' then 'clean_complete' when 'inspected' then 'completed' else status end,
    updated_at = now()
  where room_id = p_room_id and status not in ('completed', 'cancelled');
  insert into public.audit_events (actor_id, action, entity_type, entity_id, before_data, after_data)
  values (auth.uid(), 'room.condition_changed', 'room', p_room_id, jsonb_build_object('condition', current_condition), jsonb_build_object('condition', p_condition));
end;
$$;

create function public.settle_reservation_folio(p_reservation_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare selected_folio uuid; balance integer; reference text;
begin
  if not private.is_owner() then raise exception 'Owner access required' using errcode = '42501'; end if;
  select f.id, coalesce(sum(fe.amount_minor), 0)::integer into selected_folio, balance
  from public.folios f left join public.folio_entries fe on fe.folio_id = f.id
  where f.reservation_id = p_reservation_id
  group by f.id
  for update of f;
  if selected_folio is null then raise exception 'Folio not found' using errcode = 'P0002'; end if;
  if balance <= 0 then return; end if;
  reference := 'ops_' || gen_random_uuid()::text;
  insert into public.folio_entries (folio_id, entry_type, description, amount_minor)
  values (selected_folio, 'payment', 'Payment received at front desk', -balance);
  insert into public.payments (reservation_id, provider, provider_reference, status, amount_minor, captured_at)
  values (p_reservation_id, 'simulation', reference, 'captured', balance, now());
  insert into public.audit_events (actor_id, action, entity_type, entity_id, after_data)
  values (auth.uid(), 'folio.settled', 'reservation', p_reservation_id, jsonb_build_object('amount_minor', balance));
end;
$$;

revoke all on function public.check_in_reservation(uuid) from public, anon;
revoke all on function public.check_out_reservation(uuid) from public, anon;
revoke all on function public.assign_reservation_room(uuid, uuid) from public, anon;
revoke all on function public.set_room_condition(uuid, text) from public, anon;
revoke all on function public.settle_reservation_folio(uuid) from public, anon;
grant execute on function public.check_in_reservation(uuid) to authenticated;
grant execute on function public.check_out_reservation(uuid) to authenticated;
grant execute on function public.assign_reservation_room(uuid, uuid) to authenticated;
grant execute on function public.set_room_condition(uuid, text) to authenticated;
grant execute on function public.settle_reservation_folio(uuid) to authenticated;
