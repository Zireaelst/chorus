import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center rounded-pill border px-2.5 py-0.5 text-small font-medium transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-border-strong',
  {
    variants: {
      intent: {
        default: 'border-transparent bg-surface text-text-primary',
        success: 'border-transparent bg-status-success text-canvas',
        warning: 'border-transparent bg-status-warning text-canvas',
        error: 'border-transparent bg-status-error text-canvas',
        outline: 'text-text-primary border-border-strong',
      },
    },
    defaultVariants: {
      intent: 'default',
    },
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
