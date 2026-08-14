import { Star } from 'lucide-react'
import type { BatumiHotel } from '../../data/batumiHotels'
import { useLocale } from '../../i18n/LocaleProvider'

export function PropertyReviews({ hotel }: { hotel: BatumiHotel }) {
  const { t, formatNumber } = useLocale()
  const reviews = hotel.reviews
  if (!reviews) return null
  return <section className="property-reviews" aria-labelledby="property-reviews-title"><div className="content-container">
    <div className="property-reviews__heading"><div><p className="eyebrow">{t('Guest reviews')}</p><h2 id="property-reviews-title">{t('Ratings at a glance')}</h2></div><div className="review-overall" aria-label={`${reviews.score} / 10`}><strong>{reviews.score}</strong><div><span className="review-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star className={index < Math.round(reviews.score / 2) ? 'is-filled' : ''} key={index} size={15} />)}</span><b>{t(reviews.label)}</b><span>{formatNumber(reviews.count)} {t('reviews')}</span></div></div></div>
    <div className="review-categories">{reviews.categories.map((category) => <div key={category.label}><span>{t(category.label)}</span><strong>{category.score}</strong><div aria-hidden="true"><i style={{ width: `${category.score * 10}%` }} /></div></div>)}</div>
    <div className="review-feedback" aria-label={t('Recent guest feedback')}>{reviews.feedback.map((review) => <article key={`${review.author}-${review.country}`}><div className="review-feedback__top"><span className="review-avatar" aria-hidden="true">{review.author.charAt(0)}</span><div><strong>{review.author}</strong><span>{t(review.country)}</span></div><b>{review.score}/10</b></div><p>{t(review.text)}</p></article>)}</div>
  </div></section>
}
