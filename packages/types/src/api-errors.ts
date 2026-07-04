// Standard API error types
// Source: API_SPEC.md — "Standard error envelope" and "Standard error taxonomy"
//
// Every non-2xx response from services/api returns:
//   { error: { code, message, requestId } }
//
// `code` is a stable, machine-readable string from the taxonomy below.
// `message` is human-readable and safe to display.
// `requestId` ties the response to server-side logs for support.

import { z } from 'zod'

// ── Standard error codes ──────────────────────────────────────────────────────
// Verbatim from API_SPEC.md error taxonomy table
export const StandardErrorCodeSchema = z.enum([
  'VALIDATION_ERROR', // 400 — request body failed schema validation
  'UNAUTHENTICATED', // 401 — no valid session or API key
  'FORBIDDEN', // 403 — authenticated but role doesn't permit this action
  'NOT_FOUND', // 404 — resource doesn't exist or caller has no visibility
  'CONFLICT', // 409 — request conflicts with current resource state
  'RATE_LIMITED', // 429 — caller exceeded rate limit
  'INTERNAL', // 500 — unexpected server error
])

export type StandardErrorCode = z.infer<typeof StandardErrorCodeSchema>

// ── Domain-specific conflict codes ───────────────────────────────────────────
// Endpoint-specific conflict codes noted in API_SPEC.md
export const ConflictErrorCodeSchema = z.enum([
  'ALREADY_MEMBER', // POST /v1/orgs/:orgId/members/invite
  'COHORT_NOT_IN_DRAFT', // POST /v1/cohorts/:cohortId/submit
  'UNRESOLVED_COMPLIANCE_FLAGS', // POST /v1/cohorts/:cohortId/submit
  'ROUND_CLOSED', // POST /v1/proofs
  'DUPLICATE_CONTRIBUTION', // POST /v1/proofs
  'REQUEST_ALREADY_PENDING', // POST /v1/cohorts/:cohortId/access-requests
  'REQUEST_NOT_PENDING', // PATCH /v1/access-requests/:requestId
])

export type ConflictErrorCode = z.infer<typeof ConflictErrorCodeSchema>

// ── AI-specific error code ────────────────────────────────────────────────────
// Source: API_SPEC.md POST /v1/copilot/cohort-draft
// Source: AI_ARCHITECTURE.md — "PII/PHI pattern detector runs before any text reaches a model call"
export const AIErrorCodeSchema = z.enum([
  'PII_DETECTED', // 422 — input contained a detectable direct identifier
])

export type AIErrorCode = z.infer<typeof AIErrorCodeSchema>

// ── Standard error envelope ───────────────────────────────────────────────────
export const ApiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.union([StandardErrorCodeSchema, ConflictErrorCodeSchema, AIErrorCodeSchema]),
    message: z.string(),
    requestId: z.string(),
  }),
})

export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelopeSchema>
