import { Badge } from '@chorus/ui';
// Using standard primitive layout, avoiding verify-amber explicitly per spec.

export default async function ReputationPage() {
    // In a real implementation, we fetch organizations and their reputationScores from Prisma.
    // Simulating database output for Sprint 9 UI construction:
    const mockReputationData = [
        { orgId: 'org_123', name: 'St. Jude Childrens Research Hospital', score: 1450, formulaVersion: '1.0' },
        { orgId: 'org_456', name: 'Mayo Clinic', score: 1800, formulaVersion: '1.0' },
        { orgId: 'org_789', name: 'Cleveland Clinic', score: 120, formulaVersion: '1.0' },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Institutional Reputation Scores</h1>
            <p className="text-muted-foreground text-sm">
                Computed from verified federated-learning contributions. Invisible to cross-institutional parties.
            </p>

            <div className="border rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium">Institution</th>
                            <th className="px-4 py-3 font-medium">Score</th>
                            <th className="px-4 py-3 font-medium">Formula Version</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {mockReputationData.map((row) => (
                            <tr key={row.orgId} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-medium">{row.name}</td>
                                <td className="px-4 py-3">
                                    {/* Using standard variant, NEVER verify-amber */}
                                    <Badge intent="default" className="text-xs px-2 py-0.5 rounded-full">
                                        {row.score.toLocaleString()} pts
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">v{row.formulaVersion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
