import { LazyMotion, domAnimation } from 'framer-motion'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../../i18n/LocaleProvider'
import { LocaleMenu } from './LocaleMenu'

describe('LocaleMenu', () => {
  beforeEach(() => window.localStorage.clear())

  it('opens and applies language and currency choices', () => {
    render(<LocaleProvider><LazyMotion features={domAnimation}><LocaleMenu /></LazyMotion></LocaleProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'Open language and currency settings' }))
    expect(screen.getByRole('dialog', { name: 'Language and currency' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Georgian' }))
    expect(document.documentElement.lang).toBe('ka')
    expect(screen.getByText('KA · GEL')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'USD' }))
    expect(screen.getByText('KA · USD')).toBeInTheDocument()
  })
})
