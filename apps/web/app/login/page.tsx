import * as React from 'react'
import { Input, Button } from '@chorus/ui'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-canvas flex items-center justify-center overflow-hidden">
      
      {/* Aceternity Style Animated Spotlight / Glow Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute w-[60vw] h-[60vw] bg-accent-verify/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute w-[40vw] h-[40vw] bg-white/10 rounded-full blur-[100px] opacity-40 mix-blend-overlay" />
      </div>

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-12 bg-black/40 border border-white/10 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col gap-8">
        
        <div className="flex flex-col items-center text-center gap-2">
          <svg width="32" height="36" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
            <path d="M8 0.5L15 4.5V13.5L8 17.5L1 13.5V4.5L8 0.5Z" stroke="white" strokeWidth="1.2"/>
          </svg>
          <h1 className="text-2xl font-medium text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-white/50">Enter your credentials to access the network</p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80 ml-1">Email address</label>
            <Input 
              type="email" 
              placeholder="you@hospital.org"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-white/80">Password</label>
              <a href="#" className="text-xs text-accent-verify hover:underline transition-all">Forgot?</a>
            </div>
            <Input 
              type="password" 
              placeholder="••••••••"
            />
          </div>

          <Button type="button" intent="primary" className="mt-4">
            Sign In
          </Button>
        </form>

        <div className="text-center mt-2">
          <p className="text-sm text-white/50">
            Don&apos;t have an account? <a href="/apply" className="text-white hover:underline transition-all">Apply for access</a>
          </p>
        </div>

      </div>
    </div>
  )
}
