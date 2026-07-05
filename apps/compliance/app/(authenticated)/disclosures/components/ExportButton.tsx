'use client';

import * as React from 'react';
import { Button } from '@chorus/ui';

export function ExportButton() {
  return (
    <Button 
      className="print:hidden border border-border-hairline bg-surface hover:bg-surface-sunken text-text-primary px-4 py-2" 
      onClick={() => window.print()}
    >
      Export
    </Button>
  );
}
