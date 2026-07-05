import * as React from 'react'

export function HonestStatus() {
  return (
    <section className="relative w-full flex justify-center px-6 md:px-16 py-16">
      <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6">
        
        {/* Glowing Pill Badge */}
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-accent-verify/20 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-5 py-2 transition-transform duration-300 group-hover:-translate-y-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M12 2L22 7.77778V16.2222L12 22L2 16.2222V7.77778L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium text-white tracking-wide">Built on Midnight</span>
          </div>
        </div>

        {/* Disclaimer Text */}
        <p className="text-sm text-white/40 max-w-xl leading-relaxed">
          Chorus is currently building with a select group of design-partner institutions under NDA. 
          We believe in cryptographic truth—no invented metrics, no inflated network scale.
        </p>

      </div>
    </section>
  )
}
