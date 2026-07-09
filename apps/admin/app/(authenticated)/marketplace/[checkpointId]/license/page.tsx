import { Badge, Button, Input } from '@chorus/ui';
import Link from 'next/link';

export default async function ManageLicensesPage({ params }: { params: { checkpointId: string } }) {
    // In a real implementation, fetch existing licenses from /v1/marketplace/licenses/checkpoint/:id
    const mockLicenses = [
        { id: 'lic_abc', licenseeName: 'PharmaCorp', createdAt: '2026-07-03' }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/marketplace">
                    <Button variant="secondary" size="sm">← Back</Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Licenses</h1>
                    <p className="text-muted-foreground text-sm">
                        Checkpoint: <span className="font-mono">{params.checkpointId}</span>
                    </p>
                </div>
            </div>

            <section className="bg-bg-elevated border border-border-default rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-medium">Issue New License</h2>
                <form className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary" htmlFor="licensee">Licensee Name</label>
                        <Input id="licensee" placeholder="e.g. BioTech Inc." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary" htmlFor="terms">Terms Link / Text</label>
                        <Input id="terms" placeholder="https://..." />
                    </div>
                    <Button variant="primary" type="submit">Issue License</Button>
                </form>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-medium">Existing Licenses</h2>
                <div className="border rounded-md">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted border-b">
                            <tr>
                                <th className="px-4 py-3 font-medium">License ID</th>
                                <th className="px-4 py-3 font-medium">Licensee</th>
                                <th className="px-4 py-3 font-medium">Issued At</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {mockLicenses.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        No licenses issued yet.
                                    </td>
                                </tr>
                            ) : mockLicenses.map((lic) => (
                                <tr key={lic.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs">{lic.id}</td>
                                    <td className="px-4 py-3 font-medium">{lic.licenseeName}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{lic.createdAt}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant="default">Active</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
