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

    // We have a valid user, proceed to render children (authenticated dashboard)
  } catch (error) {
    // In case API is down, redirect to login or show error
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 border-b border-[var(--color-border-hairline)] bg-[var(--color-surface)]">
        <h1 className="text-xl font-bold font-display">Chorus Dashboard</h1>
        <nav>
          {/* Mock logout button */}
          <form action="/auth/logout" method="POST">
            <button className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              Sign Out
            </button>
          </form>
        </nav>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
