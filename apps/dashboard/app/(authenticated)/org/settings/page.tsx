import { Button, Input } from '@chorus/ui';

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
    </div>
  );
}
