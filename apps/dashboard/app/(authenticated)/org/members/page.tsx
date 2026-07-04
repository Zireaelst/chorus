import { Button, Input, Badge } from '@chorus/ui';

export default function OrgMembersPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Members</h1>
        <Button variant="primary">Invite Member</Button>
      </div>
      
      <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-bg-subtle border-b border-border-default text-text-secondary text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {/* Mock Data */}
            <tr>
              <td className="px-6 py-4">
                <div className="font-medium text-text-primary">Alice Admin</div>
                <div className="text-sm text-text-secondary">alice@example.com</div>
              </td>
              <td className="px-6 py-4">
                <Badge variant="neutral">Hospital Admin</Badge>
              </td>
              <td className="px-6 py-4">
                <Badge variant="success">Active</Badge>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4">
                <div className="font-medium text-text-primary">Bob Clinician</div>
                <div className="text-sm text-text-secondary">bob@example.com</div>
              </td>
              <td className="px-6 py-4">
                <Badge variant="neutral">Clinician</Badge>
              </td>
              <td className="px-6 py-4">
                <Badge variant="neutral">Pending</Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
