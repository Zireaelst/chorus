import * as React from 'react'

const items = [
  "We will never ask for raw patient records.",
  "We will never ask for direct identifiers.",
  "We will never ask for a copy of your database.",
  "We will never ask for access beyond a defined boundary.",
]

export function TrustList() {
  return (
    <section className="w-full py-24 sm:py-32 flex flex-col items-center">
      <div className="w-full max-w-4xl px-4">
        <ol className="space-y-6 sm:space-y-8">
          {items.map((text, index) => (
            <li 
              key={index} 
              className="group relative flex items-start text-h2 font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <span className="mr-6 tabular-nums opacity-50">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <span className="relative">
                {text}
                {/* 
                  Redaction-style strikethrough that appears on hover, 
                  but text remains legible beneath (refusal, not vague promise).
                */}
                <span 
                  className="absolute top-1/2 left-0 w-full h-[10%] bg-text-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-reveal ease-out opacity-80" 
                  aria-hidden="true"
                />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
