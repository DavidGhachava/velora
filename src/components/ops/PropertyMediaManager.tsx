import { ImagePlus, Star, Trash2, Upload } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePropertyMedia, listPropertyMedia, setPropertyCover, updatePropertyMediaText, uploadPropertyMedia } from '../../data/propertyInventoryRepository'
import { supabase } from '../../data/supabase'
import type { PropertyMedia } from '../../domain/propertyInventory'
import { Button } from '../ui/Button'
import { EmptyState, ErrorState, LoadingState } from '../ui/Feedback'

const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const maxFileSize = 8 * 1024 * 1024

const imageDimensions = async (file: File) => {
  const bitmap = await createImageBitmap(file)
  const dimensions = { width: bitmap.width, height: bitmap.height }
  bitmap.close()
  return dimensions
}

function MediaCard({ media, busy, onRefresh, onError }: { media: PropertyMedia; busy: boolean; onRefresh: () => Promise<void>; onError: (message: string) => void }) {
  const [altEn, setAltEn] = useState(media.altEn)
  const [altKa, setAltKa] = useState(media.altKa)

  const saveText = async () => {
    if (!altEn.trim() || !altKa.trim()) return onError('Describe every image in both English and Georgian.')
    try { await updatePropertyMediaText(media.id, altEn, altKa); await onRefresh() } catch (cause) { onError(cause instanceof Error ? cause.message : 'Could not update the image.') }
  }
  const makeCover = async () => {
    try { await setPropertyCover(media.propertyId, media.id); await onRefresh() } catch (cause) { onError(cause instanceof Error ? cause.message : 'Could not set the cover image.') }
  }
  const remove = async () => {
    if (!window.confirm('Remove this image from the property gallery?')) return
    try { await deletePropertyMedia(media); await onRefresh() } catch (cause) { onError(cause instanceof Error ? cause.message : 'Could not remove the image.') }
  }

  return <article className="media-admin-card">
    <div className="media-admin-card__image"><img src={media.publicUrl} alt={media.altEn} loading="lazy" />{media.isCover && <span><Star size={13} fill="currentColor" /> Cover</span>}</div>
    <div className="media-admin-card__fields">
      <label><span>English alt text</span><input value={altEn} onChange={(event) => setAltEn(event.target.value)} /></label>
      <label lang="ka"><span>ქართული ალტ ტექსტი</span><input value={altKa} onChange={(event) => setAltKa(event.target.value)} /></label>
    </div>
    <div className="media-admin-card__actions">
      <Button size="sm" variant="secondary" disabled={busy || (altEn === media.altEn && altKa === media.altKa)} onClick={() => void saveText()}>Save text</Button>
      {!media.isCover && <Button size="sm" variant="quiet" disabled={busy} icon={<Star size={14} />} onClick={() => void makeCover()}>Make cover</Button>}
      <Button size="sm" variant="quiet" disabled={busy} icon={<Trash2 size={14} />} onClick={() => void remove()}>Remove</Button>
    </div>
  </article>
}

export function PropertyMediaManager({ propertyId }: { propertyId: string }) {
  const queryClient = useQueryClient()
  const queryKey = ['property-media', propertyId] as const
  const query = useQuery({ queryKey, queryFn: () => listPropertyMedia(propertyId) })
  const [file, setFile] = useState<File | null>(null)
  const [altEn, setAltEn] = useState('')
  const [altKa, setAltKa] = useState('')
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => { await queryClient.invalidateQueries({ queryKey }) }
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Choose an image first.')
      if (!acceptedTypes.has(file.type)) throw new Error('Use a JPG, PNG, WebP or AVIF image.')
      if (file.size > maxFileSize) throw new Error('Keep each image below 8 MB.')
      if (!altEn.trim() || !altKa.trim()) throw new Error('Add useful alt text in English and Georgian.')
      const dimensions = await imageDimensions(file)
      if (dimensions.width < 1200 || dimensions.height < 700) throw new Error('Use an image at least 1200 × 700 pixels to prevent blurry galleries.')
      await uploadPropertyMedia({ propertyId, file, altEn, altKa, ...dimensions })
    },
    onSuccess: async () => { setFile(null); setAltEn(''); setAltKa(''); setError(null); await refresh() },
    onError: (cause) => setError(cause instanceof Error ? cause.message : 'Could not upload the image.'),
  })

  useEffect(() => {
    const client = supabase
    if (!client) return
    const channel = client.channel(`property-media-${propertyId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'property_media', filter: `property_id=eq.${propertyId}` }, () => {
      void queryClient.invalidateQueries({ queryKey: ['property-media', propertyId] })
    }).subscribe()
    return () => { void client.removeChannel(channel) }
  }, [propertyId, queryClient])

  const submit = (event: FormEvent) => { event.preventDefault(); uploadMutation.mutate() }

  return <section className="inventory-section">
    <header className="inventory-section__header"><div><h2>Gallery</h2><p>Upload sharp, accurate property photos. The cover image appears first in search.</p></div><span>{query.data?.length ?? 0} images</span></header>
    {error && <ErrorState message={error} />}
    <form className="media-upload" onSubmit={submit}>
      <label className="media-upload__drop"><ImagePlus /><span>{file?.name ?? 'Choose a property photo'}</span><small>JPG, PNG, WebP or AVIF · at least 1200 × 700 · up to 8 MB</small><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
      <div><label><span>English alt text</span><input value={altEn} onChange={(event) => setAltEn(event.target.value)} placeholder="Describe what the image shows" /></label><label lang="ka"><span>ქართული ალტ ტექსტი</span><input value={altKa} onChange={(event) => setAltKa(event.target.value)} placeholder="აღწერეთ სურათი" /></label></div>
      <Button type="submit" loading={uploadMutation.isPending} icon={<Upload size={16} />}>Upload image</Button>
    </form>
    {query.isLoading ? <LoadingState label="Loading gallery" /> : query.error ? <ErrorState message={query.error instanceof Error ? query.error.message : 'Could not load the gallery.'} retry={() => void query.refetch()} /> : query.data?.length ? <div className="media-admin-grid">{query.data.map((media) => <MediaCard key={media.id} media={media} busy={uploadMutation.isPending} onRefresh={refresh} onError={setError} />)}</div> : <EmptyState title="No gallery images" description="Upload the first accurate photo. It will automatically become the cover image." icon={<ImagePlus size={30} />} />}
  </section>
}
