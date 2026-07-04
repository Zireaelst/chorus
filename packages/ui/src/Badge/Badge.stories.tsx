import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  argTypes: {
    intent: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'outline'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Badge',
    intent: 'default',
  },
}

export const Success: Story = {
  args: {
    children: 'Verified',
    intent: 'success',
  },
}

export const Warning: Story = {
  args: {
    children: 'Pending',
    intent: 'warning',
  },
}

export const ErrorState: Story = {
  args: {
    children: 'Failed',
    intent: 'error',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    intent: 'outline',
  },
}
