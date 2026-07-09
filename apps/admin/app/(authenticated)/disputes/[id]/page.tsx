import { Badge, Button } from '@chorus/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // In a real implementation, we fetch the specific dispute and its subject details.
    const mockDispute = {
        id: id,
        subjectType: 'access_request',
        subjectId: 'ar_1234567890abcdef',
        status: 'open',
        description: 'Hospital claims the cohort criteria exceeds permitted bounds for this data slice.',
        resolutionNote: '',
        createdAt: '2026-07-05T10:00:00Z',
    };

    if (!mockDispute) {
        notFound();
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-4">
                <Link href="/disputes" className="text-muted-foreground hover:text-primary">
                    &larr; Back to Disputes
                </Link>
            </div>
            
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dispute Details</h1>
                <p className="text-muted-foreground text-sm font-mono mt-1">ID: {mockDispute.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dispute Metadata */}
                <div className="space-y-6">
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">Metadata</h2>
                        <div className="border rounded-md p-4 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <Badge variant="outline" className="mt-1 capitalize">{mockDispute.status.replace('_', ' ')}</Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Created</p>
                                <p className="text-sm mt-1 tabular-nums font-mono">{new Date(mockDispute.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Description</p>
                                <p className="text-sm mt-1">{mockDispute.description}</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">Resolution Workflow</h2>
                        <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                            {/* In a real app, this form posts to a server action targeting PATCH /v1/disputes/:id */}
                            <div>
                                <label className="text-sm font-medium">Update Status</label>
                                <select className="w-full mt-1.5 p-2 rounded-md border bg-background text-sm" defaultValue={mockDispute.status}>
                                    <option value="open">Open</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Resolution Note (Internal)</label>
                                <textarea 
                                    className="w-full mt-1.5 p-2 rounded-md border bg-background text-sm min-h-[100px]" 
                                    placeholder="Add notes detailing the resolution or triage step..."
                                    defaultValue={mockDispute.resolutionNote}
                                />
                            </div>
                            <Button className="w-full">Save Changes</Button>
                        </div>
                    </section>
                </div>

                {/* Referenced Subject Record (Read-Only) */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Referenced Record</h2>
                    <div className="border rounded-md p-4 bg-muted/10 font-mono text-sm space-y-4">
                        <div>
                            <span className="text-muted-foreground">Type:</span> 
                            <span className="ml-2 font-medium capitalize">{mockDispute.subjectType.replace('_', ' ')}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">ID:</span> 
                            <span className="ml-2 truncate block mt-1">{mockDispute.subjectId}</span>
                        </div>
                        <hr />
                        {/* Mocking the fetched record payload */}
                        <div className="space-y-2">
                            <span className="text-muted-foreground">Snapshot (Read-Only):</span>
                            <pre className="p-3 bg-secondary/50 rounded overflow-x-auto text-xs text-secondary-foreground border">
                                {JSON.stringify({
                                    id: mockDispute.subjectId,
                                    status: "pending_review",
                                    justification: "Requesting access for clinical trial #4521",
                                    cohortId: "ch_9876",
                                    createdAt: "2026-07-02T15:30:00Z"
                                }, null, 2)}
                            </pre>
                        </div>
                        <p className="text-xs text-muted-foreground pt-4 leading-relaxed">
                            <strong>Note:</strong> Resolving this dispute does not automatically mutate the referenced record above. 
                            Any required reversals or voids must be processed through their respective ledger or access-control channels.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
