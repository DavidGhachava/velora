import { zodResolver } from '@hookform/resolvers/zod'
import { Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { roomTypeFormSchema, type RoomTypeFormValues } from '../../domain/roomInventory'
import { Button } from '../ui/Button'

const FieldError = ({ errors, name }: { errors: FieldErrors<RoomTypeFormValues>; name: keyof RoomTypeFormValues }) => {
  const message = errors[name]?.message
  return message ? <p className="field-error">{message}</p> : null
}

export function RoomTypeForm({ values, saving, onSave, onCancel }: { values: RoomTypeFormValues; saving: boolean; onSave: (values: RoomTypeFormValues) => Promise<void>; onCancel: () => void }) {
  const [locale, setLocale] = useState<'en' | 'ka'>('en')
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<RoomTypeFormValues>({ resolver: zodResolver(roomTypeFormSchema), defaultValues: values })
  useEffect(() => reset(values), [reset, values])
  const close = () => { if (!isDirty || window.confirm('Discard unsaved room changes?')) onCancel() }

  return <div className="property-editor-layer"><button className="property-editor-backdrop" aria-label="Close room type editor" onClick={close} /><section className="property-editor" aria-label={values.id ? 'Edit room type' : 'Add room type'}>
    <header className="property-editor__header"><div><p className="eyebrow">Room inventory</p><h2>{values.id ? 'Edit room type' : 'Add room type'}</h2></div><button type="button" onClick={close} aria-label="Close room type editor"><X /></button></header>
    <form onSubmit={handleSubmit(onSave)} noValidate>
      <fieldset className="property-form-section"><legend>Category and price</legend><div className="property-form-grid property-form-grid--3">
        <label><span>Internal code</span><input {...register('code')} placeholder="SEA-STUDIO" /><FieldError errors={errors} name="code" /></label>
        <label><span>URL slug</span><input {...register('slug')} placeholder="sea-view-studio" /><FieldError errors={errors} name="slug" /></label>
        <label><span>Nightly rate (GEL)</span><input {...register('baseRateGel')} inputMode="decimal" placeholder="145.00" /><FieldError errors={errors} name="baseRateGel" /></label>
        <label><span>Maximum guests</span><input type="number" min="1" max="20" {...register('maxGuests', { valueAsNumber: true })} /><FieldError errors={errors} name="maxGuests" /></label>
        <label><span>Size (m²) <small>Optional</small></span><input {...register('sizeM2')} inputMode="decimal" /><FieldError errors={errors} name="sizeM2" /></label>
        <label><span>Bed setup</span><input {...register('bedType')} placeholder="Queen bed" /><FieldError errors={errors} name="bedType" /></label>
      </div><div className="room-type-checks"><label><input type="checkbox" {...register('accessible')} /> Accessible room option</label><label><input type="checkbox" {...register('active')} /> Available for booking</label></div></fieldset>
      <fieldset className="property-form-section"><legend>Guest-facing content</legend><div className="translation-tabs" role="tablist"><button type="button" role="tab" aria-selected={locale === 'en'} className={locale === 'en' ? 'active' : ''} onClick={() => setLocale('en')}>English</button><button type="button" role="tab" aria-selected={locale === 'ka'} className={locale === 'ka' ? 'active' : ''} onClick={() => setLocale('ka')}>ქართული</button></div>
        {locale === 'en' ? <div className="property-form-stack" role="tabpanel"><label><span>Room name</span><input {...register('nameEn')} /><FieldError errors={errors} name="nameEn" /></label><label><span>Description</span><textarea rows={6} {...register('descriptionEn')} /><FieldError errors={errors} name="descriptionEn" /></label></div> : <div className="property-form-stack" role="tabpanel" lang="ka"><label><span>ოთახის სახელი</span><input {...register('nameKa')} /><FieldError errors={errors} name="nameKa" /></label><label><span>აღწერა</span><textarea rows={6} {...register('descriptionKa')} /><FieldError errors={errors} name="descriptionKa" /></label></div>}
      </fieldset>
      <footer className="property-editor__actions"><Button type="button" variant="secondary" onClick={close}>Cancel</Button><Button type="submit" loading={saving} icon={<Save size={16} />}>{values.id ? 'Save room type' : 'Create room type'}</Button></footer>
    </form>
  </section></div>
}
