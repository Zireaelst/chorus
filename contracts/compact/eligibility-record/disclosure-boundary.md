# Eligibility Record: Disclosure Boundary

Per `BLOCKCHAIN_ARCHITECTURE.md`, this contract attests that a hospital's cohort satisfies a defined criterion, without revealing the underlying patient data or exact count.

## Disclosure Points

| Disclosure point | Triggered by | Visible to | What becomes visible |
|---|---|---|---|
| **Eligibility attestation** | Hospital submits a cohort criterion match | Sponsor with an approved access request | Boolean match + k-anonymized size bucket — never exact count, never criterion detail beyond what the sponsor's request scoped |
| **Regulatory audit query** | A `regulator`-role query through `apps/compliance` | The querying regulator only, scoped to the specific query | Exactly what the query asked and nothing else — answers "was this cohort verified against criterion X, on what date, by which round" |

*This file must match `BLOCKCHAIN_ARCHITECTURE.md` exactly.*
