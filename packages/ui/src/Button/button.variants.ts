import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-base font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        primary: 'bg-text-primary text-canvas hover:opacity-90',
        secondary: 'border border-border-strong bg-transparent text-text-primary hover:bg-surface',
        destructive: 'bg-status-error text-canvas hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3 text-small',
        md: 'h-10 px-4 text-body',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
