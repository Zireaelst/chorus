import * as React from 'react'
import { inputVariants, type InputVariants } from './input.variants'
import { cn } from '../utils'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputVariants {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, intent, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ intent, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
