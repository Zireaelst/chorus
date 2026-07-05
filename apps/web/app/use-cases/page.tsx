import * as React from 'react'
import { ElegantBackground } from '../components/ElegantBackground'
import { Navbar } from '../components/Navbar'

export default function UseCasesPage() {
  return (
    <div className="relative min-h-screen w-full bg-canvas flex flex-col items-center">
      <Navbar />

      <ElegantBackground>
        <div className="relative z-10 w-full max-w-6xl mx-auto pt-40 px-8 pb-32 flex flex-col gap-24">
          
          {/* Hero Section */}
          <div className="text-center flex flex-col items-center gap-6">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight">Unlock Healthcare Data Silos Safely</h1>
            <p className="text-white/60 max-w-2xl text-center text-lg leading-relaxed">
              Discover how research institutions, biobanks, and regulators leverage zero-knowledge data networks to accelerate medical breakthroughs without compromising privacy.
            </p>
          </div>

          {/* Scenarios List */}
          <div className="flex flex-col gap-16">
            
            {/* Scenario 1: Hospitals */}
            <div className="flex flex-col md:flex-row gap-12 items-center bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
              <div className="flex-1 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium w-max text-accent-verify">
                  For Hospitals & Biobanks
                </div>
                <h2 className="text-3xl font-medium text-white">Monetize Without Liability</h2>
                <p className="text-white/60 leading-relaxed">
                  Traditionally, sharing clinical data meant transferring liability. You had to strip identifiers, sign complex BAAs, and pray the recipient secured the data. 
                  With Chorus, your data never leaves your server. You only share cryptographic proofs of eligibility, allowing you to monetize your datasets safely.
                </p>
                <ul className="flex flex-col gap-3 mt-4">
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> Zero data transfer risk.
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> Automated compliance checks.
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> Immediate ROI on legacy EHR systems.
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
                <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 border border-accent-verify rounded-full animate-ping opacity-20" />
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Scenario 2: Pharma & Sponsors */}
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
              <div className="flex-1 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium w-max text-accent-verify">
                  For Pharma & Research Sponsors
                </div>
                <h2 className="text-3xl font-medium text-white">Instant Cohort Discovery</h2>
                <p className="text-white/60 leading-relaxed">
                  Stop spending months negotiating access to siloed databases. The Chorus network allows you to broadcast encrypted queries across hundreds of institutions simultaneously, finding exact patient cohorts in milliseconds.
                </p>
                <ul className="flex flex-col gap-3 mt-4">
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> Query thousands of sites instantly.
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> Eliminate data procurement delays.
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> Execute federated model training.
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 border border-white/5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]" />
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-32 h-32 border border-accent-verify/30 rounded-full animate-[spin_4s_linear_infinite] border-t-accent-verify" />
                  <div className="absolute w-48 h-48 border border-white/10 rounded-full animate-[spin_8s_linear_infinite_reverse] border-b-white/50" />
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>

        </div>
      </ElegantBackground>
    </div>
  )
}
