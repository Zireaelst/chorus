import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import '../dashboard/app/globals.css'

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const fontMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Chorus Admin',
  description: 'Internal operations — institution onboarding, reputation, disputes.',
  robots: { index: false, follow: false },
}

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('chorus-theme')?.value ?? 'light'
  return (
    <html lang="en" className={`${theme === 'dark' ? 'dark' : ''} ${fontSans.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
