import { Button, Input, Badge, IconButton } from '@chorus/ui';
import { Copy, Trash2, Download, ExternalLink, Network } from 'lucide-react';

export default function DeveloperPortalPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-semibold text-text-primary">Developer Portal & SDK Integration</h1>
        <Badge intent="warning" className="flex items-center gap-1.5 font-mono">
          <Network className="w-3.5 h-3.5" />
          Midnight Testnet
        </Badge>
      </div>
      <p className="text-text-secondary mb-8">Manage API keys and webhooks for your local Chorus Zero-Knowledge Node.</p>
      
      <div className="flex gap-4 mb-12">
        <Button intent="secondary" className="flex items-center gap-2 bg-surface">
          <Download className="w-4 h-4" />
          Download Node Binaries
        </Button>
        <Button intent="secondary" className="flex items-center gap-2 bg-surface">
          <ExternalLink className="w-4 h-4" />
          View SDK Documentation
        </Button>
      </div>
      
      <div className="space-y-12">
        {/* API Keys Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-text-primary">Local Node API Keys</h2>
              <p className="text-sm text-text-secondary mt-1">Authenticate machine-to-machine integrations with your internal secure enclave.</p>
            </div>
            <Button intent="primary">Generate New Key</Button>
          </div>
          
          <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden bg-surface">
            <table className="w-full text-left">
              <thead className="bg-bg-subtle border-b border-border-default text-text-secondary text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Environment</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                <tr>
                  <td className="px-6 py-4 font-medium text-text-primary">Chorus Node Local</td>
                  <td className="px-6 py-4">
                    <Badge intent="success">Testnet</Badge>
                  </td>
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
            <div>
              <h2 className="text-xl font-medium text-text-primary">Settlement Webhooks</h2>
              <p className="text-sm text-text-secondary mt-1">Receive events from the Midnight network regarding proof verifications and token distributions.</p>
            </div>
            <Button intent="primary">Add Webhook</Button>
          </div>
          
          <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden bg-surface">
            <table className="w-full text-left">
              <thead className="bg-bg-subtle border-b border-border-default text-text-secondary text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">URL</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                <tr>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary">https://api.internal-hospital.org/chorus-webhook</div>
                    <div className="text-sm text-text-secondary font-mono mt-1">midnight.transaction.settled</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge intent="success">Active</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <IconButton intent="ghost" aria-label="Delete Webhook">
                      <Trash2 className="w-4 h-4 hover:text-text-danger transition-colors" />
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
