'use client'

import * as React from 'react'
import { WaitlistForm } from './WaitlistForm'
import { Button } from '@chorus/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@chorus/ui/components/dialog'

export function ClosingCTA() {
  return (
    <section className="w-full py-32 sm:py-48 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-display font-medium text-text-primary tracking-tight mb-12">
        Ready to prove something?
      </h2>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="group relative overflow-hidden"
          >
            {/* Small echo of redaction blocks on hover */}
            <span className="absolute inset-0 bg-text-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-reveal ease-out opacity-20" aria-hidden="true" />
            <span className="relative z-10">Apply</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="mb-6">
            <DialogTitle>Join the Waitlist</DialogTitle>
            <DialogDescription>
              We are currently onboarding a small group of design partners. Apply to join the network.
            </DialogDescription>
          </DialogHeader>
          <WaitlistForm />
        </DialogContent>
      </Dialog>
    </section>
  )
}
