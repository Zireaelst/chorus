import { Button, Input, IconButton } from '@chorus/ui';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CohortBuilderPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Cohort Criteria Builder</h1>
          <p className="text-text-secondary">Draft mode — not yet submitted for circuit generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cohorts">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button variant="primary">Save as Draft</Button>
        </div>
      </div>
      
      <div className="space-y-8">
        <section className="bg-bg-elevated border border-border-default rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Clinical Criteria</h2>
            <Button variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Field
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Mock Criterion Row */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="sr-only">Field</label>
                <Input defaultValue="ICD10" />
              </div>
              <div className="w-32">
                <label className="sr-only">Operator</label>
                <select className="w-full h-10 px-3 bg-bg-default border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-transparent">
                  <option value="eq">Equals</option>
                  <option value="neq">Not Equals</option>
                  <option value="in">In List</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="sr-only">Value</label>
                <Input defaultValue="E11.9" />
              </div>
              <IconButton aria-label="Remove row">
                <Trash2 className="w-4 h-4 text-text-muted" />
              </IconButton>
            </div>
          </div>
        </section>

        <section className="bg-bg-elevated border border-border-default rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Demographic Criteria</h2>
            <Button variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Field
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Mock Criterion Row */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="sr-only">Field</label>
                <select className="w-full h-10 px-3 bg-bg-default border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-transparent">
                  <option value="age">Age</option>
                  <option value="biological_sex">Biological Sex</option>
                </select>
              </div>
              <div className="w-32">
                <label className="sr-only">Operator</label>
                <select className="w-full h-10 px-3 bg-bg-default border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-transparent">
                  <option value="gte">Greater or eq</option>
                  <option value="lte">Less or eq</option>
                  <option value="between">Between</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="sr-only">Value</label>
                <Input defaultValue="18" type="number" />
              </div>
              <IconButton aria-label="Remove row">
                <Trash2 className="w-4 h-4 text-text-muted" />
              </IconButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
