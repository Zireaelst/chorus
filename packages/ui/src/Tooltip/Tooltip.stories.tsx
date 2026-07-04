import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../Button/Button'

const meta: Meta<typeof Tooltip> = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    children: <Button intent="secondary">Hover me</Button>,
    content: 'This is a tooltip',
  },
}
