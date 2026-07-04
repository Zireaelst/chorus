import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  argTypes: {
    intent: {
      control: 'select',
      options: ['default', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter your email',
    intent: 'default',
    size: 'md',
    'aria-label': 'Email address',
  },
}

export const ErrorState: Story = {
  args: {
    placeholder: 'Invalid email',
    intent: 'error',
    size: 'md',
    'aria-label': 'Email address with error',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    'aria-label': 'Disabled input',
  },
}
