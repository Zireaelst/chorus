import * as React from 'react'
import { Navbar } from '../components/Navbar'

export default function NetworkPage() {
  return (
    <div className="relative min-h-screen w-full bg-canvas flex flex-col items-center">
      <Navbar />

      {/* Elegant Background Setup */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-[20%] w-[60vw] h-[60vw] bg-accent-verify/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      </div>

      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at top, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black 20%, transparent 70%)'
        }}
      />

      <main className="relative z-10 w-full max-w-6xl pt-40 px-8 pb-32 flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
            <span className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_var(--color-status-success)] animate-pulse" />
            Network Status: Operational
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">The Global Chorus Network</h1>
          <p className="text-white/60 max-w-2xl leading-relaxed">
            A decentralized topology of trusted hospitals, biobanks, and research institutions running confidential nodes to verify data without exposing patient records.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Large Feature Card */}
          <div className="md:col-span-2 group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col justify-end transition-all hover:border-white/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-verify/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-verify/30 transition-all duration-500" />
            <h3 className="text-2xl font-medium text-white mb-2 relative z-10">Zero-Knowledge Verification</h3>
            <p className="text-white/60 relative z-10 max-w-md">
              Nodes process locally and only emit cryptographic proofs. No PHI or PII ever leaves the hospital's secure boundary.
            </p>
          </div>

          {/* Stat Card */}
          <div className="group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col justify-center items-center text-center transition-all hover:border-white/20 hover:-translate-y-1">
            <div className="text-6xl font-medium text-white mb-2">34</div>
            <div className="text-sm font-medium text-accent-verify tracking-widest uppercase">Active Nodes</div>
          </div>

          {/* Map/Globe Placeholder */}
          <div className="md:col-span-3 group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center transition-all hover:border-white/20 min-h-[400px] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
               {/* Decorative grid pattern mimicking a globe/network */}
               <div className="w-[800px] h-[800px] rounded-full border border-white/10 absolute animate-[spin_60s_linear_infinite]" />
               <div className="w-[600px] h-[600px] rounded-full border border-white/10 absolute animate-[spin_40s_linear_infinite_reverse]" />
               <div className="w-[400px] h-[400px] rounded-full border border-white/10 absolute border-dashed" />
            </div>
            
            <div className="relative z-10 text-center flex flex-col items-center">
              <h3 className="text-2xl font-medium text-white mb-4">Global Distribution</h3>
              <p className="text-white/60 max-w-lg mb-8">
                Hospitals across North America, Europe, and Asia are already validating millions of records silently.
              </p>
              <button className="bg-white text-black font-medium rounded-xl px-6 py-2.5 hover:bg-neutral-200 transition-colors">
                View Node Explorer
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
