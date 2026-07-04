/**
 * Injected email-sending interface.
 * No concrete implementation exists yet (e.g., SendGrid, Mailgun) pending a provider decision.
 */
export interface IEmailTransport {
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

export class MockEmailTransport implements IEmailTransport {
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        // No-op until a concrete provider is selected and implemented.
        console.log(`[EmailTransport] Simulated send to ${to}: ${subject}`);
        return true;
    }
}
