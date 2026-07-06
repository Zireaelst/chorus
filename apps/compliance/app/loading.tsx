export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 w-full h-full animate-pulse bg-[var(--color-canvas)]">
      <div className="flex flex-col w-full max-w-md space-y-4 p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border-hairline)] shadow-sm">
        <div className="w-12 h-12 bg-[var(--color-border-hairline)] rounded-[var(--radius-pill)]"></div>
        <div className="h-4 bg-[var(--color-border-hairline)] rounded-[var(--radius-base)] w-2/3"></div>
        <div className="h-4 bg-[var(--color-border-hairline)] rounded-[var(--radius-base)] w-1/2"></div>
      </div>
    </div>
  );
}
