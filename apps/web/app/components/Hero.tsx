import * as React from 'react'

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
      <h1 className="text-display font-medium text-text-primary tracking-tight max-w-4xl mb-6">
        Prove your hospital&apos;s data is eligible. Without showing anyone what it says.
      </h1>
      <p className="text-h2 text-text-secondary max-w-2xl">
        Chorus is the verification and settlement layer for confidential healthcare AI. 
        Train rare-disease and precision-medicine models together without raw patient data ever leaving your infrastructure.
      </p>
    </section>
  )
}
