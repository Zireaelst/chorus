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
    <section className="w-full py-24 sm:py-32 px-4 flex justify-center">
      <div className="w-full max-w-5xl group/triage grid grid-cols-1 md:grid-cols-3 gap-8">
        {audiences.map((aud, index) => (
          <div 
            key={index}
            className="flex flex-col p-6 rounded-base border border-border-hairline bg-surface transition-opacity duration-base ease-out opacity-100 group-hover/triage:opacity-40 hover:!opacity-100 focus-within:!opacity-100"
          >
            <h3 className="text-h2 font-medium text-text-primary mb-4">{aud.title}</h3>
            <p className="text-body text-text-secondary leading-relaxed">
              {aud.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
