import type { Metadata } from 'next'
import { Hero } from './components/Hero'
import { WaitlistForm } from './components/WaitlistForm'

export const metadata: Metadata = {
  title: 'Chorus — Verifiable Healthcare AI Collaboration',
}

export default function HomePage() {
  const docsUrl = process.env.DOCS_URL || 'http://localhost:3001'
  
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center pt-20 sm:pt-32 p-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <Hero />
        <WaitlistForm />
      </div>
      
      <div className="mt-32 text-center pb-12">
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
