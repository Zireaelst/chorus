import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

import { Hero } from './components/Hero'
import { ProblemStatement } from './components/ProblemStatement'
import { TrustList } from './components/TrustList'
import { AudienceTriage } from './components/AudienceTriage'
import { HonestStatus } from './components/HonestStatus'
import { DisclosureDemo } from './components/DisclosureDemo'
import { ClosingCTA } from './components/ClosingCTA'

// Dynamically import GSAP-heavy mechanism scene to keep it out of initial JS payload.
const MechanismScene = dynamic(() => import('./components/MechanismScene'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Chorus — Prove your hospital\'s data is eligible. Without showing anyone what it says.',
  description: 'Chorus is the verification and settlement layer for confidential healthcare AI.'
}

export default function HomePage() {
  const docsUrl = process.env.DOCS_URL || 'http://localhost:3001'
  
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center">
      <Hero />
      <ProblemStatement />
      <MechanismScene />
      <TrustList />
      <AudienceTriage />
      <HonestStatus />
      <DisclosureDemo />
      <ClosingCTA />
      
      <div className="w-full text-center pb-12 pt-8">
        <a 
          href={docsUrl} 
          className="text-sm text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4"
        >
          View Developer Documentation
        </a>
      </div>
    </main>
  )
}
