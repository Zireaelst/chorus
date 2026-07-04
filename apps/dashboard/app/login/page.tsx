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
      <div className="max-w-md w-full space-y-8 p-8 border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold tracking-tight text-[var(--color-text-primary)]">
            Chorus Dashboard
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Sign in with your hospital or biobank account
          </p>
        </div>
        
        <form action={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Continue with SSO
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
