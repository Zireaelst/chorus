import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders a tooltip trigger', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    )
    const trigger = screen.getByRole('button', { name: /hover me/i })
    expect(trigger).not.toBeNull()
  })
})
