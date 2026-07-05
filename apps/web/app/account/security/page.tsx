import * as React from 'react'

export default function SecuritySettingsPage() {
  return (
    <section className="flex flex-col gap-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
      <div>
        <h3 className="text-lg font-medium text-white">Security & Authentication</h3>
        <p className="text-sm text-white/50 mt-1">Manage your passwords, two-factor authentication, and active sessions.</p>
      </div>

      <div className="w-full h-px bg-white/10" />

      {/* 2FA Section */}
      <div className="flex items-center justify-between py-4">
        <div>
          <div className="text-base font-medium text-white">Two-Factor Authentication</div>
          <div className="text-sm text-white/50 mt-1">Add an extra layer of security to your account using an authenticator app.</div>
        </div>
        <button className="bg-white text-black text-sm font-medium rounded-xl px-5 py-2 hover:bg-neutral-200 transition-colors">
          Enable 2FA
        </button>
      </div>

      <div className="w-full h-px bg-white/10" />

      {/* Password Section */}
      <div className="flex flex-col gap-4 py-2">
        <div className="text-base font-medium text-white">Change Password</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80 ml-1">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80 ml-1">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors" />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button className="bg-white/10 text-white text-sm font-medium rounded-xl px-6 py-2.5 hover:bg-white/20 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-white/10" />

      {/* Active Sessions */}
      <div className="flex flex-col gap-4 py-2">
        <div className="text-base font-medium text-white">Active Sessions</div>
        
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/50">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 21h8m-4-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-white flex items-center gap-2">
                Mac OS • Chrome
                <span className="text-[10px] uppercase tracking-wider text-status-success bg-status-success/10 px-2 py-0.5 rounded-md">Current</span>
              </div>
              <div className="text-xs text-white/50 mt-0.5">Istanbul, TR • 192.168.1.42</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button className="text-sm text-status-error hover:text-red-400 font-medium transition-colors">
            Sign out of all other sessions
          </button>
        </div>
      </div>

    </section>
  )
}
