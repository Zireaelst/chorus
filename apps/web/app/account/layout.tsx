'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Navbar } from '../components/Navbar'

const navItems = [
  { name: 'General', path: '/account' },
  { name: 'Security', path: '/account/security' },
  { name: 'API Keys', path: '/account/api-keys' },
  { name: 'Team & Billing', path: '/account/team' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="relative min-h-screen w-full bg-canvas flex flex-col">
      <Navbar />

      {/* Elegant Background Setup */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent-verify/10 rounded-full blur-[150px] opacity-40 mix-blend-screen pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto pt-32 px-8 flex-1 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          <h2 className="text-xl font-medium text-white mb-6">Settings</h2>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link key={item.name} href={item.path}>
                  <div className={`text-left px-4 py-2.5 rounded-lg font-medium border transition-all ${
                    isActive 
                      ? 'bg-white/10 text-white border-white/5' 
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5 border-transparent'
                  }`}>
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col gap-8 pb-32">
          {children}
        </main>
      </div>

    </div>
  )
}
