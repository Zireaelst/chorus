'use client';

import * as React from 'react';
import { Activity, Download, FileText, Filter, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { Button, Input, Badge, IconButton } from '@chorus/ui';
import { mockContributions, mockCohorts, type Contribution } from '@/lib/mock-data';

export default function ContributionsPage() {
  const [search, setSearch] = React.useState('');
  const [contributions, setContributions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const sessionRes = await fetch('http://127.0.0.1:4000/v1/auth/session', { credentials: 'include' });
        if (!sessionRes.ok) throw new Error('Not authenticated');
        const sessionData = await sessionRes.json();
        const orgId = sessionData.user.memberships[0]?.orgId;
        
        if (!orgId) {
          throw new Error('No orgId found');
        }

        const [contribRes, payoutRes] = await Promise.all([
          fetch(`http://127.0.0.1:4000/v1/orgs/${orgId}/contributions`, { credentials: 'include' }),
          fetch(`http://127.0.0.1:4000/v1/orgs/${orgId}/payouts`, { credentials: 'include' })
        ]);
        
        let contribs = [];
        let payouts = [];
        
        if (contribRes.ok) {
          const cData = await contribRes.json();
          contribs = cData.items || [];
        }
        
        if (payoutRes.ok) {
          const pData = await payoutRes.json();
          payouts = pData.items || [];
        }

        // Join payouts to contributions
        const joined = contribs.map((c: any) => {
          const payout = payouts.find((p: any) => p.contributionId === c.id);
          return {
            ...c,
            payout
          };
        });
        
        setContributions(joined);
      } catch (err) {
        console.error('Failed to fetch contributions', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const filteredContributions = contributions.filter(cont => {
    return (
      cont.onChainTxRef?.toLowerCase().includes(search.toLowerCase()) ||
      cont.status.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col min-h-full">
      <header className="px-8 py-8 border-b border-border-hairline bg-canvas">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-text-primary" />
            <div>
              <h2 className="text-3xl font-bold font-display tracking-tight text-text-primary">Cryptographic Ledger</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Verifiable record of your hospital's Zero-Knowledge proofs and metadata disclosures on the Midnight blockchain.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button intent="secondary" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 p-8 bg-canvas space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-80">
            <Input 
              placeholder="Search by tx hash or status..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button intent="secondary" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="border border-border-hairline rounded-lg overflow-hidden bg-surface">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border-hairline">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Event / Proof Type</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Midnight Tx Hash</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Consortium ID</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Payout</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Timestamp</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                    Loading contributions...
                  </td>
                </tr>
              ) : filteredContributions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : filteredContributions.map((cont) => {
                return (
                  <tr key={cont.id} className="hover:bg-border-hairline/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-text-primary font-medium">
                        {cont.status === 'verified' ? <CheckCircle2 className="w-4 h-4 text-status-success" /> : <Clock className="w-4 h-4 text-status-warning" />}
                        Cohort Qualification
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge intent="default" className="font-mono bg-surface">
                        {cont.onChainTxRef || 'Pending...'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-mono">
                      {cont.cohortId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-mono text-text-primary">
                      {cont.payout ? `${cont.payout.amount} ${cont.payout.currency}` : 'None'}
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-mono">
                      {cont.verifiedAt ? new Date(cont.verifiedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge 
                        intent={cont.status === 'verified' ? 'success' : cont.status === 'queued' || cont.status === 'processing' ? 'warning' : 'error'} 
                      >
                        {cont.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
