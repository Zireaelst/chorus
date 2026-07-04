import type { Meta, StoryObj } from '@storybook/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './Dialog'
import { Button } from '../Button/Button'

const meta: Meta<typeof Dialog> = {
  title: 'Primitives/Dialog',
  component: Dialog,
}
export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild>
          <Button intent="secondary">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a description inside the dialog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button intent="primary">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </>
    ),
  },
}
