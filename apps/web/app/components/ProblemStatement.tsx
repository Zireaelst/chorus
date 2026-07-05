import * as React from 'react'

export function ProblemStatement() {
  return (
    <section className="relative w-full px-6 md:px-16 py-16 flex justify-center border-t border-white/5">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm pointer-events-none" />
      <div className="relative w-full max-w-5xl text-center">
        <p className="text-display text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 font-medium max-w-4xl mx-auto leading-tight">
          The rarest diagnoses need the most data.
          <br className="hidden sm:block" />
          The most data lives in the fewest hands.
        </p>
      </div>
    </section>
  )
}
