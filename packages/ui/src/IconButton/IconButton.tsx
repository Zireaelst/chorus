import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { iconButtonVariants, type IconButtonVariants } from './icon-button.variants'
import { cn } from '../utils'

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
    IconButtonVariants {
  'aria-label': string
  asChild?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, intent, size, asChild = false, 'aria-label': ariaLabel, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(iconButtonVariants({ intent, size, className }))}
        aria-label={ariaLabel}
        ref={ref}
        {...props}
      />
    )
  }
)
IconButton.displayName = 'IconButton'
