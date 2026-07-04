import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // In a real environment, this makes a fetch to `services/api` on port 4000.
    // For local prototype, we assume it's running locally on localhost:4000
    const res = await fetch('http://127.0.0.1:4000/v1/auth/session/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        clientId: process.env.WORKOS_CLIENT_ID || 'mock_client_id',
      }),
    });

    if (!res.ok) {
      throw new Error('Exchange failed');
    }

    // Since services/api returns `Set-Cookie`, we could pipe it back,
    // or proxy it. Since `services/api` directly sets the cookie, it's easier 
    // if the frontend proxies the set-cookie header.
    const data = await res.json();
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Pass along set-cookie headers from API
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }
    
    return response;
  } catch (error) {
    console.error('Auth callback error', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
