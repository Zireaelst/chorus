import { Badge, Button } from '@chorus/ui'

export default async function NotificationsPage() {
    // In a real implementation this calls the local API (or DB directly in SSR).
    // Simulating notifications for MVP UI.
    const mockNotifications = [
        { id: 'notif_1', type: 'proof_verified', payload: { round: 1 }, readAt: null, createdAt: '2026-07-04' },
        { id: 'notif_2', type: 'payout_settled', payload: { amount: 50 }, readAt: '2026-07-03', createdAt: '2026-07-03' },
        { id: 'notif_3', type: 'access_request_approved', payload: { cohortId: 'cohort_789' }, readAt: '2026-07-01', createdAt: '2026-07-01' }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground text-sm">
                    Recent system events and updates.
                </p>
            </div>

            <div className="border rounded-md" aria-live="polite">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Event Type</th>
                            <th className="px-4 py-3 font-medium">Details</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {mockNotifications.map((notif) => (
                            <tr key={notif.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3">
                                    {!notif.readAt && <Badge intent="default">New</Badge>}
                                </td>
                                <td className="px-4 py-3 font-medium">{notif.type}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {JSON.stringify(notif.payload)}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{notif.createdAt}</td>
                                <td className="px-4 py-3">
                                    {!notif.readAt && (
                                        <Button intent="secondary" size="sm">Mark Read</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
