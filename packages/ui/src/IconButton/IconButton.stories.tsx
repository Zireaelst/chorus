import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './IconButton'
import { Search } from 'lucide-react'

const meta: Meta<typeof IconButton> = {
  title: 'Primitives/IconButton',
  component: IconButton,
  argTypes: {
    intent: {
      control: 'select',
      options: ['ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
}
export default meta

type Story = StoryObj<typeof IconButton>

export const Ghost: Story = {
  args: {
    children: <Search size={20} />,
    'aria-label': 'Search',
    intent: 'ghost',
    size: 'md',
  },
}

export const Outline: Story = {
  args: {
    children: <Search size={20} />,
    'aria-label': 'Search outline',
    intent: 'outline',
    size: 'md',
  },
}

export const Disabled: Story = {
  args: {
    children: <Search size={20} />,
    'aria-label': 'Search disabled',
    disabled: true,
  },
}
