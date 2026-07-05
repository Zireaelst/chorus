import * as React from 'react'
import { WaitlistForm } from '../components/WaitlistForm'
import { ElegantBackground } from '../components/ElegantBackground'
import { Navbar } from '../components/Navbar'

export default function ApplyPage() {
  return (
    <div className="relative min-h-screen w-full bg-canvas flex flex-col items-center">
      <Navbar />

      <ElegantBackground>
        <div className="relative z-10 w-full max-w-lg mx-auto pt-40 px-8 pb-32 flex flex-col gap-8">
          
          <div className="text-center flex flex-col items-center gap-4">
            <h1 className="text-3xl font-medium text-white tracking-tight">Apply for Network Access</h1>
            <p className="text-sm text-white/50">
              We are currently onboarding a small group of design partners. Apply to join the Chorus network.
            </p>
          </div>

          <div className="w-full p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <WaitlistForm />
          </div>

        </div>
      </ElegantBackground>
    </div>
  )
}
