# Chorus — API specification

## Purpose

This is the contract for `services/api`, the single synchronous entry point every client application and every external SDK integration calls through. It is written to be implementable without further clarification — where a rule applies to every endpoint (auth, error format, rate limiting) it is defined once in Conventions and referenced, not repeated.

## Context

Two fundamentally different caller populations hit this API: human-driven browser sessions from `apps/*` (authenticated via WorkOS session cookie) and machine callers — a hospital's Chorus Node, or a third-party integration built on `packages/sdk` — authenticated via API key. Every endpoint below states which of these it accepts; several accept either.

## Conventions

**Base URL:** `https://api.chorus.health/v1` — all endpoints below are relative to this. **Versioning:** the path is the version boundary (`/v1`); a breaking change ships as `/v2` alongside a deprecation window for `/v1`, never as a silent behavior change on an existing version.

**Authentication:**
| Method | Used by | How |
|---|---|---|
| Session cookie | `apps/*` browser sessions | Issued by `services/api` after a successful WorkOS SSO exchange; HttpOnly, scoped to `api.chorus.health` |
| API key | Chorus Node, `packages/sdk` integrations | `Authorization: Bearer <key>` header; keys are org-scoped and issued via the developer portal in `apps/dashboard` |

**Authorization (roles):** `hospital_admin` · `clinician` · `compliance_officer` · `sponsor` · `chorus_admin` · `regulator` (read-only, `apps/compliance` only — see `SYSTEM_ARCHITECTURE.md`). Every endpoint states which roles may call it; a role not listed receives `403 FORBIDDEN`, not a filtered/empty response — the API never silently narrows a response instead of rejecting an unauthorized call.

**Standard error envelope:** every non-2xx response returns `{ error: { code, message, requestId } }`. `code` is a stable, machine-readable string from the taxonomy below (or an endpoint-specific code, noted per endpoint); `message` is human-readable and safe to display; `requestId` ties the response to server-side logs for support.

**Standard error taxonomy:**
| HTTP status | Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Request body failed schema validation |
| 401 | `UNAUTHENTICATED` | No valid session or API key |
| 403 | `FORBIDDEN` | Authenticated, but the caller's role doesn't permit this action |
| 404 | `NOT_FOUND` | Resource doesn't exist, or exists but the caller has no visibility into it (these are intentionally indistinguishable to avoid leaking existence) |
| 409 | `CONFLICT` | Request conflicts with current resource state |
| 429 | `RATE_LIMITED` | Caller exceeded its rate limit |
| 500 | `INTERNAL` | Unexpected server error; always logged with `requestId` |

**Rate limiting:** 120 requests/minute per API key for machine callers, 300 requests/minute per session for browser callers, both returning `429 RATE_LIMITED` with a `Retry-After` header on breach.

**Idempotency:** every mutating endpoint that can trigger an on-chain effect (proof submission, payout-adjacent writes) requires an `Idempotency-Key` header. A retried request with the same key and same body returns the original response rather than re-executing — this matters specifically because a network timeout on a proof submission must never risk a duplicate on-chain contribution record.

---

## Organizations & members

#### `GET /v1/orgs/:orgId`
**Purpose:** Fetch an organization's profile and settings.
**Auth:** Session or API key. **Authorization:** any role that is a member of `:orgId`.
**Response `200`:**
| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `name` | string | |
| `type` | enum | `hospital` \| `biobank` \| `sponsor` \| `regulator` |
| `workosOrgId` | string | |
| `createdAt` | string (ISO 8601) | |

**Errors:** `401 UNAUTHENTICATED` · `403 FORBIDDEN` · `404 NOT_FOUND`

#### `PATCH /v1/orgs/:orgId`
**Purpose:** Update organization settings (name, contact details — never `type`, which is fixed at onboarding).
**Auth:** Session. **Authorization:** `hospital_admin`, `chorus_admin`.
**Request:** `{ name?: string, contactEmail?: string }` — partial update, only provided fields change.
**Validation:** `name` 2–120 chars; `contactEmail` valid email format.
**Response `200`:** updated org object (same shape as `GET`).
**Errors:** `400 VALIDATION_ERROR` · `403 FORBIDDEN` · `404 NOT_FOUND`

#### `POST /v1/orgs/:orgId/members/invite`
**Purpose:** Invite a new member to the organization by email, with a specified role.
**Auth:** Session. **Authorization:** `hospital_admin`, `chorus_admin`.
**Request:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | yes | Invitee's email |
| `role` | enum | yes | Any role valid for the org's `type` — a `sponsor` org cannot invite a `clinician`, for example |

**Validation:** role must be one of the roles valid for the target org's `type` (enforced server-side, not just at the UI layer — see `FRONTEND_GUIDELINES.md` on schema reuse).
**Response `201`:** `{ inviteId, email, role, status: "pending" }`
**Errors:** `400 VALIDATION_ERROR` (invalid role for org type) · `403 FORBIDDEN` · `409 CONFLICT` (`ALREADY_MEMBER`)

---

## Cohort criteria

#### `POST /v1/cohorts`
**Purpose:** Create a new cohort criteria draft.
**Auth:** Session. **Authorization:** `hospital_admin`, `compliance_officer`, `sponsor`.
**Request:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Internal reference name |
| `criteria` | object | yes | Structured criteria — same schema the AI copilot outputs and `services/ai` validates against, see `AI_ARCHITECTURE.md` |
| `originAppSuggestion` | enum | no | `manual` \| `copilot` — for analytics only, never affects processing |

**Validation:** `criteria` must pass the shared cohort-criteria schema; at minimum one clinical field and one demographic field are required — an empty or single-field criterion is rejected as too broad to be a meaningful cohort.
**Response `201`:** `{ id, title, criteria, status: "draft", createdAt }`
**Errors:** `400 VALIDATION_ERROR` · `403 FORBIDDEN`

#### `GET /v1/cohorts/:cohortId`
**Purpose:** Fetch a cohort's current state.
**Auth:** Session or API key. **Authorization:** members of the owning org; a `sponsor` org only if it has an approved access request for this cohort (see below) — otherwise `404 NOT_FOUND`, not `403`, to avoid confirming the cohort exists.
**Response `200`:** `{ id, title, criteria, status, orgId, createdAt, updatedAt }` — `criteria` visibility is itself scoped: a sponsor without approved access sees only aggregate metadata, never the full criteria object; see `BLOCKCHAIN_ARCHITECTURE.md` for how this maps to on-chain `disclose()` boundaries.
**Errors:** `401 UNAUTHENTICATED` · `404 NOT_FOUND`

#### `POST /v1/cohorts/:cohortId/submit`
**Purpose:** Freeze a draft and trigger eligibility-circuit generation (from v0.7 onward).
**Auth:** Session. **Authorization:** `hospital_admin`, `compliance_officer` (the role that created the draft, or any `hospital_admin` on the owning org).
**Validation:** cohort must be in `draft` status; must have passed AI compliance flagging with no unresolved `blocking` flags (see `AI_ARCHITECTURE.md` guardrails).
**Response `200`:** `{ id, status: "submitted", circuitGenerationJobId }`
**Errors:** `409 CONFLICT` (`COHORT_NOT_IN_DRAFT`, `UNRESOLVED_COMPLIANCE_FLAGS`) · `403 FORBIDDEN`

---

## AI copilot

#### `POST /v1/copilot/cohort-draft`
**Purpose:** Convert natural-language cohort description into a structured draft suggestion. Proxies to `services/ai`; never persists anything itself.
**Auth:** Session. **Authorization:** `hospital_admin`, `compliance_officer`, `sponsor`.
**Request:** `{ description: string, existingCriteria?: object }` — `description` max 2,000 characters.
**Response `200`:** `{ suggestedCriteria: object, ambiguousFields: string[], requiresReview: true }` — `requiresReview` is always `true`; there is no response shape that implies auto-acceptance.
**Errors:** `400 VALIDATION_ERROR` · `422 PII_DETECTED` (the pre-filter described in `AI_ARCHITECTURE.md` rejected the input before it reached the model) · `403 FORBIDDEN`

#### `POST /v1/copilot/compliance-check`
**Purpose:** Flag likely HIPAA/GDPR/EHDS issues in a draft cohort.
**Auth:** Session. **Authorization:** `compliance_officer`, `hospital_admin`.
**Request:** `{ criteria: object, jurisdiction: string }` — ISO country/region code, determines which regulatory corpus is retrieved.
**Response `200`:** `{ flags: [{ severity: "blocking" | "advisory", regulation: string, citation: string, explanation: string }] }` — every flag carries a `citation`; a flag the retrieval step can't ground in a real source is suppressed, not shown (see `AI_ARCHITECTURE.md` hallucination mitigation).
**Errors:** `400 VALIDATION_ERROR` · `403 FORBIDDEN`

---

## Proof submission

#### `POST /v1/proofs`
**Purpose:** Submit a zero-knowledge proof and its metadata from a hospital's Chorus Node.
**Auth:** API key only — this endpoint is never called from a browser session.
**Authorization:** the API key's org must be the org referenced in `orgId`.
**Headers:** `Idempotency-Key` required.
**Request:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `cohortId` | string (uuid) | yes | |
| `orgId` | string (uuid) | yes | Must match the API key's org |
| `proofPayload` | string (base64) | yes | The zero-knowledge proof artifact itself |
| `roundNumber` | integer | yes | Which federated training round this contribution belongs to |

**Validation:** `proofPayload` size capped at 5MB; `roundNumber` must be a currently open round for `cohortId`.
**Response `202`:** `{ proofId, status: "queued" }` — verification is asynchronous; see `SYSTEM_ARCHITECTURE.md` event flow.
**Errors:** `400 VALIDATION_ERROR` · `403 FORBIDDEN` · `409 CONFLICT` (`ROUND_CLOSED`, `DUPLICATE_CONTRIBUTION` — a `(cohortId, orgId, roundNumber)` triple can only submit once)

#### `GET /v1/proofs/:proofId`
**Purpose:** Poll verification status.
**Auth:** API key or session. **Authorization:** the submitting org, or `chorus_admin`.
**Response `200`:** `{ proofId, status: "queued" | "verified" | "rejected", rejectionReason?: string, verifiedAt?: string }`
**Errors:** `404 NOT_FOUND`

---

## Contributions & payouts

#### `GET /v1/orgs/:orgId/contributions`
**Purpose:** List an organization's verified contributions (off-chain mirror of on-chain records).
**Auth:** Session or API key. **Authorization:** members of `:orgId`.
**Query params:** `cohortId?`, `status?`, `cursor?`, `limit?` (default 25, max 100).
**Response `200`:** `{ items: [{ id, cohortId, roundNumber, status, onChainTxRef, verifiedAt }], nextCursor }`
**Errors:** `403 FORBIDDEN`

#### `GET /v1/orgs/:orgId/payouts`
**Purpose:** List settled payouts for an organization.
**Auth:** Session or API key. **Authorization:** `hospital_admin` on `:orgId`, or `chorus_admin`.
**Response `200`:** `{ items: [{ id, contributionId, amount, currency, onChainTxRef, settledAt }], nextCursor }`
**Errors:** `403 FORBIDDEN`

---

## Cohort search & access requests

#### `GET /v1/cohorts/search`
**Purpose:** Sponsor-facing cohort discovery.
**Auth:** Session. **Authorization:** `sponsor`.
**Query params:** structured criteria filters matching the cohort criteria schema.
**Response `200`:** `{ items: [{ cohortId, matchedFieldsSummary, sizeEstimate: string }] }` — `sizeEstimate` is a k-anonymized bucket (e.g. `"12–20"`), never an exact count; a query matching fewer than the k-anonymity floor across all institutions returns no item for that cohort at all rather than a suspiciously precise small number.
**Errors:** `400 VALIDATION_ERROR` · `403 FORBIDDEN`

#### `POST /v1/cohorts/:cohortId/access-requests`
**Purpose:** Sponsor requests access to a discovered cohort.
**Auth:** Session. **Authorization:** `sponsor`.
**Request:** `{ justification: string }` — required, shown to the hospital reviewer.
**Response `201`:** `{ id, cohortId, status: "pending", createdAt }`
**Errors:** `403 FORBIDDEN` · `409 CONFLICT` (`REQUEST_ALREADY_PENDING`)

#### `PATCH /v1/access-requests/:requestId`
**Purpose:** Hospital approves or denies a pending access request.
**Auth:** Session. **Authorization:** `hospital_admin`, `compliance_officer` on the cohort's owning org.
**Request:** `{ decision: "approved" | "denied", note?: string }`
**Response `200`:** updated request object.
**Errors:** `403 FORBIDDEN` · `409 CONFLICT` (`REQUEST_NOT_PENDING`)

---

## Compliance disclosure (regulator-facing, read-only)

#### `GET /v1/compliance/disclosures`
**Purpose:** Query pre-scoped disclosure records — the API-level surface of the on-chain `disclose()` boundary described in `BLOCKCHAIN_ARCHITECTURE.md`.
**Auth:** Session. **Authorization:** `regulator` only.
**Query params:** `cohortId?`, `dateFrom?`, `dateTo?` — every query is itself logged as a `disclosure_query` (see `DATABASE_DESIGN.md`), including queries that return zero results.
**Response `200`:** `{ items: [{ disclosureId, cohortId, eventType, occurredAt, scopedSummary }] }` — `scopedSummary` never includes patient-level content; it answers "was this cohort verified against criterion X, on what date, by which round," nothing more.
**Errors:** `403 FORBIDDEN`

---

## Developer portal

#### `POST /v1/orgs/:orgId/api-keys`
**Purpose:** Issue a new API key for Chorus Node or SDK integration.
**Auth:** Session. **Authorization:** `hospital_admin`.
**Request:** `{ name: string }`
**Response `201`:** `{ id, name, key, createdAt }` — `key` is returned in full exactly once, at creation; it is stored only as a hash thereafter and can never be retrieved again, only revoked and replaced.
**Errors:** `403 FORBIDDEN`

#### `DELETE /v1/orgs/:orgId/api-keys/:keyId`
**Purpose:** Revoke an API key immediately.
**Auth:** Session. **Authorization:** `hospital_admin`.
**Response `204`:** no body.
**Errors:** `403 FORBIDDEN` · `404 NOT_FOUND`

#### `POST /v1/orgs/:orgId/webhooks`
**Purpose:** Register a webhook endpoint for org-scoped events.
**Auth:** Session. **Authorization:** `hospital_admin`.
**Request:** `{ url: string, eventTypes: string[] }` — `url` must be HTTPS.
**Validation:** `url` must respond to a verification challenge before the webhook is marked active.
**Response `201`:** `{ id, url, eventTypes, status: "pending_verification" }`
**Errors:** `400 VALIDATION_ERROR` (non-HTTPS URL) · `403 FORBIDDEN`

---

## Notifications

#### `GET /v1/notifications`
**Purpose:** List notifications for the current session's user.
**Auth:** Session. **Authorization:** any authenticated user (scoped to self).
**Query params:** `unreadOnly?: boolean`, `cursor?`
**Response `200`:** `{ items: [{ id, type, payload, readAt }], nextCursor }`
**Errors:** `401 UNAUTHENTICATED`

#### `PATCH /v1/notifications/:id/read`
**Purpose:** Mark a notification as read.
**Auth:** Session. **Authorization:** the owning user only.
**Response `200`:** updated notification object.
**Errors:** `403 FORBIDDEN` · `404 NOT_FOUND`

## Future considerations

A GraphQL layer is deliberately not planned — see the REST-vs-GraphQL decision in `SYSTEM_ARCHITECTURE.md`'s technology decisions table. As `apps/admin`'s reputation-scoring feature (v0.9) and the v1.5 AI marketplace ship, this document grows two new domains (`/v1/reputation`, `/v1/marketplace`) following the exact template established above, not a new format.
