// Organization and membership Zod schemas
// Source: DATABASE_DESIGN.md — organizations, memberships, roles tables
// Source: API_SPEC.md — role-based authorization section
// Source: SYSTEM_ARCHITECTURE.md — authorization section
//
// These schemas are the canonical definition of org types and member roles.
// The same values must appear in:
//   - DATABASE_DESIGN.md (organizations.type and memberships.role CHECK constraints)
//   - SECURITY_MODEL.md (RBAC section)
// Any addition here requires a corresponding database migration.

import { z } from 'zod'

// ── Organization types ────────────────────────────────────────────────────────
// API_SPEC.md GET /v1/orgs/:orgId response — type enum
export const OrganizationTypeSchema = z.enum(['hospital', 'biobank', 'sponsor', 'regulator'])

export type OrganizationType = z.infer<typeof OrganizationTypeSchema>

// ── Membership roles ──────────────────────────────────────────────────────────
// SYSTEM_ARCHITECTURE.md authorization section: five roles + regulator
// SECURITY_MODEL.md: "regulator role can never authenticate into apps/dashboard,
// apps/research-portal, or apps/admin — this is enforced at the application routing layer"
export const MembershipRoleSchema = z.enum([
  'hospital_admin',
  'clinician',
  'compliance_officer',
  'sponsor',
  'chorus_admin',
  'regulator', // read-only, apps/compliance only
])

export type MembershipRole = z.infer<typeof MembershipRoleSchema>

// ── Organization schema ───────────────────────────────────────────────────────
// Matches API_SPEC.md GET /v1/orgs/:orgId response shape
export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(120),
  type: OrganizationTypeSchema,
  workosOrgId: z.string(),
  createdAt: z.string().datetime(),
})

export type Organization = z.infer<typeof OrganizationSchema>

// ── Membership schema ─────────────────────────────────────────────────────────
export const MembershipSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  orgId: z.string().uuid(),
  role: MembershipRoleSchema,
  createdAt: z.string().datetime(),
})

export type Membership = z.infer<typeof MembershipSchema>

// ── Role permission matrix ─────────────────────────────────────────────────────
// Which apps each role is permitted to access — enforced at routing layer.
// Source: SYSTEM_ARCHITECTURE.md authorization section
export const ROLE_PERMITTED_APPS: Record<MembershipRole, readonly string[]> = {
  hospital_admin: ['dashboard'],
  clinician: ['dashboard'],
  compliance_officer: ['dashboard'],
  sponsor: ['research-portal'],
  chorus_admin: ['dashboard', 'research-portal', 'compliance', 'admin'],
  regulator: ['compliance'], // SYSTEM_ARCHITECTURE.md: "regulator role scoped to apps/compliance only"
} as const
