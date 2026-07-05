import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'h1', 'h2', 'body', 'small', 'data'] }],
      'text-color': [{ text: ['canvas', 'surface', 'border-hairline', 'border-strong', 'text-primary', 'text-secondary', 'accent-verify', 'status-error', 'status-warning', 'status-success'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
