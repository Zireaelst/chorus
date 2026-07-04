import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders a badge', () => {
    render(<Badge>Verified</Badge>)
    const badge = screen.getByText('Verified')
    expect(badge).not.toBeNull()
  })

  it('applies success styles when intent is success', () => {
    render(<Badge intent="success">Verified Success</Badge>)
    const badge = screen.getByText('Verified Success')
    expect(badge.className).toContain('bg-status-success')
  })
})
