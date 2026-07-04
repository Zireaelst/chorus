import * as React from 'react'

export interface RedactionMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
}

export function RedactionMark({ size = 24, ...props }: RedactionMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  )
}
