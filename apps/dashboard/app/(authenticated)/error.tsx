'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 rounded-[var(--radius-lg)] border border-[var(--color-status-error)] bg-[var(--color-surface)] text-[var(--color-status-error)]">
      <h2 className="text-lg font-display">Something went wrong</h2>
      <p className="text-sm font-sans text-[var(--color-text-secondary)]">We have been notified of the issue.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-[var(--color-status-error)] text-[var(--color-canvas)] rounded-[var(--radius-base)] hover:opacity-90 transition-opacity duration-[var(--dur-fast)]"
      >
        Try again
      </button>
    </div>
  );
}
