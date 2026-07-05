import * as React from 'react';
import { cookies } from 'next/headers';
import { QueryForm } from './components/QueryForm';
import { PrintableResultHeader } from './components/PrintableResultHeader';
import { ExportButton } from './components/ExportButton';
import { Badge } from '@chorus/ui';
import './print.css';

export default async function DisclosuresPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('chorus_session');
  
  const params = await searchParams;
  const cohortId = typeof params.cohortId === 'string' ? params.cohortId : '';
  const dateFrom = typeof params.dateFrom === 'string' ? params.dateFrom : '';
  const dateTo = typeof params.dateTo === 'string' ? params.dateTo : '';

  let results: any[] = [];
  let error: string | null = null;
  let hasQueried = false;

  if (cohortId || dateFrom || dateTo) {
    hasQueried = true;
    try {
      const urlParams = new URLSearchParams();
      if (cohortId) urlParams.set('cohortId', cohortId);
      if (dateFrom) urlParams.set('dateFrom', dateFrom);
      if (dateTo) urlParams.set('dateTo', dateTo);

      const res = await fetch(`http://127.0.0.1:4000/v1/compliance/disclosures?${urlParams.toString()}`, {
        headers: {
          cookie: `chorus_session=${sessionCookie?.value}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch disclosures');
      }

      const data = await res.json();
      results = data.items || [];
    } catch (err: any) {
      error = err.message;
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-display font-medium text-text-primary mb-2">Disclosure Queries</h2>
        <p className="text-body text-text-secondary">
          Execute pre-approved, non-free-text queries against the cryptographic verification record. 
          Every query, including those returning zero results, is logged for the audit-of-the-auditors requirement.
        </p>
      </div>

      <QueryForm />

      {hasQueried && (
        <div className="flex flex-col gap-4">
          <PrintableResultHeader cohortId={cohortId} dateFrom={dateFrom} dateTo={dateTo} />
          
          <div className="flex items-center justify-between print:hidden">
            <h3 className="text-h2 font-medium text-text-primary">Results</h3>
            <ExportButton />
          </div>
          
          {error && <p className="text-status-error">{error}</p>}
          
          {!error && results.length === 0 && (
            <div className="p-8 text-center bg-surface border border-border-hairline rounded-base shadow-panel">
              <p className="text-text-secondary">No disclosure events found for this query scope.</p>
            </div>
          )}

          {!error && results.length > 0 && (
            <div className="flex flex-col gap-4">
              {results.map((item: any, idx: number) => (
                <div key={idx} className="bg-surface p-6 border border-border-hairline rounded-base shadow-panel flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-border-hairline pb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-small text-text-secondary uppercase tracking-wider">Disclosure Event ID</span>
                      <span className="font-mono text-data text-text-primary">{item.disclosureId}</span>
                    </div>
                    <Badge intent="success">Verified</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-small text-text-secondary">Cohort ID</span>
                      <span className="font-mono text-data text-text-primary">{item.cohortId}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-small text-text-secondary">Occurred At</span>
                      <span className="font-mono text-data text-text-primary">{item.occurredAt}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-small text-text-secondary">Round Number</span>
                      <span className="font-mono text-data text-text-primary">{item.scopedSummary?.roundNumber}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-small text-text-secondary">Criteria Matched</span>
                      <span className="font-mono text-data text-text-primary">{item.scopedSummary?.criteriaMatched ? 'TRUE' : 'FALSE'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
