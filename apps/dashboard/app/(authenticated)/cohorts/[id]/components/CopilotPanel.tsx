'use client';

import React, { useState } from 'react';
import { Button, Input, Badge } from '@chorus/ui';
import { Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import type { CopilotDraftResponse, ComplianceCheckResponse } from '@chorus/types';

export function CopilotPanel() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draftData, setDraftData] = useState<CopilotDraftResponse | null>(null);
  const [complianceData, setComplianceData] = useState<ComplianceCheckResponse | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      // Proxy to the API endpoint
      const res = await fetch('/v1/copilot/cohort-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: prompt })
      });
      if (res.status === 422) {
        alert("PII Detected. Please remove direct identifiers and try again.");
        return;
      }
      
      const data = await res.json();
      setDraftData(data);
      
      // Auto-trigger compliance check on the draft
      if (data.suggestedCriteria) {
        const compRes = await fetch('/v1/copilot/compliance-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ criteria: data.suggestedCriteria, jurisdiction: 'us' })
        });
        if (compRes.ok) {
          const compData = await compRes.json();
          setComplianceData(compData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-96 border-l border-border-default bg-bg-surface flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 border-b border-border-default flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary-base" />
        <h2 className="font-semibold text-text-primary">AI Copilot</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <form onSubmit={handleGenerate} className="space-y-3">
          <label className="text-sm font-medium text-text-secondary">Describe your cohort</label>
          <textarea 
            className="w-full min-h-[100px] p-3 text-sm bg-bg-default border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-base"
            placeholder="E.g. Patients over 18 with hypertension..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button intent="primary" className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Criteria'}
          </Button>
        </form>

        <div aria-live="polite" className="space-y-6">
          {draftData?.ambiguousFields && draftData.ambiguousFields.length > 0 && (
            <div className="bg-bg-subtle border border-border-default rounded-md p-3">
              <h3 className="text-sm font-medium text-text-primary mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-text-secondary" />
                Ambiguous Criteria Detected
              </h3>
              <ul className="text-sm text-text-secondary list-disc pl-5 space-y-1">
                {draftData.ambiguousFields.map((field, idx) => (
                  <li key={idx}>{field}</li>
                ))}
              </ul>
            </div>
          )}

          {draftData?.suggestedCriteria && (
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">Suggested Criteria</h3>
              <div className="space-y-2">
                {/* Simulated redaction-reveal micro-interaction for demonstration */}
                <div className="p-3 bg-bg-default border border-border-default rounded-md animate-[reveal_var(--dur-reveal)_ease-out]">
                  <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono">
                    {JSON.stringify(draftData.suggestedCriteria, null, 2)}
                  </pre>
                </div>
                <Button intent="secondary" className="w-full text-sm">
                  Apply Suggestions
                </Button>
              </div>
            </div>
          )}

          {complianceData?.flags && complianceData.flags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">Compliance Review</h3>
              <div className="space-y-3">
                {complianceData.flags.map((flag, idx) => (
                  <div key={idx} className="p-3 bg-bg-elevated border border-border-default rounded-md text-sm space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-text-primary">{flag.regulation}</span>
                      {/* Using standard badge variants, explicitly avoiding 'verify-amber' */}
                      <Badge intent={flag.severity === 'blocking' ? 'error' : 'default'}>
                        {flag.severity === 'blocking' ? 'Blocking' : 'Advisory'}
                      </Badge>
                    </div>
                    <p className="text-text-secondary">{flag.explanation}</p>
                    <div className="bg-bg-subtle p-2 rounded text-xs text-text-muted border border-border-hairline italic">
                      Citation: {flag.citation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
