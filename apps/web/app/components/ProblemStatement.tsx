import * as React from 'react'

export function ProblemStatement() {
  return (
    <section className="relative w-full py-32 sm:py-48 flex flex-col items-center justify-center overflow-hidden">
      {/* 
        Background texture: near-invisible field of small rectangles 
        "never legible as an icon, just density"
      */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      
      <div className="relative z-10 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-display font-medium text-text-primary tracking-tight">
          The rarest diagnoses need the most data.
          <br className="hidden sm:block" />
          The most data lives in the fewest hands.
        </h2>
      </div>
    </section>
  )
}
