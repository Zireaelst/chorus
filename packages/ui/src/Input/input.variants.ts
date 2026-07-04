import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariants = cva(
  'flex w-full rounded-sm border bg-transparent px-3 py-2 text-body transition-colors duration-fast file:border-0 file:bg-transparent file:text-small file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      intent: {
        default: 'border-border-strong focus-visible:ring-border-strong',
        error: 'border-status-error focus-visible:ring-status-error text-status-error',
      },
      size: {
        sm: 'h-8 text-small',
        md: 'h-10 text-body',
      },
    },
    defaultVariants: {
      intent: 'default',
      size: 'md',
    },
  }
)

export type InputVariants = VariantProps<typeof inputVariants>
