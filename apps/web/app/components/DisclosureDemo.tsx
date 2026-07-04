'use client'

import * as React from 'react'
import { demoFixture, type DisclosureView } from '../lib/disclosure-demo-fixture'
import { Button } from '@chorus/ui/components/button'

function AnimatedField({ value, label }: { value: string | null, label: string }) {
  const [displayValue, setDisplayValue] = React.useState<string | null>(value)
  const [isRedacting, setIsRedacting] = React.useState(false)

  React.useEffect(() => {
    if (value !== displayValue) {
      setIsRedacting(true)
      const timer1 = setTimeout(() => {
        setDisplayValue(value)
      }, 400) // dur-reveal

      const timer2 = setTimeout(() => {
        setIsRedacting(false)
      }, 800) // dur-reveal * 2

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [value, displayValue])

  const isMono = label.includes('ID') || label.includes('Timestamp')

  return (
    <div className="flex flex-col gap-1 py-3 border-b border-border-hairline last:border-0 relative">
      <span className="text-small text-text-secondary">{label}</span>
      <div className="relative h-6 overflow-hidden flex items-center">
        {displayValue ? (
          <span className={`text-body text-text-primary ${isMono ? 'font-mono text-data' : ''} transition-opacity duration-base ${isRedacting ? 'opacity-0' : 'opacity-100'}`}>
            {displayValue}
          </span>
        ) : (
          <span className="text-body text-text-secondary italic opacity-50">Redacted</span>
        )}

        {/* Redaction block for transition */}
        <span 
          className={`absolute left-0 top-0 h-full bg-text-primary origin-left transition-transform duration-reveal ease-out ${
            isRedacting ? "scale-x-100" : "scale-x-0"
          }`}
          aria-hidden="true"
          style={{ width: displayValue ? `${Math.max(displayValue.length * 8, 80)}px` : '80px' }}
        />
      </div>
    </div>
  )
}

export function DisclosureDemo() {
  const [view, setView] = React.useState<DisclosureView>('hospital')

  return (
    <section className="w-full py-24 sm:py-32 flex flex-col items-center px-4">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className="text-center mb-8">
          <h2 className="text-h1 font-medium text-text-primary mb-4">Interactive Disclosure</h2>
          <p className="text-body text-text-secondary">
            Switch views to see how cryptographic proofs control data visibility deterministically.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8 bg-surface p-1 rounded-lg border border-border-hairline self-center">
          <Button 
            variant={view === 'hospital' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setView('hospital')}
          >
            Hospital View
          </Button>
          <Button 
            variant={view === 'sponsor' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setView('sponsor')}
          >
            Sponsor View
          </Button>
          <Button 
            variant={view === 'regulator' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setView('regulator')}
          >
            Regulator View
          </Button>
        </div>

        <div className="bg-surface border border-border-hairline rounded-base p-6 sm:p-8 shadow-panel">
          <div className="flex flex-col">
            {demoFixture.map((field) => (
              <AnimatedField 
                key={field.label} 
                label={field.label}
                value={
                  view === 'hospital' ? field.hospitalValue :
                  view === 'sponsor' ? field.sponsorValue : 
                  field.regulatorValue
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
