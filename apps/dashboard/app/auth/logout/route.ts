import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get('chorus_session');
  
  if (sessionCookie) {
    try {
      await fetch('http://127.0.0.1:4000/v1/auth/session/revoke', {
        method: 'POST',
        headers: {
          cookie: `chorus_session=${sessionCookie.value}`,
        },
      });
    } catch (error) {
      // Ignore API errors on logout
    }
  }

  const response = NextResponse.redirect(new URL('/login', request.url));
  // Clear the cookie client side too
  response.cookies.delete('chorus_session');
  
  return response;
}
