'use client';

import * as React from 'react';
import { Users, MailPlus, MoreHorizontal } from 'lucide-react';
import { Button, Input, Badge, IconButton } from '@chorus/ui';
import { mockMembers } from '@/lib/mock-data';

export default function OrgMembersPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="px-8 py-8 border-b border-border-hairline bg-canvas">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-text-primary" />
            <div>
              <h2 className="text-3xl font-bold font-display tracking-tight text-text-primary">Team Members</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Manage who has access to your organization's dashboard.
              </p>
            </div>
          </div>
          <div>
            <Button intent="primary">
              <MailPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 p-8 bg-canvas">
        <div className="border border-border-hairline rounded-lg overflow-hidden bg-surface">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border-hairline">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Member</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-medium text-text-secondary uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {mockMembers.map((member) => (
                <tr key={member.id} className="hover:bg-border-hairline/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-text-primary font-medium">{member.name}</div>
                    <div className="text-text-secondary text-xs mt-0.5">{member.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-text-primary">{member.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      intent={member.status === 'active' ? 'success' : 'warning'} 
                    >
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <IconButton intent="ghost" size="sm" aria-label="Manage member">
                      <MoreHorizontal className="w-4 h-4" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
