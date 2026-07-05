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
    // Unauthenticated access must redirect server-side with no client flash.
    redirect('/login');
  }

  try {
    // Verify session with the API
    const res = await fetch('http://127.0.0.1:4000/v1/auth/session', {
      headers: {
        cookie: `chorus_session=${sessionCookie.value}`,
      },
    });

    if (!res.ok) {
      redirect('/login');
    }

    const data = await res.json();
    const user = data.user;
    
    // Explicit server-side role check: regulators cannot access apps/dashboard
    const isRegulator = user?.memberships?.some((m: any) => m.role === 'regulator');
    if (isRegulator) {
      redirect('/login?error=unauthorized_role');
    }

    // We have a valid user, proceed to render children (authenticated dashboard)
  } catch (error) {
    // In case API is down, redirect to login or show error
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[var(--color-surface-sunken)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--color-surface)] border-r border-[var(--color-border-hairline)] flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold font-display text-text-primary">Chorus Dashboard</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a href="/cohorts" className="block px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary">Cohorts</a>
          <a href="/contributions" className="block px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary">Contributions</a>
          <a href="/developer" className="block px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary">Developer Portal</a>
          <div className="pt-4 mt-4 border-t border-[var(--color-border-hairline)]">
            <p className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Organization</p>
            <a href="/org/settings" className="block px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary">Settings</a>
            <a href="/org/members" className="block px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary">Members</a>
          </div>
        </nav>
        <div className="p-4 border-t border-[var(--color-border-hairline)]">
          <form action="/auth/logout" method="POST">
            <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-bg-default">
        {children}
      </main>
    </div>
  );
}
