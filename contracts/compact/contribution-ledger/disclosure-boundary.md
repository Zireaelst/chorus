# Contribution Ledger: Disclosure Boundary

Per `BLOCKCHAIN_ARCHITECTURE.md`, this contract records a verified federated-learning contribution to a cohort's training round.

## Disclosure Points

| Disclosure point | Triggered by | Visible to | What becomes visible |
|---|---|---|---|
| **Contribution confirmation** | Verified proof accepted | The contributing hospital, and the cohort's other verified contributors (aggregate only) | That a contribution occurred, its round number, and its verification timestamp — never the model update content |
| **Regulatory audit query** | A `regulator`-role query through `apps/compliance` | The querying regulator only, scoped to the specific query | Exactly what the query asked and nothing else — this is the on-chain anchor for the `scopedSummary` field |

*This file must match `BLOCKCHAIN_ARCHITECTURE.md` exactly.*
