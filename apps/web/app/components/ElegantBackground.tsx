'use client'

import * as React from 'react'

export function ElegantBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full bg-canvas min-h-screen">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col">
        {children}
      </div>
    </div>
  )
}
