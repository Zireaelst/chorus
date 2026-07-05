import * as React from 'react'

const audiences = [
  {
    title: "Hospitals & Biobanks",
    description: "Monetize clinical datasets safely without transferring liability or losing control of patient privacy."
  },
  {
    title: "Research Sponsors",
    description: "Discover eligible cohorts and execute federated training across a network of trusted institutions."
  },
  {
    title: "Regulators & Auditors",
    description: "Inspect cryptographically guaranteed proofs of compliance, scoped exactly to the legal disclosure boundary."
  }
]

export function AudienceTriage() {
  return (
    <section className="relative w-full px-6 md:px-16 py-32 flex justify-center border-t border-white/5">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none" />
      
      <div className="relative w-full max-w-6xl flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-4">Built for the Entire Ecosystem</h2>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            Chorus unites the disparate entities in healthcare research through a shared, trustless protocol.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((card, index) => (
            <div 
              key={index}
              className="group relative flex flex-col p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_10px_40px_rgba(255,255,255,0.05)]"
            >
              {/* Animated Spotlight Hover Background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <h3 className="relative z-10 text-xl font-medium text-white mb-4">{card.title}</h3>
              <p className="relative z-10 text-base text-white/60 leading-relaxed">
                {card.description}
              </p>

              <div className="mt-8 relative z-10">
                <span className="text-sm font-medium text-accent-verify group-hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2">
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
