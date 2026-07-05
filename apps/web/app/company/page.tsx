import * as React from 'react'
import { ElegantBackground } from '../components/ElegantBackground'
import { Navbar } from '../components/Navbar'

export default function CompanyPage() {
  return (
    <div className="relative min-h-screen w-full bg-canvas flex flex-col items-center">
      <Navbar />

      <ElegantBackground>
        <div className="relative z-10 w-full max-w-6xl mx-auto pt-40 px-8 pb-32 flex flex-col gap-24">
          
          {/* Hero Section */}
          <div className="text-center flex flex-col items-center gap-6">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight">Truth over Trust.</h1>
            <p className="text-white/60 max-w-2xl text-center text-lg leading-relaxed">
              We are building the cryptographic truth layer for healthcare. We believe that privacy and progress should not be mutually exclusive.
            </p>
          </div>

          {/* Core Values / Mission */}
          <div className="w-full flex flex-col md:flex-row gap-8">
            <div className="flex-1 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-xl font-medium text-white mb-3">Privacy by Math</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We don't ask you to trust our policies or our employees. We ask you to trust the mathematics of zero-knowledge proofs. Our systems are mathematically incapable of exposing your data.
              </p>
            </div>
            <div className="flex-1 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-xl font-medium text-white mb-3">Radical Transparency</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Every line of our core cryptographic engine is open-source and continuously audited by independent security researchers. You can verify our work at any time.
              </p>
            </div>
          </div>

          {/* Security Audits Section */}
          <div className="flex flex-col gap-8 items-center mt-8">
            <h2 className="text-3xl font-medium text-white text-center">Security Audits & Compliance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {/* Audit Badge 1 */}
              <div className="group relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center text-center hover:border-white/20 transition-all duration-300">
                <div className="absolute top-0 right-0 p-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-status-success/10 border border-status-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-[10px] font-medium text-status-success uppercase tracking-widest">Passed</span>
                  </div>
                </div>
                <div className="w-12 h-12 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-white mb-1">Smart Contract Audit</h4>
                <p className="text-xs text-white/50 mb-4">Conducted by Trail of Bits</p>
                <button className="text-sm text-accent-verify hover:text-white transition-colors">View Report</button>
              </div>

              {/* Audit Badge 2 */}
              <div className="group relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center text-center hover:border-white/20 transition-all duration-300">
                <div className="absolute top-0 right-0 p-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-status-success/10 border border-status-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-[10px] font-medium text-status-success uppercase tracking-widest">Verified</span>
                  </div>
                </div>
                <div className="w-12 h-12 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-white mb-1">HIPAA Compliance</h4>
                <p className="text-xs text-white/50 mb-4">Independent 3rd Party Assessment</p>
                <button className="text-sm text-accent-verify hover:text-white transition-colors">View Report</button>
              </div>

              {/* Audit Badge 3 */}
              <div className="group relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center text-center hover:border-white/20 transition-all duration-300">
                <div className="absolute top-0 right-0 p-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-status-success/10 border border-status-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-[10px] font-medium text-status-success uppercase tracking-widest">Certified</span>
                  </div>
                </div>
                <div className="w-12 h-12 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-white mb-1">SOC 2 Type II</h4>
                <p className="text-xs text-white/50 mb-4">In Progress (Expected Q4 2026)</p>
                <button className="text-sm text-white/40 cursor-not-allowed">Pending</button>
              </div>
            </div>
          </div>

        </div>
      </ElegantBackground>
    </div>
  )
}
