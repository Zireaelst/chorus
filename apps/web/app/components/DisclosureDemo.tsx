'use client'

import * as React from 'react'

const REDACTED = "████████"

type ViewKey = "hospital" | "sponsor" | "regulator"

const disclosureRows = [
  {
    label: "Patient Count",
    hospital: { value: "1,204", visible: true },
    sponsor: { value: "1,204", visible: true },
    regulator: { value: REDACTED, visible: false },
  },
  {
    label: "Diagnosis Code",
    hospital: { value: "ICD-10 E75.2", visible: true },
    sponsor: { value: "cohort: E75.x", visible: true },
    regulator: { value: REDACTED, visible: false },
  },
  {
    label: "Demographics",
    hospital: { value: "Age 4-12, mixed", visible: true },
    sponsor: { value: REDACTED, visible: false },
    regulator: { value: REDACTED, visible: false },
  },
  {
    label: "Verification Proof ID",
    hospital: { value: "0x8f2a...3b9c", visible: true, accent: true },
    sponsor: { value: "0x8f2a...3b9c", visible: true, accent: true },
    regulator: { value: "0x8f2a...3b9c", visible: true, accent: true },
  },
  {
    label: "Compliance Check",
    hospital: { value: "Passed", visible: true, accent: true },
    sponsor: { value: "Passed", visible: true, accent: true },
    regulator: { value: "Passed", visible: true, accent: true },
  },
]

export function DisclosureDemo() {
  const [view, setView] = React.useState<ViewKey>("hospital")

  return (
    <section className="relative w-full px-6 md:px-16 py-32 flex flex-col items-center border-t border-white/5">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative w-full max-w-4xl flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-4">Programmable Privacy</h2>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Switch views below to observe how the cryptographic engine deterministically redacts sensitive fields based on the viewer's role.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl mb-8 backdrop-blur-md">
          {(["hospital", "sponsor", "regulator"] as ViewKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${
                view === key 
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {key} View
            </button>
          ))}
        </div>

        {/* Glass Panel Terminal */}
        <div className="w-full relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Mac-like Window Header */}
          <div className="h-12 w-full bg-white/5 border-b border-white/10 flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="ml-4 font-mono text-xs text-white/30">Secure Data Enclave — {view.toUpperCase()}</div>
          </div>

          <div className="flex flex-col divide-y divide-white/5 p-2">
            {disclosureRows.map((row, idx) => {
              const cell = row[view]
              return (
                <div key={row.label} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-2 transition-colors hover:bg-white/[0.02]">
                  <span className="text-sm text-white/60">{row.label}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm tracking-wide transition-all duration-300 ${
                        cell.accent
                          ? "text-accent-verify font-mono drop-shadow-[0_0_8px_var(--color-accent-verify)]"
                          : cell.visible
                          ? "text-white font-mono"
                          : "text-white/20 bg-white/10 px-2 py-0.5 rounded-md animate-pulse"
                      }`}
                    >
                      {cell.value}
                    </span>
                    {!cell.visible && (
                      <span className="text-xs text-white/40 italic px-2 border border-white/10 rounded-full">Redacted</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
