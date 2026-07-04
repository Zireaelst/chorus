import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

// DESIGN_SYSTEM.md: "Theme preference is stored in a cookie, not localStorage.
// Next.js App Router Server Components can read a cookie during server rendering
// and emit the correct class='dark' on <html> before the first paint."
// Cookie-based approach prevents the flash-of-wrong-theme that localStorage causes.

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Chorus Dashboard',
  description: 'Hospital and biobank operator dashboard — cohort management and contribution tracking.',
  // Robots: no indexing for product apps
  robots: { index: false, follow: false },
}

// Dashboard root layout — Server Component (no 'use client')
// FRONTEND_GUIDELINES.md: "a component is a Server Component unless it has a specific,
// nameable reason to be a Client Component"
// DESIGN_SYSTEM.md code example — verbatim implementation
export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  // Read theme cookie server-side — no client JS needed, no flash
  const cookieStore = await cookies()
  const theme = cookieStore.get('chorus-theme')?.value ?? 'light'

  return (
    <html
      lang="en"
      className={`${theme === 'dark' ? 'dark' : ''} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
