import * as React from 'react'
import { badgeVariants, type BadgeVariants } from './badge.variants'
import { cn } from '../utils'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {}

export function Badge({ className, intent, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ intent }), className)} {...props} />
  )
}
