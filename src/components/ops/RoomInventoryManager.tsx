import { Accessibility, BedDouble, Edit3, Plus, Trash2, Users } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPhysicalRoom, deleteRoomType, listRoomInventory, saveRoomType, setPhysicalRoomActive } from '../../data/roomInventoryRepository'
import { supabase } from '../../data/supabase'
import { formatMoney } from '../../domain/money'
import { newRoomTypeForm, roomTypeToForm, type ManagedRoomType, type RoomTypeFormValues } from '../../domain/roomInventory'
import { Button } from '../ui/Button'
import { EmptyState, ErrorState, LoadingState, SuccessNotice } from '../ui/Feedback'
import { RoomTypeForm } from './RoomTypeForm'

export function RoomInventoryManager({ propertyId }: { propertyId: string }) {
  const queryClient = useQueryClient()
  const queryKey = ['room-inventory', propertyId] as const
  const query = useQuery({ queryKey, queryFn: () => listRoomInventory(propertyId) })
  const [editing, setEditing] = useState<ManagedRoomType | 'new' | null>(null)
  const [roomTypeId, setRoomTypeId] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [floor, setFloor] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const formValues = useMemo(() => editing && editing !== 'new' ? roomTypeToForm(editing) : newRoomTypeForm(propertyId), [editing, propertyId])
  const refresh = () => queryClient.invalidateQueries({ queryKey })
  const saveMutation = useMutation({ mutationFn: saveRoomType, onSuccess: refresh })
  const roomMutation = useMutation({ mutationFn: ({ typeId, number, roomFloor }: { typeId: string; number: string; roomFloor: number | null }) => createPhysicalRoom(propertyId, typeId, number, roomFloor), onSuccess: refresh })
  const activeMutation = useMutation({ mutationFn: ({ id, active }: { id: string; active: boolean }) => setPhysicalRoomActive(id, active), onSuccess: refresh })

  useEffect(() => {
    const client = supabase
    if (!client) return
    const channel = client.channel(`room-inventory-${propertyId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'room_types', filter: `property_id=eq.${propertyId}` }, () => {
      void queryClient.invalidateQueries({ queryKey: ['room-inventory', propertyId] })
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `property_id=eq.${propertyId}` }, () => {
      void queryClient.invalidateQueries({ queryKey: ['room-inventory', propertyId] })
    }).subscribe()
    return () => { void client.removeChannel(channel) }
  }, [propertyId, queryClient])

  const save = async (values: RoomTypeFormValues) => {
    setError(null)
    try { await saveMutation.mutateAsync(values); setEditing(null); setNotice(values.id ? 'Room type updated.' : 'Room type created.') } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save the room type.') }
  }
  const removeType = async (roomType: ManagedRoomType) => {
    if (!window.confirm(`Delete ${roomType.nameEn}? Categories with rooms or reservations cannot be deleted.`)) return
    setError(null)
    try { await deleteRoomType(roomType.id); await refresh(); setNotice(`${roomType.nameEn} deleted.`) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not delete the room type.') }
  }
  const addRoom = async (event: FormEvent) => {
    event.preventDefault()
    if (!roomTypeId || !roomNumber.trim()) return setError('Choose a room type and enter a room or unit number.')
    setError(null)
    try { await roomMutation.mutateAsync({ typeId: roomTypeId, number: roomNumber, roomFloor: floor === '' ? null : Number(floor) }); setRoomNumber(''); setFloor(''); setNotice(`Room ${roomNumber.trim()} added.`) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not add the room.') }
  }

  return <section className="inventory-section">
    <header className="inventory-section__header"><div><h2>Rooms and apartments</h2><p>Define bookable categories, exact nightly prices and the physical units assigned to guests.</p></div><Button size="sm" icon={<Plus size={15} />} onClick={() => setEditing('new')}>Add room type</Button></header>
    {error && <ErrorState message={error} />}
    {query.isLoading ? <LoadingState label="Loading room inventory" /> : query.error ? <ErrorState message={query.error instanceof Error ? query.error.message : 'Could not load room inventory.'} retry={() => void query.refetch()} /> : <>
      {query.data?.roomTypes.length ? <div className="room-type-admin-grid">{query.data.roomTypes.map((roomType) => <article className={roomType.active ? 'room-type-admin-card' : 'room-type-admin-card is-inactive'} key={roomType.id}>
        <div><span>{roomType.code}</span><h3>{roomType.nameEn}</h3><p>{roomType.nameKa}</p></div>
        <dl><div><dt><Users size={14} /> Guests</dt><dd>{roomType.maxGuests}</dd></div><div><dt><BedDouble size={14} /> Units</dt><dd>{roomType.roomCount}</dd></div>{roomType.accessible && <div><dt><Accessibility size={14} /> Access</dt><dd>Yes</dd></div>}</dl>
        <strong>{formatMoney(roomType.baseRateMinor)} <small>/ night</small></strong>
        <div><Button size="sm" variant="secondary" icon={<Edit3 size={14} />} onClick={() => setEditing(roomType)}>Edit</Button><Button size="sm" variant="quiet" icon={<Trash2 size={14} />} onClick={() => void removeType(roomType)}>Delete</Button></div>
      </article>)}</div> : <EmptyState title="No room types" description="Add the first category and nightly rate before creating physical rooms." icon={<BedDouble size={30} />} action={<Button icon={<Plus size={16} />} onClick={() => setEditing('new')}>Add room type</Button>} />}
      {query.data?.roomTypes.length ? <form className="physical-room-entry" onSubmit={addRoom}><div><h3>Add a physical room or apartment</h3><p>Each unit number must be unique within this property.</p></div><label><span>Room type</span><select value={roomTypeId} onChange={(event) => setRoomTypeId(event.target.value)}><option value="">Choose type</option>{query.data.roomTypes.filter((item) => item.active).map((roomType) => <option value={roomType.id} key={roomType.id}>{roomType.nameEn}</option>)}</select></label><label><span>Room / unit number</span><input value={roomNumber} onChange={(event) => setRoomNumber(event.target.value)} placeholder="1204" /></label><label><span>Floor <small>Optional</small></span><input type="number" value={floor} onChange={(event) => setFloor(event.target.value)} /></label><Button type="submit" loading={roomMutation.isPending} icon={<Plus size={15} />}>Add unit</Button></form> : null}
      {query.data?.rooms.length ? <div className="physical-room-table"><table><thead><tr><th>Unit</th><th>Room type</th><th>Floor</th><th>Condition</th><th>Occupancy</th><th>Inventory</th></tr></thead><tbody>{query.data.rooms.map((room) => <tr key={room.id}><td><strong>{room.number}</strong></td><td>{query.data.roomTypes.find((type) => type.id === room.roomTypeId)?.nameEn ?? 'Unknown type'}</td><td>{room.floor ?? '—'}</td><td>{room.conditionStatus}</td><td>{room.occupancyStatus}</td><td><button type="button" className={room.active ? 'inventory-toggle is-active' : 'inventory-toggle'} disabled={activeMutation.isPending} onClick={() => activeMutation.mutate({ id: room.id, active: !room.active })} aria-pressed={room.active}>{room.active ? 'Active' : 'Inactive'}</button></td></tr>)}</tbody></table></div> : null}
    </>}
    {editing && <RoomTypeForm values={formValues} saving={saveMutation.isPending} onSave={save} onCancel={() => setEditing(null)} />}
    {notice && <SuccessNotice message={notice} onDismiss={() => setNotice(null)} />}
  </section>
}
