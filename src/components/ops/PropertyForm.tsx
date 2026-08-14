import { zodResolver } from '@hookform/resolvers/zod'
import { Globe2, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { emptyPropertyForm, propertyFormSchema, type PropertyFormValues } from '../../domain/property'
import { Button } from '../ui/Button'

interface PropertyFormProps {
  initialValues?: PropertyFormValues
  saving: boolean
  onCancel: () => void
  onSave: (values: PropertyFormValues) => Promise<void>
}

const FieldError = ({ errors, name }: { errors: FieldErrors<PropertyFormValues>; name: keyof PropertyFormValues }) => {
  const message = errors[name]?.message
  return message ? <p className="field-error">{message}</p> : null
}

export function PropertyForm({ initialValues, saving, onCancel, onSave }: PropertyFormProps) {
  const [locale, setLocale] = useState<'en' | 'ka'>('en')
  const values = initialValues ?? emptyPropertyForm
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: values,
  })

  useEffect(() => reset(values), [reset, values])

  const requestCancel = () => {
    if (isDirty && !window.confirm('Discard the unsaved property changes?')) return
    onCancel()
  }

  return (
    <section className="property-editor" aria-label={values.id ? 'Edit property' : 'Add property'}>
      <header className="property-editor__header">
        <div><p className="eyebrow">Property editor</p><h2>{values.id ? 'Edit listing' : 'Add a property'}</h2></div>
        <button type="button" onClick={requestCancel} aria-label="Close property editor"><X /></button>
      </header>
      <form onSubmit={handleSubmit(onSave)} noValidate>
        <fieldset className="property-form-section">
          <legend>Publishing</legend>
          <div className="property-form-grid property-form-grid--3">
            <label><span>URL slug</span><input {...register('slug')} placeholder="seaside-apartment" /><FieldError errors={errors} name="slug" /></label>
            <label><span>Property type</span><select {...register('propertyType')}><option value="apartment">Apartment</option><option value="aparthotel">Aparthotel</option><option value="hotel">Hotel</option></select><FieldError errors={errors} name="propertyType" /></label>
            <label><span>Status</span><select {...register('status')}><option value="draft">Draft</option><option value="published">Published</option><option value="paused">Paused</option><option value="archived">Archived</option></select><FieldError errors={errors} name="status" /></label>
          </div>
        </fieldset>

        <fieldset className="property-form-section">
          <legend>Location and arrival</legend>
          <div className="property-form-grid property-form-grid--2">
            <label><span>Street address</span><input {...register('address')} autoComplete="street-address" /><FieldError errors={errors} name="address" /></label>
            <label><span>Batumi area</span><input {...register('area')} placeholder="New Boulevard" /><FieldError errors={errors} name="area" /></label>
            <label><span>Latitude <small>Optional</small></span><input {...register('latitude')} inputMode="decimal" placeholder="41.6168" /><FieldError errors={errors} name="latitude" /></label>
            <label><span>Longitude <small>Optional</small></span><input {...register('longitude')} inputMode="decimal" placeholder="41.6367" /><FieldError errors={errors} name="longitude" /></label>
            <label><span>Check-in</span><input type="time" {...register('checkInTime')} /><FieldError errors={errors} name="checkInTime" /></label>
            <label><span>Check-out</span><input type="time" {...register('checkOutTime')} /><FieldError errors={errors} name="checkOutTime" /></label>
          </div>
        </fieldset>

        <fieldset className="property-form-section">
          <legend>Guest contact</legend>
          <div className="property-form-grid property-form-grid--2">
            <label><span>Email <small>Optional</small></span><input type="email" {...register('contactEmail')} autoComplete="email" /><FieldError errors={errors} name="contactEmail" /></label>
            <label><span>Phone <small>Optional</small></span><input type="tel" {...register('contactPhone')} autoComplete="tel" /><FieldError errors={errors} name="contactPhone" /></label>
          </div>
        </fieldset>

        <fieldset className="property-form-section">
          <legend>Listing content</legend>
          <div className="translation-tabs" role="tablist" aria-label="Listing language">
            <button type="button" role="tab" aria-selected={locale === 'en'} className={locale === 'en' ? 'active' : ''} onClick={() => setLocale('en')}><Globe2 size={15} /> English</button>
            <button type="button" role="tab" aria-selected={locale === 'ka'} className={locale === 'ka' ? 'active' : ''} onClick={() => setLocale('ka')}><Globe2 size={15} /> ქართული</button>
          </div>
          {locale === 'en' ? <div className="property-form-stack" role="tabpanel">
            <label><span>Property name</span><input {...register('nameEn')} /><FieldError errors={errors} name="nameEn" /></label>
            <label><span>Short description</span><textarea rows={2} {...register('shortDescriptionEn')} /><FieldError errors={errors} name="shortDescriptionEn" /></label>
            <label><span>Full description</span><textarea rows={5} {...register('descriptionEn')} /><FieldError errors={errors} name="descriptionEn" /></label>
            <label><span>Policies <small>Optional</small></span><textarea rows={3} {...register('policiesEn')} /><FieldError errors={errors} name="policiesEn" /></label>
          </div> : <div className="property-form-stack" role="tabpanel" lang="ka">
            <label><span>ობიექტის სახელი</span><input {...register('nameKa')} /><FieldError errors={errors} name="nameKa" /></label>
            <label><span>მოკლე აღწერა</span><textarea rows={2} {...register('shortDescriptionKa')} /><FieldError errors={errors} name="shortDescriptionKa" /></label>
            <label><span>სრული აღწერა</span><textarea rows={5} {...register('descriptionKa')} /><FieldError errors={errors} name="descriptionKa" /></label>
            <label><span>წესები <small>არასავალდებულო</small></span><textarea rows={3} {...register('policiesKa')} /><FieldError errors={errors} name="policiesKa" /></label>
          </div>}
        </fieldset>

        <footer className="property-editor__actions">
          <Button type="button" variant="secondary" onClick={requestCancel}>Cancel</Button>
          <Button type="submit" loading={saving} icon={<Save size={17} />}>{values.id ? 'Save changes' : 'Create property'}</Button>
        </footer>
      </form>
    </section>
  )
}
