import { Badge } from '@chorus/ui';
import Link from 'next/link';

export default async function DisputesPage({ searchParams }: { searchParams: { status?: string } }) {
    // In a real implementation, we fetch disputes from services/api over REST or Prisma directly
    // Simulating database output for Sprint 21 UI construction:
    const mockDisputes = [
        { id: '1', subjectType: 'access_request', subjectId: 'ar_1', status: 'open', description: 'Unauthorized scope requested', createdAt: '2026-07-05T10:00:00Z' },
        { id: '2', subjectType: 'contribution', subjectId: 'ct_1', status: 'under_review', description: 'Questionable dataset metrics', createdAt: '2026-07-04T12:00:00Z' },
        { id: '3', subjectType: 'payout', subjectId: 'py_1', status: 'resolved', description: 'Payment mismatched ledger', createdAt: '2026-07-03T09:00:00Z' },
    ];

    const currentStatus = searchParams.status;
    const filtered = currentStatus ? mockDisputes.filter(d => d.status === currentStatus) : mockDisputes;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dispute Resolution</h1>
                    <p className="text-muted-foreground text-sm">
                        Triage and manage disputes regarding contributions, access requests, and payouts.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <Link href="/disputes" className={`px-3 py-1 rounded-full text-sm border ${!currentStatus ? 'bg-secondary' : 'hover:bg-muted'}`}>All</Link>
                <Link href="/disputes?status=open" className={`px-3 py-1 rounded-full text-sm border ${currentStatus === 'open' ? 'bg-secondary' : 'hover:bg-muted'}`}>Open</Link>
                <Link href="/disputes?status=under_review" className={`px-3 py-1 rounded-full text-sm border ${currentStatus === 'under_review' ? 'bg-secondary' : 'hover:bg-muted'}`}>Under Review</Link>
                <Link href="/disputes?status=resolved" className={`px-3 py-1 rounded-full text-sm border ${currentStatus === 'resolved' ? 'bg-secondary' : 'hover:bg-muted'}`}>Resolved</Link>
            </div>

            <div className="border rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium">Dispute ID</th>
                            <th className="px-4 py-3 font-medium">Subject Type</th>
                            <th className="px-4 py-3 font-medium">Description</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-medium font-mono text-xs truncate max-w-[100px]">{row.id}</td>
                                <td className="px-4 py-3 capitalize">{row.subjectType.replace('_', ' ')}</td>
                                <td className="px-4 py-3 truncate max-w-xs">{row.description}</td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-full capitalize">
                                        {row.status.replace('_', ' ')}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground font-mono tabular-nums text-xs">
                                    {new Date(row.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <Link href={`/disputes/${row.id}`} className="text-primary hover:underline text-sm font-medium">
                                        Review
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    No disputes found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
