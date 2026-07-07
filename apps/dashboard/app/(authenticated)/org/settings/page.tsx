'use client';

import * as React from 'react';
import { Settings, Save, ShieldAlert, Cpu } from 'lucide-react';
import { Button, Input, Badge } from '@chorus/ui';

export default function OrgSettingsPage() {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="flex flex-col min-h-full">
      <header className="px-8 py-8 border-b border-border-hairline bg-canvas">
        <div className="flex items-center gap-3">
          <Cpu className="w-8 h-8 text-text-primary" />
          <div>
            <h2 className="text-3xl font-bold font-display tracking-tight text-text-primary">Zero-Knowledge Node Settings</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Configure your local cryptographic verifier node and on-chain settlement details.
            </p>
          </div>
        </div>
      </header>
      
      <div className="flex-1 p-8 bg-canvas">
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8 bg-surface p-8 border border-border-hairline rounded-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary border-b border-border-hairline pb-2">Network Configuration</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Organization Name</label>
                <Input defaultValue="Global Health Biobank" />
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
                  <span>Midnight Wallet Address <Badge intent="default" className="ml-2 font-mono bg-border-hairline/50">Settlement Address</Badge></span>
                  <span className="text-xs text-text-secondary font-normal">This address automatically receives compensation (e.g., USDC) whenever your data is verified.</span>
                </label>
                <Input defaultValue="0x8f2a...3b9c" className="font-mono text-text-primary" />
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
                  <span>ZK Verifier Node Endpoint</span>
                  <span className="text-xs text-text-secondary font-normal">Local URL of the node generating proofs inside your secure perimeter.</span>
                </label>
                <Input defaultValue="http://10.0.0.42:8080/v1/verify" className="font-mono text-text-secondary" />
              </div>
            </div>

            <div className="bg-status-warning/10 border border-status-warning/20 rounded-md p-4 flex items-start gap-3 mt-8">
              <ShieldAlert className="w-5 h-5 text-status-warning mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-status-warning mb-1">Network Synchronization</p>
                <p className="text-status-warning/80">Changing your node endpoint may cause temporary interruptions in proof generation. Ensure your local node is running the latest version of the Chorus Core.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border-hairline flex justify-end">
              <Button type="submit" intent="primary" disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Syncing to Network...' : 'Save Configuration'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
