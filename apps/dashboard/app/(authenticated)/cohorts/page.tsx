import { Button, Badge } from '@chorus/ui';
import Link from 'next/link';

export default function CohortsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Cohorts</h1>
        <Link href="/cohorts/new">
          <Button intent="primary">New Cohort Draft</Button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {/* Mock Data */}
        <div className="p-6 bg-bg-elevated border border-border-default rounded-xl flex items-center justify-between hover:border-border-hover transition-colors">
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-1">Type 2 Diabetes (Early Onset)</h3>
            <p className="text-sm text-text-secondary">Created 2 days ago</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge intent="default">Draft</Badge>
            <Link href="/cohorts/123">
              <Button intent="secondary">Edit Draft</Button>
            </Link>
          </div>
        </div>

        <div className="p-6 bg-bg-elevated border border-border-default rounded-xl flex items-center justify-between hover:border-border-hover transition-colors">
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-1">Hypertension Study Q3</h3>
            <p className="text-sm text-text-secondary">Submitted 1 week ago</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge intent="success">Active</Badge>
            <Button intent="secondary" disabled>View Details</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
