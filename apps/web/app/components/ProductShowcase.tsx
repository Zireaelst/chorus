import * as React from 'react'

export function ProductShowcase() {
  return (
    <section className="relative w-full px-6 md:px-16 py-24 flex justify-center border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none" />
      
      <div className="relative w-full max-w-5xl flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-4 mb-8">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">How Chorus Works</h2>
          <p className="text-white/60 max-w-2xl leading-relaxed">
            A radical shift in healthcare data security. We don't centralize your data. We distribute our cryptographic validation engine to you.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          
          {/* Card 1: Local Data Engine (Spans 2 columns) */}
          <div className="md:col-span-2 group relative p-8 md:p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col justify-end transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_40px_rgba(255,255,255,0.05)]">
            
            {/* Visuals */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
              <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-accent-verify/10 rounded-full blur-[80px] group-hover:bg-accent-verify/20 transition-colors duration-700" />
              <div className="absolute right-12 top-12 w-24 h-24 border border-white/20 rounded-2xl flex items-center justify-center bg-black/50 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80" />
                </svg>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-2/3">
              <div className="text-xs font-mono text-accent-verify/80 mb-3 tracking-widest uppercase">Step 01</div>
              <h3 className="text-2xl font-medium text-white mb-3">Local Data Engine</h3>
              <p className="text-white/60 leading-relaxed">
                Your hospital's data never leaves your secure infrastructure. Chorus deploys a lightweight, containerized validator node directly into your environment.
              </p>
            </div>
          </div>

          {/* Card 2: Zero Knowledge Proofs */}
          <div className="group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col justify-end transition-all duration-500 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(255,255,255,0.05)]">
            
            {/* Visuals */}
            <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500">
              <div className="font-mono text-sm text-accent-verify tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
                0x8f2a...3b9c
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-xs font-mono text-white/50 mb-3 tracking-widest uppercase">Step 02</div>
              <h3 className="text-xl font-medium text-white mb-3">Zero-Knowledge</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                The node inspects eligibility locally, strips all PHI, and emits only a cryptographic proof of fact.
              </p>
            </div>
          </div>

          {/* Card 3: Global Network Verification */}
          <div className="group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col justify-end transition-all duration-500 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(255,255,255,0.05)]">
            
            {/* Visuals */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
            </div>

            <div className="relative z-10">
              <div className="text-xs font-mono text-white/50 mb-3 tracking-widest uppercase">Step 03</div>
              <h3 className="text-xl font-medium text-white mb-3">Global Consensus</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Proofs are registered on the decentralized Chorus Protocol, ensuring irrefutable auditability.
              </p>
            </div>
          </div>

          {/* Card 4: Compliance Engine (Spans 2 columns) */}
          <div className="md:col-span-2 group relative p-8 md:p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col justify-end transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_40px_rgba(255,255,255,0.05)]">
            
            {/* Visuals */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700" 
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 10px)' }} />

            <div className="relative z-10 w-full md:w-2/3">
              <div className="text-xs font-mono text-accent-verify/80 mb-3 tracking-widest uppercase">Result</div>
              <h3 className="text-2xl font-medium text-white mb-3">100% HIPAA & GDPR Compliant</h3>
              <p className="text-white/60 leading-relaxed">
                Researchers get the cohort sizing and eligibility data they need to cure diseases, while your liability remains at exactly zero.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
