import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Users, Activity, TerminalSquare, Settings, UserCircle, LogOut } from 'lucide-react';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- DEVELOPMENT UI BYPASS ---
  // Bypassing real auth check so you can view the dashboard UI without running the backend API.
  /*
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
  */
  // --- END BYPASS ---

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[var(--color-surface-sunken)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--color-surface)] border-r border-[var(--color-border-hairline)] flex flex-col transition-all duration-[var(--dur-base)]">
        <div className="p-6 pb-2">
          <h1 className="text-xl font-bold font-display text-[var(--color-text-primary)] tracking-tight">Chorus Dashboard</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <a href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-primary)] bg-[var(--color-border-hairline)] transition-all duration-[var(--dur-fast)]">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </a>
          <a href="/cohorts" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border-hairline)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--dur-fast)]">
            <Users className="w-4 h-4" />
            Consortiums
          </a>
          <a href="/contributions" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border-hairline)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--dur-fast)]">
            <Activity className="w-4 h-4" />
            Cryptographic Ledger
          </a>
          <a href="/developer" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border-hairline)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--dur-fast)]">
            <TerminalSquare className="w-4 h-4" />
            Developer Portal
          </a>
          
          <div className="pt-6 mt-2">
            <p className="px-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 opacity-80">Organization</p>
            <div className="space-y-1">
              <a href="/org/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border-hairline)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--dur-fast)]">
                <Settings className="w-4 h-4" />
                Settings
              </a>
              <a href="/org/members" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border-hairline)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--dur-fast)]">
                <UserCircle className="w-4 h-4" />
                Members
              </a>
            </div>
          </div>
        </nav>
        
        <div className="p-4 border-t border-[var(--color-border-hairline)]">
          <form action="/auth/logout" method="POST">
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border-hairline)] hover:text-[var(--color-status-error)] transition-all duration-[var(--dur-fast)]">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[var(--color-canvas)]">
        {children}
      </main>
    </div>
  );
}
