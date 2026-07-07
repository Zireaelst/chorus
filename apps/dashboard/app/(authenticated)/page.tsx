'use client';

import { Users, FileText, Database, ShieldAlert, CheckCircle2, Clock, ArrowRight, Wallet } from 'lucide-react';
import { Button, Badge } from '@chorus/ui';
import { CreateCohortModal } from '@/app/components/CreateCohortModal';
import { mockCohorts, mockContributions } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeCohortsCount, setActiveCohortsCount] = React.useState(0);
  const [pendingApprovalsCount, setPendingApprovalsCount] = React.useState(0);
  const [contributions, setContributions] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const sessionRes = await fetch('http://127.0.0.1:4000/v1/auth/session', { credentials: 'include' });
        if (!sessionRes.ok) throw new Error('Not authenticated');
        const sessionData = await sessionRes.json();
        const orgId = sessionData.user.memberships[0]?.orgId;
        
        if (orgId) {
          const contribRes = await fetch(`http://127.0.0.1:4000/v1/orgs/${orgId}/contributions`, { credentials: 'include' });
          if (contribRes.ok) {
            const cData = await contribRes.json();
            const items = cData.items || [];
            setContributions(items);
            setPendingApprovalsCount(items.filter((c: any) => c.status === 'processing' || c.status === 'queued').length);
          }
        }
        // Assuming cohorts count is separate, for now we leave it as mock
        setActiveCohortsCount(mockCohorts.filter(c => c.status === 'healthy').length);
      } catch (err) {
        console.error('Failed to fetch overview data', err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-full">
      <header className="px-8 py-8 border-b border-border-hairline bg-canvas">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-display tracking-tight text-text-primary">Overview</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Welcome back. Monitor your consortium participations and cryptographic verifications here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button intent="secondary">Download Audit Log</Button>
            <CreateCohortModal />
          </div>
        </div>
      </header>
      
      <div className="flex-1 p-8 bg-canvas space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-border-hairline shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-status-success/10 text-status-success">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-text-secondary">Active Consortiums</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-mono font-medium text-text-primary">{activeCohortsCount}</p>
              <Badge intent="success">Healthy</Badge>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-surface border border-border-hairline shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-status-warning/10 text-status-warning">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-text-secondary">Pending Queries</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-mono font-medium text-text-primary">{pendingApprovalsCount}</p>
              <span className="text-sm text-text-secondary">Requires review</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border-hairline shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent-brand/10 text-accent-brand">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-text-secondary">Compensation Earned</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-mono font-medium text-text-primary">16,900</p>
              <span className="text-sm font-medium text-text-secondary">USDC</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-text-primary">Recent Cryptographic Verifications</h3>
            <Link href="/contributions" className="text-sm font-medium text-accent-brand hover:text-accent-brand-hover flex items-center transition-colors">
              View all verifications <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="border border-border-hairline rounded-lg overflow-hidden bg-surface">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface border-b border-border-hairline">
                <tr>
                  <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Tx Hash / Event</th>
                  <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Consortium</th>
                  <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline">
                {contributions.slice(0, 4).map((cont) => {
                  return (
                    <tr key={cont.id} className="hover:bg-border-hairline/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-text-primary">
                          {cont.status === 'verified' ? <CheckCircle2 className="w-4 h-4 text-status-success" /> : <Clock className="w-4 h-4 text-status-warning" />}
                          <div>
                            <p className="font-medium">Cohort Qualification</p>
                            <p className="text-xs text-text-secondary font-mono mt-0.5">{cont.onChainTxRef}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary font-mono">{cont.cohortId.substring(0, 8)}...</td>
                      <td className="px-6 py-4 text-right">
                        <Badge intent={cont.status === 'verified' ? 'success' : cont.status === 'queued' || cont.status === 'processing' ? 'warning' : 'error'}>
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
    </div>
  );
}
