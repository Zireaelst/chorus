import { redirect } from 'next/navigation';
import { Button, Input } from '@chorus/ui';

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    'use server';
    // Minimal mock for SSO redirect - redirects to our own callback endpoint for now, 
    // or to WorkOS authorization URL in a real implementation.
    // Given the task, we trigger WorkOS SSO redirect.
    // In our simplified MVP, we will simulate the SSO code redirect.
    redirect('/auth/callback?code=mock_workos_code');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      <div className="max-w-md w-full space-y-8 p-10 border border-[var(--color-border-hairline)] rounded-2xl bg-[var(--color-surface)] shadow-2xl relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent-verify)] via-[var(--color-accent-verify)]/50 to-transparent"></div>

        <div className="text-center relative z-10">
          <div className="mx-auto w-12 h-12 bg-[var(--color-border-hairline)] rounded-xl mb-6 flex items-center justify-center border border-[var(--color-border-default)]">
            <svg className="w-6 h-6 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--color-text-primary)]">
            Chorus ZK Node
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] font-medium">
            Local Proof Generation & Settlement Interface
          </p>
        </div>
        
        <form action={handleLogin} className="mt-8 space-y-6 relative z-10">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)] mb-1 block">Institutional Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@hospital.org"
                className="bg-[var(--color-surface-sunken)]"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full h-11 text-[15px] font-medium shadow-sm">
              Authenticate via SSO
            </Button>
            <p className="text-center text-xs text-[var(--color-text-secondary)] mt-4">
              Protected by Enterprise Single Sign-On
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
