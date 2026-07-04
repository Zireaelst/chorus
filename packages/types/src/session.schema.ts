import { z } from 'zod'
import { MembershipRoleSchema } from './organization.schema'

export const SessionUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  workosUserId: z.string(),
  memberships: z.array(
    z.object({
      orgId: z.string().uuid(),
      role: MembershipRoleSchema,
    })
  ),
})

export type SessionUser = z.infer<typeof SessionUserSchema>
