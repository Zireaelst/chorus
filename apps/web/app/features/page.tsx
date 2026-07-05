import * as React from 'react'
import { ElegantBackground } from '../components/ElegantBackground'
import { Navbar } from '../components/Navbar'

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen w-full bg-canvas flex flex-col items-center">
      <Navbar />

      <ElegantBackground>
        <div className="relative z-10 w-full max-w-6xl mx-auto pt-40 px-8 pb-32 flex flex-col gap-24">
          
          {/* Hero Section */}
          <div className="text-center flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
              <span className="w-2 h-2 rounded-full bg-accent-verify shadow-[0_0_8px_var(--color-accent-verify)] animate-pulse" />
              Cryptographic Truth Layer
            </div>
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight">Zero-Knowledge.<br/>Zero Liability.</h1>
            <p className="text-white/60 max-w-2xl text-center text-lg leading-relaxed">
              Deep dive into the cryptographic architecture and secure enclaves that power the Chorus Protocol.
            </p>
          </div>

          {/* Architecture Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="flex flex-col gap-12">
              <div className="group relative flex flex-col gap-3">
                <div className="absolute -left-6 top-1.5 w-1.5 h-1.5 rounded-full bg-accent-verify shadow-[0_0_10px_var(--color-accent-verify)] opacity-50 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-medium text-white">1. Local Enclaves</h3>
                <p className="text-white/60 leading-relaxed">
                  Data never leaves the hospital. We deploy a lightweight, containerized node directly into your secure infrastructure. The node connects locally to your EHR, ensuring compliance from day one.
                </p>
              </div>

              <div className="group relative flex flex-col gap-3">
                <div className="absolute -left-6 top-1.5 w-1.5 h-1.5 rounded-full bg-accent-verify shadow-[0_0_10px_var(--color-accent-verify)] opacity-50 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-medium text-white">2. Verifiable Computation</h3>
                <p className="text-white/60 leading-relaxed">
                  When a researcher queries for cohorts, the local enclave runs a Zero-Knowledge circuit. It validates eligibility against the local database, stripping all PII and PHI.
                </p>
              </div>

              <div className="group relative flex flex-col gap-3">
                <div className="absolute -left-6 top-1.5 w-1.5 h-1.5 rounded-full bg-accent-verify shadow-[0_0_10px_var(--color-accent-verify)] opacity-50 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-medium text-white">3. Decentralized Audit Trail</h3>
                <p className="text-white/60 leading-relaxed">
                  The enclave emits only a mathematical proof of the computation. This proof is logged immutably on the Midnight network, providing a transparent, trustless audit trail for regulators.
                </p>
              </div>
            </div>

            {/* Right: Terminal Snippet */}
            <div className="relative w-full rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="h-12 w-full bg-white/5 border-b border-white/10 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-[#FF5F56] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-[#FFBD2E] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-[#27C93F] transition-colors" />
                <div className="ml-4 font-mono text-xs text-white/30">chorus-node ~ ./generate-proof.sh</div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                <div className="text-white/40 mb-2">$ chorus protocol execute --circuit=eligibility-v2</div>
                <div className="text-white/80">Initializing local enclave... <span className="text-status-success">[OK]</span></div>
                <div className="text-white/80">Connecting to secure EHR database... <span className="text-status-success">[OK]</span></div>
                <div className="text-white/80">Running zero-knowledge circuits...</div>
                <div className="text-white/40 pl-4">▸ Scanning 124,000 records</div>
                <div className="text-white/40 pl-4">▸ Filtering by ICD-10 E75.2</div>
                <div className="text-white/40 pl-4">▸ Removing PHI/PII vectors</div>
                <div className="text-white/80">Generating cryptographic proof... <span className="text-accent-verify animate-pulse">Wait</span></div>
                <div className="text-accent-verify mt-4 font-bold">Proof successfully generated.</div>
                <div className="text-white/50 break-all mt-2">Hash: 0x8f2a1b9c4d...3b9c7e2f1a</div>
                <div className="text-white/80 mt-4">Broadcasting to network... <span className="text-status-success">[OK]</span></div>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="w-full mt-12 p-12 rounded-3xl border border-white/10 bg-gradient-to-tr from-white/[0.05] to-transparent text-center flex flex-col items-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent-verify/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-50 transition-opacity duration-1000 pointer-events-none" />
            <h2 className="text-3xl font-medium text-white">Ready to deploy?</h2>
            <p className="text-white/60">Our team can deploy a test enclave in your infrastructure in under 15 minutes.</p>
            <button className="relative z-10 bg-white text-black font-medium rounded-xl px-8 py-3 hover:bg-neutral-200 transition-colors">
              Schedule Technical Demo
            </button>
          </div>

        </div>
      </ElegantBackground>
    </div>
  )
}
