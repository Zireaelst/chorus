import { Button, Input, Badge, IconButton } from '@chorus/ui';
import { Copy, Trash2 } from 'lucide-react';

export default function DeveloperPortalPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-2">Developer Portal</h1>
      <p className="text-text-secondary mb-8">Manage API keys and webhooks for machine-to-machine integrations.</p>
      
      <div className="space-y-12">
        {/* API Keys Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">API Keys</h2>
            <Button intent="primary">Generate New Key</Button>
          </div>
          
          <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-bg-subtle border-b border-border-default text-text-secondary text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {/* Mock Data */}
                <tr>
                  <td className="px-6 py-4 font-medium text-text-primary">Chorus Node Prod</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">2026-06-01</td>
                  <td className="px-6 py-4 text-right">
                    <Button intent="secondary" className="text-text-danger border-text-danger hover:bg-text-danger/10">Revoke</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Webhooks Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Webhooks</h2>
            <Button intent="primary">Add Webhook</Button>
          </div>
          
          <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-bg-subtle border-b border-border-default text-text-secondary text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">URL</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {/* Mock Data */}
                <tr>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary">https://api.example.com/chorus-webhook</div>
                    <div className="text-sm text-text-secondary mt-1">Events: payout.settled</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge intent="success">Active</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <IconButton aria-label="Delete Webhook">
                      <Trash2 className="w-4 h-4 text-text-muted hover:text-text-danger transition-colors" />
                    </IconButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
