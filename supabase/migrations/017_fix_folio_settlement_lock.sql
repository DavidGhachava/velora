create or replace function public.settle_reservation_folio(p_reservation_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare selected_folio uuid; balance integer; reference text;
begin
  if not private.is_owner() then raise exception 'Owner access required' using errcode = '42501'; end if;
  select f.id into selected_folio
  from public.folios f
  where f.reservation_id = p_reservation_id
  for update;
  if selected_folio is null then raise exception 'Folio not found' using errcode = 'P0002'; end if;
  select coalesce(sum(fe.amount_minor), 0)::integer into balance
  from public.folio_entries fe
  where fe.folio_id = selected_folio;
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
