# Payout: Disclosure Boundary

Per `BLOCKCHAIN_ARCHITECTURE.md`, this contract triggers and records a contribution-proportional payment.

## Disclosure Points

| Disclosure point | Triggered by | Visible to | What becomes visible |
|---|---|---|---|
| **Payout settlement** | Contribution ledger write | The receiving hospital, and — for basic amount/timestamp only, not the underlying contribution detail — any party with a legitimate financial audit reason | Payment amount, currency, settlement reference |

*This file must match `BLOCKCHAIN_ARCHITECTURE.md` exactly.*
