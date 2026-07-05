import * as React from 'react'
import { apiClient } from '../lib/api-client'
import { Badge } from '@chorus/ui'

// Mock fetching the requests directly from the server component
async function getRecentRequests() {
  try {
    // In actual use, this needs the cookie forwarded by the apiClient if SSR.
    // For MVP, we simulate a successful fetch if the backend is up.
    // const res = await apiClient('/sponsor/access-requests')
    // return res.items
    
    // Fallback to static if backend isn't running
    return [
      { id: '1', cohort: { title: 'Oncology Cohort E75.2' }, status: 'approved', createdAt: new Date().toISOString() },
      { id: '2', cohort: { title: 'Pediatric Rare Disease QRY-22' }, status: 'pending', createdAt: new Date().toISOString() }
    ]
  } catch (error) {
    return []
  }
}

export default async function DashboardOverviewPage() {
  const requests = await getRecentRequests()

  return (
    <>
      <div>
        <h3 className="text-2xl font-medium text-white">Overview</h3>
        <p className="text-sm text-white/50 mt-1">Monitor your network queries and overall discovery metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
          <div className="text-sm font-medium text-white/60 mb-2">Total Connected Nodes</div>
          <div className="text-3xl font-medium text-white flex items-baseline gap-2">
            34 <span className="text-sm text-status-success font-normal">+2 this week</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
          <div className="text-sm font-medium text-white/60 mb-2">Total Patients Searchable</div>
          <div className="text-3xl font-medium text-white flex items-baseline gap-2">
            1.2M <span className="text-sm text-status-success font-normal">growing</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
          <div className="text-sm font-medium text-white/60 mb-2">Active Requests</div>
          <div className="text-3xl font-medium text-white flex items-baseline gap-2">
            {requests.filter((r: any) => r.status === 'pending').length} <span className="text-sm text-white/40 font-normal">pending</span>
          </div>
        </div>
      </div>

      {/* Recent Queries List */}
      <section className="flex flex-col gap-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md mt-4">
        <div>
          <h3 className="text-lg font-medium text-white">Recent Access Requests</h3>
        </div>

        <div className="w-full h-px bg-white/10" />

        <div className="flex flex-col gap-4">
          {requests.map((req: any) => (
             <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
             <div className="flex flex-col gap-1">
               <div className="text-sm font-medium text-white flex items-center gap-3">
                 {req.cohort?.title || 'Unknown Cohort'}
                 {req.status === 'approved' && (
                   <Badge intent="success">Approved</Badge>
                 )}
                 {req.status === 'pending' && (
                   <Badge intent="warning">Pending</Badge>
                 )}
               </div>
               <div className="text-xs text-white/50">Requested: {new Date(req.createdAt).toLocaleDateString()}</div>
             </div>
             <button className="text-sm text-white/60 hover:text-white transition-colors border border-white/10 rounded-lg px-4 py-1.5 hover:bg-white/5">
               View Details
             </button>
           </div>
          ))}
          {requests.length === 0 && (
            <div className="text-sm text-white/50">No recent requests.</div>
          )}
        </div>
      </section>
    </>
  )
}
