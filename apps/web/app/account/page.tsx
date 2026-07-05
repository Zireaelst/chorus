import * as React from 'react'
import { Input, Button } from '@chorus/ui'

export default function GeneralSettingsPage() {
  return (
    <>
      {/* Profile Section */}
      <section className="flex flex-col gap-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
        <div>
          <h3 className="text-lg font-medium text-white">Profile Information</h3>
          <p className="text-sm text-white/50 mt-1">Update your account details and hospital affiliation.</p>
        </div>

        <div className="w-full h-px bg-white/10" />

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80 ml-1">First Name</label>
              <Input type="text" defaultValue="John" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80 ml-1">Last Name</label>
              <Input type="text" defaultValue="Doe" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80 ml-1">Hospital / Organization</label>
            <Input type="text" defaultValue="General Healthcare Institute" />
          </div>

          <div className="flex justify-end mt-2">
            <Button variant="primary">
              Save Changes
            </Button>
          </div>
        </div>
      </section>

      {/* Connected Nodes Section */}
      <section className="flex flex-col gap-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
        <div>
          <h3 className="text-lg font-medium text-white">Network Nodes</h3>
          <p className="text-sm text-white/50 mt-1">Manage your zero-knowledge validator nodes.</p>
        </div>

        <div className="w-full h-px bg-white/10" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_10px_var(--color-status-success)]" />
              <div>
                <div className="text-sm font-medium text-white">Node-Alpha-77X</div>
                <div className="text-xs text-white/50 font-mono mt-0.5">0x8f2a...3b9c</div>
              </div>
            </div>
            <button className="text-sm text-white/60 hover:text-white transition-colors border border-white/10 rounded-lg px-4 py-1.5 hover:bg-white/5">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-status-error shadow-[0_0_10px_var(--color-status-error)]" />
              <div>
                <div className="text-sm font-medium text-white">Node-Beta-12Y</div>
                <div className="text-xs text-white/50 font-mono mt-0.5">0x1b4c...9d2e</div>
              </div>
            </div>
            <button className="text-sm text-white/60 hover:text-white transition-colors border border-white/10 rounded-lg px-4 py-1.5 hover:bg-white/5">
              Reconnect
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
