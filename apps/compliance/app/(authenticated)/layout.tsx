import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('chorus_session');

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const res = await fetch('http://127.0.0.1:4000/v1/auth/session', {
      headers: {
        cookie: `chorus_session=${sessionCookie.value}`,
      },
    });

    if (!res.ok) {
      redirect('/login');
    }

    const { user } = await res.json();
    
    // Explicit server-side role check: only regulators can access apps/compliance
    const isRegulator = user.memberships.some((m: any) => m.role === 'regulator');
    if (!isRegulator) {
      // Reject any other role
      redirect('/login?error=unauthorized_role');
    }

  } catch (error) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface-sunken)]">
      {/* Top Header */}
      <header className="w-full bg-[var(--color-surface)] border-b border-[var(--color-border-hairline)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold font-display text-text-primary">Chorus Compliance Portal</h1>
        <form action="/auth/logout" method="POST">
          <button className="text-sm font-medium text-text-secondary hover:text-text-primary">
            Sign Out
          </button>
        </form>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-bg-default p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
