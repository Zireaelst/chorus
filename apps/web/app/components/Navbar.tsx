import * as React from 'react'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="absolute z-50 top-8 left-0 right-0 px-8 flex items-center justify-between">
      {/* Left Pill */}
      <Link href="/">
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl px-6 py-3 cursor-pointer hover:bg-black/60 transition-colors">
          <svg width="20" height="22" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0.5L15 4.5V13.5L8 17.5L1 13.5V4.5L8 0.5Z" stroke="white" strokeWidth="1.2"/>
          </svg>
          <span className="text-text-primary text-[15px] font-medium tracking-tight">chorus protocol</span>
        </div>
      </Link>

      {/* Center Nav Links */}
      <div className="hidden md:flex items-center gap-8 bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl px-8 py-3">
        <Link href="/features" className="text-text-secondary hover:text-text-primary transition-colors text-[15px] font-medium">features</Link>
        <Link href="/network" className="text-text-secondary hover:text-text-primary transition-colors text-[15px] font-medium">network</Link>
        <Link href="/use-cases" className="text-text-secondary hover:text-text-primary transition-colors text-[15px] font-medium">use cases</Link>
        <Link href="/company" className="text-text-secondary hover:text-text-primary transition-colors text-[15px] font-medium">company</Link>
        <Link href="/docs" className="text-text-secondary hover:text-text-primary transition-colors text-[15px] font-medium">docs</Link>
      </div>

      {/* Right Button */}
      <Link href="/login">
        <button className="bg-text-primary text-canvas text-[15px] font-medium rounded-2xl px-8 py-3 hover:bg-neutral-200 transition-colors">
          apply
        </button>
      </Link>
    </nav>
  )
}
