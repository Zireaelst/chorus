import * as React from 'react'

export default function BillingPage() {
  return (
    <section className="flex flex-col gap-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Query Billing & Tokens</h3>
          <p className="text-sm text-white/50 mt-1">Manage your CHR token balance used to incentivize hospitals for query execution.</p>
        </div>
        <button className="bg-white text-black text-sm font-medium rounded-xl px-5 py-2 hover:bg-neutral-200 transition-colors">
          Purchase Tokens
        </button>
      </div>

      <div className="w-full h-px bg-white/10" />

      {/* Balance Card */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent border border-white/10">
        <div className="text-sm text-white/60">Available Balance</div>
        <div className="text-4xl font-medium text-white flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-verify">
            <path d="M12 2L22 7.77778V16.2222L12 22L2 16.2222V7.77778L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          1,450.00 CHR
        </div>
        <div className="text-xs text-white/40">≈ $1,450.00 USD</div>
      </div>

      <div className="w-full h-px bg-white/10 my-2" />

      {/* Transaction History */}
      <div>
        <h4 className="text-base font-medium text-white mb-4">Recent Transactions</h4>
        
        <div className="flex flex-col gap-2">
          {/* Transaction 1 */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Query Execution: QRY-22</div>
                <div className="text-xs text-white/50 mt-0.5">Jul 5, 2026 • Broadcast to 34 nodes</div>
              </div>
            </div>
            <div className="text-sm font-medium text-status-error">-8.50 CHR</div>
          </div>

          {/* Transaction 2 */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Token Purchase (Stripe)</div>
                <div className="text-xs text-white/50 mt-0.5">Jul 1, 2026 • Invoice #INV-001</div>
              </div>
            </div>
            <div className="text-sm font-medium text-status-success">+500.00 CHR</div>
          </div>

          {/* Transaction 3 */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Query Execution: QRY-19</div>
                <div className="text-xs text-white/50 mt-0.5">Jun 28, 2026 • Broadcast to 12 nodes</div>
              </div>
            </div>
            <div className="text-sm font-medium text-status-error">-3.00 CHR</div>
          </div>

        </div>
      </div>
    </section>
  )
}
