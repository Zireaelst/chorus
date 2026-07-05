'use client'

import * as React from 'react'
import { useState, useTransition } from 'react'
import { Input, Button } from '@chorus/ui'
import { searchCohorts, requestCohortAccess } from '../../actions/cohorts'
import { CopilotPrompt } from '../../components/CopilotPrompt'

export default function CohortDiscoveryPage() {
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestingId, setRequestingId] = useState<string | null>(null)

  // Form states for Copilot auto-fill
  const [icd10, setIcd10] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [biomarkers, setBiomarkers] = useState('')

  function handleCopilotCriteria(criteria: any) {
    if (criteria.icd10) setIcd10(criteria.icd10)
    if (criteria.minAge) setMinAge(criteria.minAge)
    if (criteria.maxAge) setMaxAge(criteria.maxAge)
    if (criteria.biomarkers) setBiomarkers(criteria.biomarkers)
  }

  async function handleSearch(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const response = await searchCohorts(formData)
      if (response.success) {
        setResults(response.items || [])
      } else {
        setError(response.error || 'Unknown error occurred')
      }
    })
  }

  async function handleRequestAccess(cohortId: string) {
    setRequestingId(cohortId)
    const response = await requestCohortAccess(cohortId, "Sponsor research access request via dashboard.")
    if (response.success) {
      alert("Access request sent to the hospital.")
    } else {
      alert("Error: " + response.error)
    }
    setRequestingId(null)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-medium text-white">Cohort Discovery</h3>
          <p className="text-sm text-white/50 mt-1">Build zero-knowledge queries to discover eligible patients across the network.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left: Query Builder */}
        <section className="flex-1 flex flex-col gap-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-medium text-white">AI Copilot</h4>
            <CopilotPrompt onCriteriaGenerated={handleCopilotCriteria} />
          </div>

          <div className="w-full h-px bg-white/10 my-2" />
          
          <h4 className="text-lg font-medium text-white">Query Parameters</h4>

          <form action={handleSearch} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80 ml-1">Diagnosis Code (ICD-10)</label>
              <Input type="text" name="icd10" value={icd10} onChange={(e) => setIcd10(e.target.value)} placeholder="e.g., E75.2" />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80 ml-1">Min Age</label>
                <Input type="number" name="minAge" value={minAge} onChange={(e) => setMinAge(e.target.value)} placeholder="0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80 ml-1">Max Age</label>
                <Input type="number" name="maxAge" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} placeholder="100" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80 ml-1">Required Biomarkers</label>
              <Input type="text" name="biomarkers" value={biomarkers} onChange={(e) => setBiomarkers(e.target.value)} placeholder="e.g., BRCA1, HER2" />
            </div>

            <div className="flex justify-end mt-4">
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? 'Executing...' : 'Run Query'}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-status-error/10 border border-status-error/20 text-status-error text-sm">
              {error}
            </div>
          )}

          {/* Results Area */}
          {results !== null && (
            <div className="mt-4 flex flex-col gap-4">
              <h4 className="text-lg font-medium text-white">Results ({results.length})</h4>
              {results.length === 0 ? (
                <p className="text-sm text-white/50">No cohorts matched your criteria.</p>
              ) : (
                results.map((cohort: any) => (
                  <div key={cohort.cohortId} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                    <div>
                      <div className="text-sm font-medium text-white">{cohort.title}</div>
                      <div className="text-xs text-white/50 mt-1">Est. Size: {cohort.sizeEstimate} patients</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRequestAccess(cohort.cohortId)}
                      disabled={requestingId === cohort.cohortId}
                    >
                      {requestingId === cohort.cohortId ? 'Requesting...' : 'Request Access'}
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

        </section>

        {/* Right: Network Status & Output */}
        <aside className="w-full md:w-80 flex flex-col gap-6 shrink-0">
          <div className="p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col gap-4">
            <h4 className="text-lg font-medium text-white">Network Scope</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Target Nodes</span>
              <span className="text-white font-medium">All (34)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Estimated Cost</span>
              <span className="text-white font-medium flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-verify">
                  <path d="M12 2L22 7.77778V16.2222L12 22L2 16.2222V7.77778L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                2.5 CHR
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-black/60 font-mono text-xs text-white/50 h-full flex flex-col">
            <div className="mb-2 text-white/30 border-b border-white/10 pb-2">Query Preview (ZKP Circuit)</div>
            <div className="flex-1 overflow-y-auto mt-2">
              <div className="text-accent-verify">import</div> &#123; Circuit &#125; <div className="text-accent-verify">from</div> 'chorus';
              <br/><br/>
              circuit.assert(patient.icd10 == '...');<br/>
              <br/>
              {isPending ? (
                <span className="text-accent-verify animate-pulse">// Compiling and broadcasting...</span>
              ) : (
                <span className="text-white/20">// Awaiting execution...</span>
              )}
            </div>
          </div>
        </aside>

      </div>
    </>
  )
}
