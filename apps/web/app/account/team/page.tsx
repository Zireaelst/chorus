import * as React from 'react'

export default function TeamPage() {
  return (
    <section className="flex flex-col gap-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Team & Permissions</h3>
          <p className="text-sm text-white/50 mt-1">Manage members of your organization and their access levels.</p>
        </div>
        <button className="bg-white text-black text-sm font-medium rounded-xl px-5 py-2 hover:bg-neutral-200 transition-colors">
          Invite Member
        </button>
      </div>

      <div className="w-full h-px bg-white/10" />

      <div className="flex flex-col gap-1">
        {/* Member 1 (Owner) */}
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-verify to-blue-500 flex items-center justify-center text-white font-medium text-sm">
              JD
            </div>
            <div>
              <div className="text-sm font-medium text-white">John Doe (You)</div>
              <div className="text-xs text-white/50 mt-0.5">john@hospital.org</div>
            </div>
          </div>
          <div className="text-sm text-white/40 px-3 py-1 rounded-lg bg-white/5">Owner</div>
        </div>

        {/* Member 2 */}
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium text-sm">
              AS
            </div>
            <div>
              <div className="text-sm font-medium text-white">Alice Smith</div>
              <div className="text-xs text-white/50 mt-0.5">alice@hospital.org</div>
            </div>
          </div>
          <select className="text-sm text-white/80 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-white/30">
            <option>Admin</option>
            <option>Developer</option>
            <option>Viewer</option>
          </select>
        </div>

      </div>

      <div className="w-full h-px bg-white/10 my-4" />

      <div>
        <h3 className="text-lg font-medium text-white mb-1">Billing & Subscription</h3>
        <p className="text-sm text-white/50 mb-6">Manage your payment methods and view past invoices.</p>

        <div className="p-5 rounded-xl border border-white/5 bg-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-white">Enterprise Node Plan</div>
            <div className="text-xs text-white/50 mt-1">Billed annually. Next invoice on Jul 4, 2027.</div>
          </div>
          <button className="text-sm bg-white/10 text-white font-medium rounded-lg px-4 py-2 hover:bg-white/20 transition-colors">
            Manage Billing
          </button>
        </div>
      </div>

    </section>
  )
}
