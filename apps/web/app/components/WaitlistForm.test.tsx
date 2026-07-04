import * as React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { WaitlistForm } from './WaitlistForm'

vi.mock('../actions/joinWaitlist', () => ({
  joinWaitlist: vi.fn(),
}))

// Mock useActionState to return specific states for testing
const mockUseActionState = vi.fn()
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useActionState: (...args: any[]) => mockUseActionState(...args),
  }
})

describe('WaitlistForm', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders correctly in idle state', () => {
    mockUseActionState.mockReturnValue([{ status: 'idle' }, vi.fn(), false])
    render(<WaitlistForm />)
    expect(screen.getByPlaceholderText('Enter your email')).not.toBeNull()
    expect(screen.getByRole('button', { name: /Join Waitlist/i })).not.toBeNull()
  })

  it('displays success message', () => {
    mockUseActionState.mockReturnValue([{ status: 'success', message: 'You have been added to the waitlist.' }, vi.fn(), false])
    render(<WaitlistForm />)
    const message = screen.getByText('You have been added to the waitlist.')
    expect(message).not.toBeNull()
    expect(message.className).toContain('text-status-success')
  })

  it('displays duplicate message without error styling', () => {
    mockUseActionState.mockReturnValue([{ status: 'duplicate', message: 'This email is already on the waitlist.' }, vi.fn(), false])
    render(<WaitlistForm />)
    const message = screen.getByText('This email is already on the waitlist.')
    expect(message).not.toBeNull()
    expect(message.className).toContain('text-text-secondary')
    expect(message.className).not.toContain('error')
  })

  it('disables input and button when pending', () => {
    mockUseActionState.mockReturnValue([{ status: 'idle' }, vi.fn(), true])
    render(<WaitlistForm />)
    const input = screen.getByPlaceholderText('Enter your email') as HTMLInputElement
    const button = screen.getByRole('button', { name: /Joining/i }) as HTMLButtonElement
    
    expect(input.disabled).toBe(true)
    expect(button.disabled).toBe(true)
  })
})
