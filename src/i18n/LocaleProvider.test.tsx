import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { formatMoney } from '../domain/money'
import { LocaleProvider, useLocale } from './LocaleProvider'

function PreferenceProbe() {
  const { language, currency, setLanguage, setCurrency, t } = useLocale()
  return <><span>{t('Find a stay')}</span><span>{formatMoney(27000)}</span><span>{language}-{currency}</span><button onClick={() => setLanguage('ka')}>KA</button><button onClick={() => setCurrency('USD')}>USD</button></>
}

describe('LocaleProvider', () => {
  beforeEach(() => window.localStorage.clear())

  it('persists Georgian and converts stored GEL prices to USD', async () => {
    render(<LocaleProvider><PreferenceProbe /></LocaleProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'KA' }))
    expect(screen.getByText('საცხოვრებლის პოვნა')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'USD' }))
    expect(screen.getByText(/103.*US\$/)).toBeInTheDocument()
    await waitFor(() => expect(window.localStorage.getItem('velora-language')).toBe('ka'))
    expect(window.localStorage.getItem('velora-currency')).toBe('USD')
    expect(document.documentElement.lang).toBe('ka')
  })
})
