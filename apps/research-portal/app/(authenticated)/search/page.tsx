'use client';

import React, { useState } from 'react';
import { Button, Input } from '@chorus/ui';
import { Search } from 'lucide-react';

interface SearchResult {
  cohortId: string;
  title: string;
  orgId: string;
  sizeEstimate: string;
}

export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [justification, setJustification] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate hitting GET /v1/cohorts/search
    // For this mock Sprint 6, we just fetch all to show bucketing
    try {
      const res = await fetch('http://localhost:3001/v1/cohorts/search');
      if (res.ok) {
        const data = await res.json();
        setResults(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHasSearched(true);
    }
  };

  const handleRequestAccess = async (cohortId: string) => {
    if (!justification.trim()) {
      alert("Please provide a justification");
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:3001/v1/cohorts/${cohortId}/access-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ justification })
      });
      
      if (res.status === 409) {
        alert("You already have a pending request for this cohort.");
      } else if (res.ok) {
        alert("Request submitted successfully.");
        setRequestingId(null);
        setJustification('');
      } else {
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Cohort Search</h1>
        <p className="text-text-secondary">Discover eligible cohorts for your trial.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input className="w-full pl-10" placeholder="ICD-10 codes, conditions, demographics..." />
        </div>
        <Button variant="primary" type="submit">Search</Button>
      </form>

      <div aria-live="polite">
        {hasSearched && results.length === 0 && (
          <div className="text-center py-12 text-text-secondary bg-bg-surface rounded-xl border border-border-default">
            No cohorts match your criteria.
          </div>
        )}

        <div className="space-y-4">
          {results.map((r) => (
            <div key={r.cohortId} className="bg-bg-elevated border border-border-default rounded-xl p-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-1">{r.title}</h3>
                <p className="text-sm text-text-secondary mb-4">Institution ID: <span className="font-mono">{r.orgId.split('-')[0]}...</span></p>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">Matched Patients:</span>
                  <span className="inline-block px-2 py-1 bg-bg-subtle border border-border-default rounded text-sm font-mono tabular-nums text-text-secondary">
                    {r.sizeEstimate}
                  </span>
                </div>
              </div>
              
              <div className="w-80">
                {requestingId === r.cohortId ? (
                  <div className="space-y-3">
                    <textarea 
                      className="w-full p-2 text-sm bg-bg-default border border-border-default rounded focus:outline-none focus:ring-1 focus:ring-primary-base"
                      placeholder="Protocol justification..."
                      value={justification}
                      onChange={e => setJustification(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1" onClick={() => setRequestingId(null)}>Cancel</Button>
                      <Button variant="primary" size="sm" className="flex-1" onClick={() => handleRequestAccess(r.cohortId)}>Submit</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="secondary" className="w-full" onClick={() => setRequestingId(r.cohortId)}>
                    Request Access
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
