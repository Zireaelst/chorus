import * as React from 'react'
import { Hexagon } from 'lucide-react'

export function HonestStatus() {
  return (
    <section className="w-full py-16 sm:py-24 flex flex-col items-center border-t border-border-hairline">
      <div className="w-full max-w-4xl px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <p className="text-body text-text-secondary max-w-lg">
          Chorus is building with a small group of design-partner institutions under NDA. 
          No invented metrics, no inflated network scale.
        </p>
        
        <div className="flex items-center gap-2 text-small text-text-secondary opacity-70">
          <Hexagon className="w-4 h-4" />
          <span>Built on Midnight</span>
        </div>
      </div>
    </section>
  )
}
