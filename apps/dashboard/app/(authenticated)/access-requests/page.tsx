'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Button } from '@chorus/ui';

interface IncomingRequest {
  id: string;
  cohortId: string;
  status: 'pending' | 'approved' | 'denied';
  justification: string;
  createdAt: string;
  requestingOrg: { name: string };
}

export default function HospitalAccessRequestsPage() {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:3001/v1/hospital/access-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (requestId: string, decision: 'approved' | 'denied') => {
    try {
      const res = await fetch(`http://localhost:3001/v1/access-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      if (res.ok) {
        // Optimistically update
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: decision } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Access Requests</h1>
        <p className="text-text-secondary">Review sponsor requests for cohort access.</p>
      </div>

      {loading ? (
        <div className="text-text-secondary">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-text-secondary bg-bg-surface rounded-xl border border-border-default">
          No pending access requests.
        </div>
      ) : (
        <div className="space-y-4" aria-live="polite">
          {requests.map(req => (
            <div key={req.id} className="bg-bg-elevated border border-border-default rounded-xl p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-text-primary">{req.requestingOrg.name}</h3>
                  <Badge variant={req.status === 'approved' ? 'success' : req.status === 'denied' ? 'danger' : 'neutral'}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Requested access to Cohort <span className="font-mono">{req.cohortId.split('-')[0]}...</span> on {new Date(req.createdAt).toLocaleDateString()}
                </p>
                
                <div className="bg-bg-subtle border border-border-default rounded p-4">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Justification</span>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{req.justification}</p>
                </div>
              </div>
              
              {req.status === 'pending' && (
                <div className="flex flex-row md:flex-col gap-2 min-w-[140px]">
                  <Button variant="primary" onClick={() => handleDecision(req.id, 'approved')}>
                    Approve
                  </Button>
                  <Button variant="secondary" onClick={() => handleDecision(req.id, 'denied')}>
                    Deny
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
