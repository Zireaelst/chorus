'use client';

import * as React from 'react';
import { Users, MoreHorizontal, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button, Input, Tabs, TabsList, TabsTrigger, Badge, IconButton } from '@chorus/ui';
import { mockCohorts, type Cohort } from '@/lib/mock-data';
import { CreateCohortModal } from '@/app/components/CreateCohortModal';

export default function CohortsPage() {
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  const filteredCohorts = mockCohorts.filter(cohort => {
    const matchesSearch = cohort.name.toLowerCase().includes(search.toLowerCase()) || 
                          cohort.description.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'healthy') return matchesSearch && cohort.status === 'healthy';
    if (activeTab === 'pending') return matchesSearch && cohort.status === 'pending';
    return matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-full">
      <header className="px-8 py-8 border-b border-border-hairline bg-canvas">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-text-primary" />
            <div>
              <h2 className="text-3xl font-bold font-display tracking-tight text-text-primary">Consortiums</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Manage your hospital's active data pools and verified model training.
              </p>
            </div>
          </div>
          <div>
            <CreateCohortModal />
          </div>
        </div>
      </header>
      
      <div className="flex-1 p-8 bg-canvas space-y-6">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-[400px]">
            <TabsList>
              <TabsTrigger value="all">All Consortiums</TabsTrigger>
              <TabsTrigger value="healthy">Healthy</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="w-72">
            <Input 
              placeholder="Search consortiums..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-border-hairline rounded-lg overflow-hidden bg-surface">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border-hairline">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Consortium</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs text-right">Eligible Patients</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs text-right">Proofs Submitted</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs text-right">Compensation</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filteredCohorts.map((cohort) => (
                <tr key={cohort.id} className="hover:bg-border-hairline/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-text-primary font-medium">{cohort.name}</div>
                    <div className="text-text-secondary text-xs mt-0.5">{cohort.description}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-text-primary">
                    {cohort.patientCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-text-primary">
                    {cohort.proofsSubmitted.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-text-primary">
                    {cohort.compensationEarned}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      intent={cohort.status === 'healthy' ? 'success' : cohort.status === 'error' ? 'error' : 'warning'} 
                    >
                      {cohort.status === 'healthy' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                      {cohort.status === 'pending' && <ShieldAlert className="w-3 h-3 mr-1 inline" />}
                      <span className="capitalize">{cohort.status}</span>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Button 
                      size="sm" 
                      onClick={async () => {
                        try {
                          const res = await fetch('http://localhost:4001/trigger-training', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ cohortId: cohort.id })
                          });
                          if (!res.ok) throw new Error('Failed to trigger training');
                          alert('Training triggered successfully!');
                        } catch (err: any) {
                          alert(`Error: ${err.message}`);
                        }
                      }}
                    >
                      Run Training
                    </Button>
                    <IconButton intent="ghost" size="sm" aria-label="More options">
                      <MoreHorizontal className="w-4 h-4" />
                    </IconButton>
                  </td>
                </tr>
              ))}
              {filteredCohorts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                    No consortiums found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
