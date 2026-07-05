import * as React from 'react'
import { ElegantBackground } from '../components/ElegantBackground'
import { Navbar } from '../components/Navbar'

export default function DocsPage() {
  return (
    <div className="relative min-h-screen w-full bg-canvas flex flex-col items-center">
      <Navbar />

      <ElegantBackground>
        <div className="relative z-10 w-full max-w-5xl mx-auto pt-40 px-8 pb-32 flex flex-col gap-12">
          
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium w-max text-accent-verify">
              Developer Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">Chorus Protocol SDK</h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
              Integrate the Chorus Zero-Knowledge enclave directly into your hospital's infrastructure using our Node.js and Python SDKs.
            </p>
          </div>

          {/* Quick Start Card */}
          <div className="w-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-medium text-white">Quick Start</h2>
            <p className="text-white/60">Install the CLI to initialize a local testing enclave.</p>
            
            <div className="w-full rounded-2xl border border-white/10 bg-black/60 font-mono text-sm overflow-hidden">
              <div className="h-10 w-full bg-white/5 border-b border-white/10 flex items-center px-4">
                <div className="text-white/30 text-xs">Terminal</div>
              </div>
              <div className="p-4 text-white/80">
                <span className="text-accent-verify mr-2">$</span>
                npm install -g @chorus/cli
              </div>
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-black/60 font-mono text-sm overflow-hidden mt-2">
              <div className="h-10 w-full bg-white/5 border-b border-white/10 flex items-center px-4">
                <div className="text-white/30 text-xs">Terminal</div>
              </div>
              <div className="p-4 text-white/80">
                <span className="text-accent-verify mr-2">$</span>
                chorus init --mode=hospital-enclave
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="#" className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <h3 className="text-lg font-medium text-white mb-2">Architecture</h3>
              <p className="text-sm text-white/50">Read the technical whitepaper.</p>
            </a>
            <a href="#" className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <h3 className="text-lg font-medium text-white mb-2">API Reference</h3>
              <p className="text-sm text-white/50">Explore the GraphQL and REST endpoints.</p>
            </a>
            <a href="#" className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <h3 className="text-lg font-medium text-white mb-2">Smart Contracts</h3>
              <p className="text-sm text-white/50">Midnight smart contract integration guide.</p>
            </a>
          </div>

        </div>
      </ElegantBackground>
    </div>
  )
}
