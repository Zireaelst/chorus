import * as React from 'react'

export default function ApiKeysPage() {
  return (
    <section className="flex flex-col gap-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">API Keys</h3>
          <p className="text-sm text-white/50 mt-1">Manage secret keys for programmatic access to the Chorus Protocol.</p>
        </div>
        <button className="bg-white text-black text-sm font-medium rounded-xl px-5 py-2 hover:bg-neutral-200 transition-colors">
          Create New Key
        </button>
      </div>

      <div className="w-full h-px bg-white/10" />

      <div className="flex flex-col gap-4">
        {/* Active Key */}
        <div className="flex flex-col gap-3 p-5 rounded-xl border border-white/5 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">Production Enclave Key</span>
              <span className="text-[10px] uppercase tracking-wider text-status-success bg-status-success/10 px-2 py-0.5 rounded-md border border-status-success/20">Active</span>
            </div>
            <button className="text-xs text-white/40 hover:text-white transition-colors">Revoke</button>
          </div>
          
          <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-lg p-3">
            <code className="text-sm font-mono text-white/70">chorus_prod_8f2a1b9c...</code>
            <button className="text-white/40 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="text-xs text-white/40">Created on Jul 4, 2026 • Last used 2 hours ago</div>
        </div>

        {/* Revoked Key */}
        <div className="flex flex-col gap-3 p-5 rounded-xl border border-white/5 bg-white/5 opacity-50 grayscale">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">Testnet Legacy Key</span>
              <span className="text-[10px] uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded-md border border-white/20">Revoked</span>
            </div>
          </div>
          <div className="text-xs text-white/40">Created on Jun 12, 2026 • Revoked on Jul 1, 2026</div>
        </div>

      </div>
    </section>
  )
}
