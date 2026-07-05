import * as React from 'react'

const items = [
  "We will never ask for raw patient records.",
  "We will never ask for direct identifiers.",
  "We will never ask for a copy of your database.",
  "We will never ask for access beyond a defined boundary.",
]

export function TrustList() {
  return (
    <section className="relative w-full px-6 md:px-16 py-32 flex justify-center border-t border-white/5">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none" />
      
      <div className="relative w-full max-w-5xl flex flex-col gap-16">
        
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-4">Our Core Promises</h2>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            Chorus is designed from the ground up to protect your hospital's liability. We operate under a strict, cryptographically enforced zero-trust policy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div 
              key={item} 
              className="group relative h-48 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:-translate-y-1"
            >
              {/* Giant Background Number */}
              <div className="absolute -bottom-8 -right-4 text-[120px] font-mono font-bold text-white/[0.03] leading-none pointer-events-none group-hover:text-white/[0.06] transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Glowing Line */}
              <div className="absolute top-0 left-0 w-1 h-0 bg-accent-verify transition-all duration-500 ease-out group-hover:h-full opacity-0 group-hover:opacity-100 shadow-[0_0_15px_var(--color-accent-verify)]" />

              {/* Content */}
              <div className="relative z-10 w-full h-full p-8 flex items-center">
                <p className="text-lg md:text-xl font-medium text-white/90 leading-tight">
                  {item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
