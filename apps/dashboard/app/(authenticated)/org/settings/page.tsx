import { Button, Input, Badge } from '@chorus/ui';

export default function OrgSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Organization Settings</h1>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary" htmlFor="org-name">
            Organization Name
          </label>
          <Input id="org-name" placeholder="E.g. General Hospital" defaultValue="Chorus Default Org" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary" htmlFor="contact-email">
            Contact Email
          </label>
          <Input id="contact-email" type="email" placeholder="admin@example.com" />
        </div>

        <Button variant="primary" type="submit">
          Save Settings
        </Button>
      </form>

      {/* Sprint 10 Billing Section (Read Only) */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Billing & Ledger</h2>
        
        <div className="bg-bg-elevated border border-border-default rounded-xl p-6 mb-6">
            <h3 className="text-xl font-medium mb-2">Subscription Tier</h3>
            <p className="text-text-secondary mb-4">Your current platform access level.</p>
            <div className="flex items-center gap-4">
                <span className="font-semibold text-lg">Enterprise</span>
                {/* Never use verify-amber for billing */}
                <Badge variant="default">Active</Badge>
            </div>
        </div>

        <div className="bg-bg-elevated border border-border-default rounded-xl p-6">
            <h3 className="text-xl font-medium mb-4">Recent Transactions</h3>
            <table className="w-full text-sm text-left">
                <thead className="border-b border-border-default text-text-secondary">
                    <tr>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium">Amount</th>
                        <th className="pb-2 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                    {/* Mock static data representing feeLedgerEntries */}
                    <tr className="h-10">
                        <td>cohort_search_fee</td>
                        <td>$50.00</td>
                        <td><Badge variant="default">Settled</Badge></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
