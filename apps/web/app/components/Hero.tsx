'use client'

import * as React from 'react'

/**
 * A redaction block that appears over text after a delay,
 * then clears with an amber flash on hover/tap.
 */
function RedactedWord({ word, delayMs = 1500 }: { word: string, delayMs?: number }) {
  const [isRevealed, setIsRevealed] = React.useState(false)
  const [hasLanded, setHasLanded] = React.useState(false)

  React.useEffect(() => {
    // Redaction stamp lands after delay
    const timer = setTimeout(() => setHasLanded(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  const handleReveal = () => {
    if (!hasLanded || isRevealed) return
    setIsRevealed(true)
    
    // Automatically re-hide after 2 seconds
    setTimeout(() => {
      setIsRevealed(false)
    }, 2000)
  }

  return (
    <span 
      className="relative inline-block mx-1 cursor-pointer select-none group"
      onMouseEnter={handleReveal}
      onTouchStart={handleReveal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleReveal()
        }
      }}
      aria-label={isRevealed || !hasLanded ? word : "Redacted text"}
    >
      <span className={hasLanded && !isRevealed ? "opacity-0" : "opacity-100 transition-opacity duration-base"}>
        {word}
      </span>

      {/* Redaction block */}
      <span 
        className={`absolute inset-0 bg-text-primary transition-all duration-reveal ease-out ${
          !hasLanded ? "opacity-0 scale-y-0" : 
          isRevealed ? "opacity-0 scale-x-0 bg-accent-verify" : "opacity-100 scale-y-100 scale-x-110"
        }`} 
        aria-hidden="true"
      />
    </span>
  )
}

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-32 sm:py-48 min-h-[70vh]">
      <h1 className="text-display font-medium text-text-primary tracking-tight max-w-5xl mb-8 leading-tight">
        Prove your hospital&apos;s data is eligible. 
        <br className="hidden sm:block" />
        Without showing anyone <RedactedWord word="what" delayMs={1500} /> <RedactedWord word="it" delayMs={1600} /> <RedactedWord word="says." delayMs={1700} />
      </h1>
      
      <p className="text-h2 text-text-secondary max-w-3xl leading-relaxed">
        Chorus is the verification and settlement layer for confidential healthcare AI. 
        Train rare-disease and precision-medicine models together without raw patient data ever leaving your infrastructure.
      </p>
    </section>
  )
}
