'use client'

import * as React from 'react'
import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

export default function MechanismScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dataBlockRef = useRef<HTMLDivElement>(null)
  const proofLineRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  useGSAP(() => {
    if (prefersReducedMotion) return
    if (!containerRef.current || !dataBlockRef.current || !proofLineRef.current || !nodeRef.current || !metaRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1, // Smooth reversing scrub
      }
    })

    // 1. Data block shrinks and thins
    tl.to(dataBlockRef.current, {
      scale: 0.8,
      opacity: 0.3,
      duration: 1
    })

    // 2. Proof line emerges and flows right
    tl.to(proofLineRef.current, {
      scaleX: 1,
      opacity: 1,
      duration: 1
    }, "-=0.5")

    // 3. Line hits node, node pulses amber
    tl.to(nodeRef.current, {
      backgroundColor: "var(--color-accent-verify)",
      scale: 1.5,
      duration: 0.2,
      ease: "power2.out" // Closest standard GSAP ease for verification pulse, though token ease-verify is used in CSS mostly
    })
    tl.to(nodeRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.in"
    })

    // 4. Monospace meta appears
    tl.to(metaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, { scope: containerRef, dependencies: [prefersReducedMotion] })

  // Static fallback for reduced motion
  if (prefersReducedMotion) {
    return (
      <section className="w-full py-24 px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-8 items-center bg-surface border border-border-hairline p-8 rounded-base">
           <div className="p-6 bg-canvas border border-border-hairline text-text-secondary text-sm font-mono opacity-50 rounded-sm">
             [RAW_DATA_BLOCK]
           </div>
           <div className="h-4 w-1 bg-accent-verify" />
           <div className="w-4 h-4 rounded-full bg-accent-verify" />
           <div className="text-data font-mono text-text-secondary">
             2026-07-04T14:32:01Z • 0x8f2a...3b9c
           </div>
        </div>
      </section>
    )
  }

  // Scroll-linked GSAP scene
  return (
    <section 
      ref={containerRef} 
      className="w-full py-32 sm:py-64 flex justify-center px-4 overflow-hidden relative"
    >
      <div className="w-full max-w-5xl flex items-center justify-between h-[400px]">
        {/* Left: Dense unreadable data block */}
        <div 
          ref={dataBlockRef}
          className="w-1/3 h-full bg-canvas border border-border-hairline rounded-md p-4 overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)', backgroundSize: '100% 4px' }} />
        </div>

        {/* Middle: Proof line emerging */}
        <div className="flex-1 h-full flex items-center relative">
          <div 
            ref={proofLineRef}
            className="h-px bg-accent-verify origin-left scale-x-0 opacity-0 w-full absolute left-0"
          />
        </div>

        {/* Right: Node and Meta */}
        <div className="w-1/3 flex flex-col items-center relative">
          <div 
            ref={nodeRef}
            className="w-3 h-3 rounded-full bg-border-hairline z-10 transition-colors"
          />
          
          <div 
            ref={metaRef}
            className="absolute top-8 opacity-0 translate-y-4 flex flex-col items-center gap-1"
          >
            <span className="text-data font-mono text-text-primary">0x8f2a...3b9c</span>
            <span className="text-data font-mono text-text-secondary">2026-07-04T14:32:01Z</span>
          </div>
        </div>
      </div>
    </section>
  )
}
