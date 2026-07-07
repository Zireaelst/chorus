'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Button,
  Input,
} from '@chorus/ui';
import { Plus, Bot, ShieldCheck } from 'lucide-react';

export function CreateCohortModal() {
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setOpen(false);
      setDescription('');
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button intent="primary">
          <Plus className="w-4 h-4 mr-2" />
          New Consortium
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Consortium</DialogTitle>
          <DialogDescription>
            Use the AI Compliance Copilot to define your patient cohort. 
            The copilot will automatically flag required regulatory disclosures.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-3">
            <label htmlFor="name" className="text-sm font-medium text-text-primary">
              Consortium Name
            </label>
            <Input id="name" placeholder="e.g. Rare Disease Consortium B" required />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium text-text-primary flex items-center gap-2">
                <Bot className="w-4 h-4 text-accent-brand" />
                AI Copilot: Plain-language Description
              </label>
            </div>
            <textarea 
              id="description" 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full flex rounded-md border border-border-strong bg-surface px-3 py-2 text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus disabled:cursor-not-allowed disabled:opacity-50 text-text-primary"
              placeholder="Describe the clinical parameters. E.g. 'Patients over 45 with Type 2 Diabetes diagnosed in the last 5 years...'" 
              required
            />
          </div>

          {/* AI Compliance Analysis Mock */}
          {description.length > 10 && (
            <div className="p-4 rounded-lg bg-status-success/5 border border-status-success/20 space-y-3 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-status-success">
                <ShieldCheck className="w-4 h-4" />
                Copilot Analysis Complete
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="mt-1 accent-status-success" />
                  <div className="text-xs">
                    <span className="font-medium text-text-primary">HIPAA Safe Harbor</span>
                    <p className="text-text-secondary mt-0.5">Auto-redact 18 identifiers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="mt-1 accent-status-success" />
                  <div className="text-xs">
                    <span className="font-medium text-text-primary">GDPR Art. 89</span>
                    <p className="text-text-secondary mt-0.5">Scientific research exemption</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="mt-1 accent-status-success" />
                  <div className="text-xs">
                    <span className="font-medium text-text-primary">EHDS Compliant</span>
                    <p className="text-text-secondary mt-0.5">Anonymized secondary use</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-8 pt-4 border-t border-border-hairline">
            <Button type="button" intent="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" intent="primary">
              Initialize Consortium
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
