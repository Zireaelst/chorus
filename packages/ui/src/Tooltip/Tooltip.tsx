'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../utils'
import { useReducedMotion } from '../hooks/useReducedMotion'

const TooltipProvider = TooltipPrimitive.Provider
const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-sm border border-border-hairline bg-surface px-3 py-1.5 text-small text-text-primary shadow-popover',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {
  content: React.ReactNode
  children: React.ReactNode
}

export function Tooltip({
  children,
  content,
  ...props
}: TooltipProps) {
  const reducedMotion = useReducedMotion()
  return (
    <TooltipProvider delayDuration={reducedMotion ? 0 : 200}>
      <TooltipRoot {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}

export { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent }
