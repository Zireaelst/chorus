# Chorus — Security model

## Purpose

This document defines Chorus's threat model and the concrete controls that answer it. It is written so that a security reviewer, a hospital's compliance officer, or a Midnight ecosystem auditor can evaluate the platform's posture without needing a separate conversation to fill gaps — every control below traces to a specific threat, and every threat below has a stated control, even where that control is "this is out of Chorus's boundary by design."

## Context

Chorus's central architectural claim — restated because every control in this document exists to protect it — is that raw patient data never touches Chorus-operated infrastructure. This changes the shape of the threat model relative to a typical healthcare SaaS vendor: Chorus cannot leak what it never holds. The remaining attack surface is narrower but not small — organizational identity, cryptographic proof integrity, financial settlement, and the metadata layer are all real assets worth a rigorous model.

## Threat model

| Asset | Threat | Mitigation |
|---|---|---|
| Hospital's Chorus Node signing key | Compromise of the key would let an attacker forge contributions as that institution | Key never leaves hospital infrastructure (see `BLOCKCHAIN_ARCHITECTURE.md`); documented rotation/recovery procedure; compromise is contained to one org's future submissions, not retroactive, since past on-chain history is independently verified |
| Zero-knowledge proof submission | A malicious or compromised hospital submits a dishonest proof (poisoned/fabricated training) | The training-correctness circuit makes a dishonest proof mathematically unable to verify — this is a cryptographic guarantee, not a heuristic detection system |
| Proof submission channel | Replay of a previously valid proof | `(cohortId, orgId, roundNumber)` uniqueness enforced at both the database and contract layer — see `DATABASE_DESIGN.md` and `BLOCKCHAIN_ARCHITECTURE.md` |
| API keys | Leakage via logs, client-side exposure, or a compromised CI secret | Keys are hashed at rest and never logged in full; `services/api` request logging middleware redacts the `Authorization` header by default, not by convention that could be forgotten in a new log line |
| Session cookies | Session hijacking via XSS or token theft | HttpOnly, `Secure`, `SameSite=Lax` cookies; Next.js's built-in XSS protections plus a strict Content-Security-Policy on every app |
| Webhook delivery URLs | Server-side request forgery — a malicious webhook URL pointed at Chorus's internal network | Webhook target validation rejects private/internal IP ranges (RFC 1918, link-local, loopback) at registration time and again at delivery time, since DNS can change between the two |
| Regulator disclosure queries | An over-broad or fishing-expedition query used to infer patient-level information indirectly | Every disclosure query is itself logged (`disclosure_queries`, see `DATABASE_DESIGN.md`) and scoped server-side to pre-approved fields — a regulator cannot construct an arbitrary query, only select from a bounded set of pre-defined, pre-reviewed query shapes |
| AI copilot input | Prompt injection via a crafted cohort description | The action guardrail in `AI_ARCHITECTURE.md` caps the blast radius: even a successful injection can only produce a bad suggestion requiring human review — it cannot write to a database, sign a transaction, or bypass the PII pre-filter, which runs before the model ever sees the text |
| Insider risk (Chorus employee) | A Chorus employee with production access misuses that access | Least-privilege access to production systems, all access logged, no employee role has standing access to any datastore holding patient-adjacent content because none exists to access — the non-custodial architecture is itself the strongest insider-risk control |
| Third-party dependency | A compromised npm/PyPI package introduces malicious code | Dependency updates go through automated vulnerability scanning in CI (see `GITHUB_WORKFLOW.md`); lockfiles are committed and reviewed as part of any dependency-bump PR, not auto-merged |

## OWASP API Security Top 10 — mapping

Chorus's primary external surface is `services/api`, so the API-specific OWASP list, not only the general web Top 10, is the more relevant reference.

| Category | Risk to Chorus | Mitigation |
|---|---|---|
| API1 — Broken object level authorization | A caller accesses another org's cohort or contribution by guessing an ID | Every resource fetch checks membership/ownership server-side; an unauthorized lookup returns `404`, not `403`, to avoid confirming existence — see `API_SPEC.md` |
| API2 — Broken authentication | Weak session or key handling | WorkOS-backed SSO, hashed API keys, short session lifetimes; magic-link fallback is pilot-only and retired before production (see `DEVELOPMENT_ROADMAP.md`) |
| API3 — Broken object property level authorization | A sponsor sees fields of a cohort it shouldn't | Response shaping is scoped per caller role at the service layer, not filtered client-side — a sponsor without approved access literally never receives the restricted fields in the payload |
| API4 — Unrestricted resource consumption | Abuse of the AI copilot or proof-submission endpoints to run up cost or load | Rate limiting per API key/session (see `API_SPEC.md`); copilot endpoints additionally capped on input length and per-org daily call volume |
| API5 — Broken function level authorization | A `clinician`-role user calls an admin-only endpoint | RBAC guard checks run at the API layer for every route, independent of what the frontend chooses to render — see `SYSTEM_ARCHITECTURE.md` authorization section |
| API6 — Unrestricted access to sensitive business flows | Automated scraping of the cohort-search endpoint to reconstruct precise patient counts | The k-anonymity floor is enforced server-side and cannot be bypassed by query variation — a query matching fewer institutions than the floor returns no result, not a smaller true number |
| API7 — Server-side request forgery | Malicious webhook or callback URL | See webhook mitigation in the threat table above |
| API8 — Security misconfiguration | Divergent, insecure config across apps/services | Shared, centrally-owned config in `packages/config`; per-app overrides are disallowed by convention and flagged in review — see `CODING_STANDARDS.md` |
| API9 — Improper inventory management | An old, forgotten API version or endpoint remains reachable and unreviewed | `API_SPEC.md` is the single source of truth for the live endpoint inventory; a deprecated version is decommissioned on a published timeline, not left running indefinitely |
| API10 — Unsafe consumption of APIs | Trusting a third-party API's (WorkOS, model provider, Midnight RPC) response without validation | Every external response is validated against an expected schema before use, exactly as user input would be — a third-party API is treated as untrusted input, not a trusted internal call |

## HIPAA

Chorus's non-custodial architecture changes the usual HIPAA conversation: because patient data never enters Chorus-operated infrastructure, Chorus is structurally positioned to avoid being a Business Associate in the traditional sense for the data itself — but `packages/node` runs inside a HIPAA-covered entity's environment, and the platform still needs to satisfy the Security Rule's technical safeguards for everything it does touch.

| HIPAA Security Rule requirement | How Chorus satisfies it |
|---|---|
| Access control (§164.312(a)) | RBAC enforced at multiple layers (see Authorization below); unique user identification via WorkOS-backed accounts, never shared credentials |
| Audit controls (§164.312(b)) | Append-only `audit_log`, retained a minimum of six years from creation, aligned to the Security Rule's documentation retention requirement |
| Integrity (§164.312(c)) | Contribution and payout records are anchored to Midnight, giving tamper-evidence beyond what a database row alone provides |
| Person or entity authentication (§164.312(d)) | WorkOS SSO/SAML for human users; hashed, revocable API keys and locally-held signing keys for machine identities |
| Transmission security (§164.312(e)) | TLS 1.3 for all traffic; see Encryption below |

Chorus pursues a Business Associate Agreement with hospital customers and with its third-party model provider as defense-in-depth, even where the architecture's own guarantees would arguably make one unnecessary for a given data flow — consistent with the same reasoning applied in `AI_ARCHITECTURE.md`'s privacy section.

## GDPR

Data minimization and purpose limitation are architectural, not policy statements: Chorus's databases (see `DATABASE_DESIGN.md`) hold organization, user, and cohort-criteria metadata only, by design, which means the GDPR right to erasure applies to that metadata (an org or user can be deactivated and its personal account data removed), not to patient data — because no patient data exists in a Chorus-operated system to erase in the first place. This resolves what would otherwise be a genuine tension between GDPR erasure rights and blockchain immutability: Chorus never puts patient-identifiable content on-chain, so the immutability of the contribution and payout ledgers never conflicts with anyone's erasure right. Cross-border transfer, relevant given Chorus's EHDS-aligned positioning, is handled by the federated architecture itself — patient data never crosses a border because it never leaves the originating institution; only proofs and metadata do.

## Encryption

TLS 1.3 for all traffic, including internal service-to-service calls. Data at rest — PostgreSQL and Redis — uses provider-managed encryption at rest (enabled by default on the managed database offerings `SYSTEM_ARCHITECTURE.md` specifies). Application-level secrets (API keys, webhook signing secrets) are hashed with a modern, salted hashing algorithm before storage — never stored or logged in plaintext, and never recoverable, only re-issuable.

## Authentication

WorkOS provides SAML SSO and SCIM for enterprise hospital accounts (see `SYSTEM_ARCHITECTURE.md`). Session cookies are HttpOnly, `Secure`, and scoped with `SameSite=Lax`. Machine callers authenticate via hashed, org-scoped, individually revocable API keys. The magic-link fallback documented for early pilot institutions is explicitly a pilot-phase accommodation, not a permanent authentication path — it is retired at the v1.0 production release milestone in `DEVELOPMENT_ROADMAP.md` in favor of mandatory SSO, since a fallback that never expires tends to quietly become the path of least resistance for every future institution, undermining the SSO requirement's purpose.

## Authorization

RBAC is enforced redundantly at three layers, deliberately: application routing (a `regulator` role cannot reach `apps/dashboard` regardless of any API-level check succeeding), the API guard layer (every endpoint states its allowed roles — see `API_SPEC.md`), and the database layer (constraint checks on `memberships.role`, foreign-key restrictions preventing orphaned or elevated access). `services/ai` holds no database credentials at all — the strongest form of least privilege available, since a credential that doesn't exist cannot be misused or leaked.

## Audit logging

Every authentication event, role change, API key issuance/revocation, cohort submission, contribution verification, payout settlement, and disclosure query is written to the append-only `audit_log` (or, for regulator queries specifically, the dedicated `disclosure_queries` table — see `DATABASE_DESIGN.md`). The database role `services/api` connects as has no `UPDATE` or `DELETE` grant on either table — append-only is enforced at the database permission level, not only by application discipline that a future bug could violate. Access to audit logs is itself restricted to `compliance_officer`, `regulator` (scoped to their own org's relevant entries), and `chorus_admin`, and that access is logged — the audit trail is subject to the same "who watches the watchers" principle applied everywhere else in this document.

## Secrets management

All environment secrets are managed centrally through Doppler, synced to Vercel, Railway/Fly.io, and GitHub Actions from a single source rather than maintained independently per provider — this specifically prevents the secret-drift failure mode where a rotated key updates in one environment but not another. GitHub's native secret scanning and push protection block a commit containing a recognizable credential pattern before it ever reaches the remote repository. Environment variables exposed to client-side code must be explicitly and individually allow-listed (Next.js's `NEXT_PUBLIC_` convention) — there is no blanket client exposure of an app's environment.

## AI safety

Restated here specifically as a security control, complementing the product-level treatment in `AI_ARCHITECTURE.md`: the three-layer guardrail (input PII filter, output schema validation, zero write capability) means a successful prompt injection against the copilot is contained by design — the worst outcome is a bad suggestion a human reviewer discards, never an unauthorized write, an data exfiltration path, or a bypass of any other control in this document. Model provider calls are rate-limited independently of general API rate limits, to prevent the copilot becoming a cost- or availability-attack vector distinct from the rest of the platform.

## Security non-negotiables

| Do | Don't |
|---|---|
| Treat every third-party API response as untrusted input | Assume a response from WorkOS, a model provider, or Midnight RPC is safe to use unvalidated |
| Enforce authorization at routing, API, and database layers | Rely on a single layer, even a well-tested one |
| Log security-relevant events to an append-only store with no delete grant | Trust application-level discipline alone to keep an audit trail intact |
| Retire the magic-link fallback before production hospital use | Let a pilot-phase accommodation become a permanent path of least resistance |

## Future considerations

A SOC 2 Type II audit is targeted alongside the v1.0 production release, once there is a real operating history to audit against — pursuing it earlier would produce a report covering pre-production practices, which is not useful to a hospital's procurement review. External penetration testing is scheduled ahead of each major trust-boundary change (the v0.8 zero-knowledge engine audit already tracked in `DEVELOPMENT_ROADMAP.md`, and again ahead of mainnet at v1.0). A public bug bounty program is planned for after the `contracts/` and `packages/sdk` open-source transition, once external security researchers have source access worth rewarding findings against.
