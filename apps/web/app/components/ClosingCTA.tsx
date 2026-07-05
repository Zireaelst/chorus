'use client'

import * as React from 'react'
import { WaitlistForm } from './WaitlistForm'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@chorus/ui'

export function ClosingCTA() {
  return (
    <section className="relative w-full flex justify-center px-6 md:px-16 py-32 border-t border-white/5">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none" />
      <div className="relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 p-12 rounded-3xl border border-white/10 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md">
        <h2 className="text-display text-white font-medium">Ready to prove something?</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="group relative bg-white text-black rounded-2xl px-10 py-4 text-body font-medium hover:bg-neutral-200 transition-all duration-300 whitespace-nowrap overflow-hidden">
              <span className="relative z-10">Apply Now</span>
              <div className="absolute inset-0 bg-white/20 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
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
      </div>
    </section>
  )
}
