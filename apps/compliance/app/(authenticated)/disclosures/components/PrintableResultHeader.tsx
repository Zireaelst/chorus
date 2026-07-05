import * as React from 'react';

interface PrintableResultHeaderProps {
  cohortId: string;
  dateFrom: string;
  dateTo: string;
}

export function PrintableResultHeader({ cohortId, dateFrom, dateTo }: PrintableResultHeaderProps) {
  const generatedAt = new Date().toISOString();

  return (
    <div className="hidden print:block mb-8 pb-4 border-b border-black">
      <h1 className="text-2xl font-bold mb-4">Disclosure Query Report</h1>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold block mb-1">Query Scope:</span>
          <ul className="list-disc list-inside">
            <li>
              Cohort ID: <span className="font-mono">{cohortId || 'Any'}</span>
            </li>
            <li>
              Date From: <span className="font-mono">{dateFrom || 'Any'}</span>
            </li>
            <li>
              Date To: <span className="font-mono">{dateTo || 'Any'}</span>
            </li>
          </ul>
        </div>
        
        <div className="text-right">
          <span className="font-semibold block mb-1">Generated At:</span>
          <span className="font-mono">{generatedAt}</span>
        </div>
      </div>
    </div>
  );
}
