import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

// DESIGN_SYSTEM.md: "ship with Inter as an interim substitute for Suisse Int'l until that
// license is purchased — the two are metrically close enough that layouts won't need rework."
// DESIGN_SYSTEM.md: JetBrains Mono for "any measured value: timestamps, hashes, proof IDs, currency"
// FRONTEND_GUIDELINES.md: "Fonts load with next/font and font-display: swap; no render-blocking"
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
  title: 'Chorus — Prove your hospital\'s data is eligible. Without showing anyone what it says.',
  description:
    'Chorus is the verification and settlement layer for confidential healthcare AI. Hospitals and biobanks train rare-disease and precision-medicine models together without raw patient data ever leaving their infrastructure.',
  // Open Graph populated with real content at v0.2
  openGraph: {
    title: 'Chorus Protocol',
    description: 'Verifiable, compensated, auditable healthcare AI collaboration.',
    type: 'website',
  },
}

import { LenisProvider } from './lib/lenis-provider'
import { Navbar } from './components/Navbar'

// apps/web root layout
// DESIGN_SYSTEM.md: "apps/web is dark-first with no user-facing toggle — it hardcodes
// className='dark' at the root with no cookie read and no toggle, since it has no light mode."
export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    // className="dark" hardcoded — no cookie, no toggle, this app is dark-only
    <html lang="en" className={`dark ${fontSans.variable} ${fontMono.variable}`}>
      <body>
        <Navbar />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
