import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('renders an icon button with accessible name', () => {
    render(<IconButton aria-label="Close">X</IconButton>)
    const button = screen.getByRole('button', { name: /close/i })
    expect(button).not.toBeNull()
  })

  it('fails type checking if aria-label is omitted', () => {
    // This is a type-level test. We use @ts-expect-error to ensure
    // TypeScript throws an error when aria-label is omitted.
    // @ts-expect-error aria-label is required
    const _invalid = <IconButton>X</IconButton>
    expect(true).toBe(true)
  })
})
