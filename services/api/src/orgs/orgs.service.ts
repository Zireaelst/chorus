import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MembershipRole, inviteSchema } from '@chorus/types';

const ORG_TYPE_ROLES: Record<string, string[]> = {
  hospital: ['hospital_admin', 'clinician', 'compliance_officer'],
  biobank: ['hospital_admin', 'clinician', 'compliance_officer'],
  sponsor: ['sponsor', 'compliance_officer'],
  regulator: ['regulator'],
};

@Injectable()
export class OrgsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getOrg(orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        id: true,
        name: true,
        type: true,
        workosOrgId: true,
        createdAt: true,
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async updateOrg(orgId: string, actorUserId: string, data: { name?: string; contactEmail?: string }) {
    if (data.name && (data.name.length < 2 || data.name.length > 120)) {
      throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: 'Name must be 2-120 characters' } });
    }
    
    // In a real app we might store contactEmail on the DB too, but DATABASE_DESIGN.md MVP 
    // only has 'name' and 'type' on Organization. 
    // We will just update 'name' for now.
    
    const updateData: any = {};
    if (data.name) updateData.name = data.name;

    const org = await this.prisma.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    await this.audit.logEvent({
      actorUserId,
      orgId,
      eventType: 'organization.updated',
      metadata: { updatedFields: Object.keys(updateData) },
    });

    return {
      id: org.id,
      name: org.name,
      type: org.type,
      workosOrgId: org.workosOrgId,
      createdAt: org.createdAt,
    };
  }

  async inviteMember(orgId: string, actorUserId: string, email: string, role: string) {
    const parseResult = inviteSchema.safeParse({ email, role });
    if (!parseResult.success) {
      throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: 'Invalid email or role format' } });
    }

    const org = await this.getOrg(orgId);

    const validRoles = ORG_TYPE_ROLES[org.type] || [];
    if (!validRoles.includes(role)) {
      throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: `Role ${role} is invalid for organization type ${org.type}` } });
    }

    // Check if user exists. If so, check if they are already a member.
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      include: { memberships: { where: { orgId } } },
    });

    if (existingUser && existingUser.memberships.length > 0) {
      throw new ConflictException({ error: { code: 'ALREADY_MEMBER', message: 'User is already a member of this organization' } });
    }

    // In a full WorkOS setup, we'd trigger a WorkOS User Invitation here.
    // For MVP, we simulate it.
    const inviteId = `invite_${Math.random().toString(36).substr(2, 9)}`;

    await this.audit.logEvent({
      actorUserId,
      orgId,
      eventType: 'member.invited',
      metadata: { inviteeEmail: email, role },
    });

    return {
      inviteId,
      email,
      role,
      status: 'pending',
    };
  }
}
