import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GuestPaymentForm } from './GuestPaymentForm'

describe('GuestPaymentForm', () => {
  it('shows secure payment guidance and prevents incomplete submission', async () => {
    const submit = vi.fn()
    render(<GuestPaymentForm onSubmit={submit} onBack={() => undefined} loading={false} paymentError={null} />)
    expect(screen.getByText(/card details are encrypted/i)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /pay and reserve/i }))
    expect(await screen.findByText('Enter your first name.')).toBeInTheDocument()
    expect(submit).not.toHaveBeenCalled()
  })
})
