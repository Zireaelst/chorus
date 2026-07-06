import { Badge } from '@chorus/ui';
import { AlertTriangle } from 'lucide-react';

export default function ContributionsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Contributions & Earnings</h1>
        <p className="text-text-secondary">View your verified contributions and settled payouts.</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium mb-1">Mock Data Notice (v0.4)</h3>
          <p className="text-sm">
            Proof engine and ledger integrations are scheduled for a later sprint. The data displayed below is entirely mocked for UI layout purposes and does not represent real federated learning contributions or settled stablecoin payouts.
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-medium mb-4">Recent Contributions</h2>
          <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-bg-subtle border-b border-border-default text-text-secondary text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Cohort</th>
                  <th className="px-6 py-4 font-medium">Round</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Verified At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default opacity-60">
                <tr>
                  <td className="px-6 py-4 font-medium text-text-primary">Type 2 Diabetes (Early Onset)</td>
                  <td className="px-6 py-4 text-text-secondary">Round 12</td>
                  <td className="px-6 py-4">
                    <Badge intent="success">Verified</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">2026-07-01 14:22 UTC</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-text-primary">Hypertension Study Q3</td>
                  <td className="px-6 py-4 text-text-secondary">Round 4</td>
                  <td className="px-6 py-4">
                    <Badge intent="default">Queued</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Earnings History</h2>
          <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-bg-subtle border-b border-border-default text-text-secondary text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Date Settled</th>
                  <th className="px-6 py-4 font-medium">Cohort</th>
                  <th className="px-6 py-4 font-medium">Tx Ref</th>
                  <th className="px-6 py-4 font-medium text-right">Amount (USDC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default opacity-60">
                <tr>
                  <td className="px-6 py-4 text-sm text-text-secondary">2026-07-02</td>
                  <td className="px-6 py-4 font-medium text-text-primary">Type 2 Diabetes (Early Onset)</td>
                  <td className="px-6 py-4 text-sm text-primary-base font-mono">0x123...abc</td>
                  <td className="px-6 py-4 text-right font-medium">1,250.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
