import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '@chorus/ui/src/tokens/colors.css' // We might need to ensure this is properly imported or define a local globals.css

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
  title: 'Chorus Developer Documentation',
  description: 'Developer documentation for the Chorus Protocol.',
}

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  // apps/docs is a developer portal, typically light or dark. Let's make it dark for now as it's a placeholder.
  return (
    <html lang="en" className={`dark ${fontSans.variable} ${fontMono.variable}`}>
      <body className="bg-surface text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  )
}
