'use client'

import * as React from 'react'

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-canvas font-sans">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50 scale-[1.1]"
        autoPlay
        loop
        muted
        playsInline
        src="/Hero_section_video.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/40 via-transparent to-canvas" />



      {/* Foreground Content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        {/* Giant staggered text */}
        <h1 className="hero-title absolute text-text-primary font-medium text-[15vw] leading-none left-[4%] top-[18%]">prove</h1>
        <h1 className="hero-title absolute text-text-primary font-medium text-[15vw] leading-none right-[4%] top-[34%]">your</h1>
        <h1 className="hero-title absolute text-text-primary font-medium text-[15vw] leading-none left-[28%] top-[50%]">data</h1>

        {/* Paragraph */}
        <p className="absolute left-[4%] top-[68%] max-w-[360px] text-[15px] leading-relaxed text-text-secondary font-medium">
          Chorus verifies healthcare data eligibility<br />
          without raw patient data ever leaving your<br />
          infrastructure. Automatically earn compensation<br />
          via the Midnight blockchain.
        </p>

        {/* Top-right stat */}
        <div className="absolute right-[8%] top-[18%] text-right">
          <div className="font-mono text-xl md:text-2xl text-accent-verify tracking-tight">
            0x8f2a...3b9c
          </div>
          <div className="text-sm text-text-secondary mt-1">verification proof</div>
        </div>

        {/* Bottom-left stat */}
        <div className="absolute left-[8%] bottom-[8%]">
          <div className="text-4xl md:text-5xl text-text-primary font-medium mb-1">
            0
          </div>
          <div className="text-sm text-text-secondary">raw records ever shared</div>
        </div>

        {/* Bottom-right stat */}
        <div className="absolute right-[8%] bottom-[8%] text-right">
          <div className="font-mono text-xl md:text-2xl text-text-primary tracking-wide">
            2026-07-04T14:32:01Z
          </div>
          <div className="text-sm text-text-secondary mt-1">latest proof generated</div>
        </div>
      </div>
    </section>
  )
}
