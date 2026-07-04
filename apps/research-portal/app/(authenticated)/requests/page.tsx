'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@chorus/ui';

interface RequestItem {
  id: string;
  cohortId: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
  decidedAt: string | null;
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch sponsor's own requests
    fetch('http://localhost:3001/v1/sponsor/access-requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">My Access Requests</h1>
          <p className="text-text-secondary">Track the status of your cohort access requests.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-text-secondary">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-text-secondary bg-bg-surface rounded-xl border border-border-default">
          You have no access requests yet.
        </div>
      ) : (
        <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden" aria-live="polite">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-default bg-bg-surface">
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Cohort ID</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Requested On</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Decided On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 text-sm font-mono text-text-primary">{req.cohortId.split('-')[0]}...</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={req.status === 'approved' ? 'success' : req.status === 'denied' ? 'danger' : 'neutral'}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {req.decidedAt ? new Date(req.decidedAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
