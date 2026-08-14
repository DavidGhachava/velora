import type { BatumiHotel } from '../../data/batumiHotels'
import { useLocale } from '../../i18n/LocaleProvider'

export function PropertyGallery({ hotel }: { hotel: BatumiHotel }) {
  const { t } = useLocale()
  if (!hotel.gallery?.length) return null

  return <section className="property-gallery" aria-labelledby="property-gallery-title">
    <div className="content-container property-gallery__header"><h2 id="property-gallery-title">{t('Property photos')}</h2><span>{hotel.gallery.length} {t('photos')}</span></div>
    <div className="content-container property-gallery__grid">
      {hotel.gallery.map((photo, index) => <figure className={index === 0 ? 'property-gallery__featured' : ''} key={photo.image}>
        <img src={photo.image} srcSet={`${photo.imageSmall} 640w, ${photo.image} 1200w${photo.imageLarge ? `, ${photo.imageLarge} 1600w` : ''}`} sizes={index === 0 ? '(max-width: 767px) 88vw, 58vw' : '(max-width: 767px) 72vw, 28vw'} width="1200" height="800" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" alt={photo.alt} />
        <figcaption>{t(photo.label)}</figcaption>
      </figure>)}
    </div>
  </section>
}
