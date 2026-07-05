import type { Metadata } from 'next'

import { Hero } from './components/Hero'
import { ProblemStatement } from './components/ProblemStatement'
import { TrustList } from './components/TrustList'
import { AudienceTriage } from './components/AudienceTriage'
import { HonestStatus } from './components/HonestStatus'
import { DisclosureDemo } from './components/DisclosureDemo'
import { ClosingCTA } from './components/ClosingCTA'
import { ProductShowcase } from './components/ProductShowcase'
import { ElegantBackground } from './components/ElegantBackground'

export const metadata: Metadata = {
  title: 'Chorus — Prove your hospital\'s data is eligible. Without showing anyone what it says.',
  description: 'Chorus is the verification and settlement layer for confidential healthcare AI.'
}

export default function HomePage() {
  const docsUrl = process.env.DOCS_URL || 'http://localhost:3001'
  
  return (
    <main className="min-h-screen bg-canvas flex flex-col w-full">
      <Hero />
      <ElegantBackground>
        <ProblemStatement />
        <ProductShowcase />
        <TrustList />
        <AudienceTriage />
        <HonestStatus />
        <DisclosureDemo />
        <ClosingCTA />
        
        <footer className="px-6 md:px-16 py-6 border-t border-border-hairline flex justify-center sm:justify-start">
          <a 
            href={docsUrl} 
            className="text-small text-text-secondary hover:text-text-primary transition-colors"
          >
            View Developer Documentation
          </a>
        </footer>
      </ElegantBackground>
    </main>
  )
}
