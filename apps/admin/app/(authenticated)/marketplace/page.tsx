import { Badge } from '@chorus/ui/components/badge';
import Link from 'next/link';
import { Button } from '@chorus/ui/components/button';

export default async function MarketplaceAdminPage() {
    // In a real implementation, this would fetch from /v1/marketplace/checkpoints.
    // Simulating database output for Sprint 11 UI construction:
    const mockCheckpoints = [
        { id: 'ckpt_123', cohortId: 'cohort_789', startRound: 1, endRound: 10, hash: '0xabc123...', createdAt: '2026-07-01' },
        { id: 'ckpt_456', cohortId: 'cohort_789', startRound: 11, endRound: 20, hash: '0xdef456...', createdAt: '2026-07-04' }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Model Checkpoints & Passports</h1>
                    <p className="text-muted-foreground text-sm">
                        Internal registry of trained models and their derived provenance passports.
                    </p>
                </div>
            </div>

            <div className="border rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium">Checkpoint ID</th>
                            <th className="px-4 py-3 font-medium">Cohort</th>
                            <th className="px-4 py-3 font-medium">Round Range</th>
                            <th className="px-4 py-3 font-medium">Hash</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {mockCheckpoints.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-medium">{row.id}</td>
                                <td className="px-4 py-3">{row.cohortId}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    <Badge variant="default" className="text-xs px-2 py-0.5 rounded-full">
                                        R{row.startRound} - R{row.endRound}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.hash}</td>
                                <td className="px-4 py-3 text-muted-foreground">{row.createdAt}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <Button variant="secondary" size="sm">View Passport</Button>
                                        <Link href={`/marketplace/${row.id}/license`}>
                                            <Button variant="primary" size="sm">Manage Licenses</Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
