import { cva, type VariantProps } from 'class-variance-authority'

export const iconButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        ghost: 'text-text-secondary hover:bg-surface hover:text-text-primary',
        outline: 'border border-border-strong bg-transparent text-text-primary hover:bg-surface',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
      },
    },
    defaultVariants: {
      intent: 'ghost',
      size: 'md',
    },
  }
)

export type IconButtonVariants = VariantProps<typeof iconButtonVariants>
