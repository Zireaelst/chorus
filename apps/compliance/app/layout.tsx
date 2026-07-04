import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const fontMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  // FRONTEND_GUIDELINES.md: "apps/compliance targets AA+ given its regulator/auditor audience"
  title: 'Chorus Compliance Portal — Regulatory Disclosure Interface',
  description: 'Read-only, scoped disclosure query interface for regulators and auditors.',
  // SECURITY_MODEL.md: not indexed — not a public-facing surface
  robots: { index: false, follow: false },
}

// SECURITY_MODEL.md: regulator role can ONLY reach apps/compliance.
// This is enforced at the routing layer (middleware) in v0.3+.
// Sprint 0: layout scaffold only.
export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('chorus-theme')?.value ?? 'light'
  return (
    <html lang="en" className={`${theme === 'dark' ? 'dark' : ''} ${fontSans.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
