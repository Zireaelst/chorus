'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@chorus/ui';

export function QueryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Bounded set of predefined query parameters (never a free text field for arbitrary SQL)
  const defaultCohort = searchParams.get('cohortId') || '';
  const defaultDateFrom = searchParams.get('dateFrom') || '';
  const defaultDateTo = searchParams.get('dateTo') || '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cohortId = formData.get('cohortId') as string;
    const dateFrom = formData.get('dateFrom') as string;
    const dateTo = formData.get('dateTo') as string;

    const params = new URLSearchParams();
    if (cohortId) params.set('cohortId', cohortId);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);

    router.push(`/disclosures?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end bg-surface p-6 border border-border-hairline rounded-base shadow-panel print:hidden">
      <div className="flex-1 flex flex-col gap-2 w-full">
        <label htmlFor="cohortId" className="text-small font-medium text-text-primary">Cohort ID</label>
        <Input 
          id="cohortId"
          name="cohortId" 
          defaultValue={defaultCohort} 
          placeholder="e.g. uuid-format-id" 
          className="font-mono text-sm"
        />
      </div>

      <div className="flex-1 flex flex-col gap-2 w-full">
        <label htmlFor="dateFrom" className="text-small font-medium text-text-primary">Date From</label>
        <Input 
          type="date"
          id="dateFrom"
          name="dateFrom" 
          defaultValue={defaultDateFrom}
        />
      </div>

      <div className="flex-1 flex flex-col gap-2 w-full">
        <label htmlFor="dateTo" className="text-small font-medium text-text-primary">Date To</label>
        <Input 
          type="date"
          id="dateTo"
          name="dateTo" 
          defaultValue={defaultDateTo}
        />
      </div>

      <Button type="submit" className="w-full md:w-auto h-10 px-6">
        Query Disclosures
      </Button>
    </form>
  );
}
