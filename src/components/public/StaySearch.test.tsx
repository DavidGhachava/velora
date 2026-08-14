import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StaySearch } from './StaySearch'

describe('StaySearch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens the date picker when either date field is clicked', async () => {
    const showPicker = vi.fn()
    Object.defineProperty(HTMLInputElement.prototype, 'showPicker', {
      configurable: true,
      value: showPicker,
    })

    render(<MemoryRouter><StaySearch /></MemoryRouter>)
    const user = userEvent.setup()

    await user.click(screen.getByLabelText('Arrival'))
    await user.click(screen.getByLabelText('Departure'))

    expect(showPicker).toHaveBeenCalledTimes(2)
  })
})
