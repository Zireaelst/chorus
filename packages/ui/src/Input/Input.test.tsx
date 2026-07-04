import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders an input', () => {
    render(<Input placeholder="Test input" />)
    const input = screen.getByPlaceholderText('Test input')
    expect(input).not.toBeNull()
  })

  it('applies error styles when intent is error', () => {
    render(<Input placeholder="Error input" intent="error" />)
    const input = screen.getByPlaceholderText('Error input')
    expect(input.className).toContain('border-status-error')
  })
})
