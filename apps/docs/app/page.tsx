import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chorus Developer Documentation',
}

export default function DocsPage() {
  const webUrl = process.env.WEB_URL || 'http://localhost:3000'
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-h1 font-medium text-text-primary mb-4">
        Chorus Documentation
      </h1>
      <p className="text-text-secondary max-w-md mb-8">
        Full developer documentation and Compact contract specifications will be available closer to the v1.0 release.
      </p>
      
      <a 
        href={webUrl} 
        className="text-sm text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4"
      >
        Return to Chorus
      </a>
    </main>
  )
}
