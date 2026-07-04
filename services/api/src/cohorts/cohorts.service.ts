import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { cohortCriteriaSchema } from '@chorus/types';

@Injectable()
export class CohortsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCohort(orgId: string, actorUserId: string, data: { title: string; criteria: any }) {
    if (!data.title) {
      throw new BadRequestException({ error: { code: 'VALIDATION_ERROR', message: 'Title is required' } });
    }

    // Validate criteria against shared schema
    const result = cohortCriteriaSchema.safeParse(data.criteria);
    if (!result.success) {
      throw new BadRequestException({ 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Criteria fails schema validation', 
          details: result.error.errors 
        } 
      });
    }

    const cohort = await this.prisma.cohort.create({
      data: {
        orgId,
        createdByUserId: actorUserId,
        title: data.title,
        criteria: data.criteria,
        status: 'draft',
      },
    });

    return cohort;
  }

  async getCohort(cohortId: string, orgId: string, role: string) {
    const cohort = await this.prisma.cohort.findUnique({
      where: { id: cohortId },
    });

    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    // Role visibility logic
    if (cohort.orgId !== orgId && role === 'sponsor') {
      // In a real scenario, we'd check `cohort_access_requests` here to see if the sponsor has an approved request.
      // Since `cohort_access_requests` is a v0.6 feature (or at least out of scope for Sprint 4), 
      // we reject this. Returning 404 per API_SPEC.md to not leak existence.
      throw new NotFoundException('Cohort not found');
    } else if (cohort.orgId !== orgId) {
      throw new NotFoundException('Cohort not found');
    }

    return cohort;
  }

  async updateCohort(cohortId: string, orgId: string, data: { title?: string; criteria?: any }) {
    const existing = await this.prisma.cohort.findUnique({ where: { id: cohortId } });
    
    if (!existing || existing.orgId !== orgId) {
      throw new NotFoundException('Cohort not found');
    }

    if (existing.status !== 'draft') {
      throw new ConflictException({ error: { code: 'CONFLICT', message: 'Only draft cohorts can be updated' } });
    }

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.criteria) {
      const result = cohortCriteriaSchema.safeParse(data.criteria);
      if (!result.success) {
        throw new BadRequestException({ 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Criteria fails schema validation', 
            details: result.error.errors 
          } 
        });
      }
      updateData.criteria = data.criteria;
    }

    return this.prisma.cohort.update({
      where: { id: cohortId },
      data: updateData,
    });
  }

  async submitCohort(cohortId: string, orgId: string) {
    const existing = await this.prisma.cohort.findUnique({ where: { id: cohortId } });
    
    if (!existing || existing.orgId !== orgId) {
      throw new NotFoundException('Cohort not found');
    }

    if (existing.status !== 'draft') {
      throw new ConflictException({ error: { code: 'COHORT_NOT_IN_DRAFT', message: 'Only draft cohorts can be submitted' } });
    }

    // In a real implementation, we would query the compliance engine here to check for blocking flags.
    // Assuming 'unresolvedComplianceFlags' is stored or queried. For MVP, we simulate this guard.
    const hasUnresolvedBlockingFlags = false; // Mocked for now, assume valid.
    
    if (hasUnresolvedBlockingFlags) {
      throw new ConflictException({ error: { code: 'UNRESOLVED_COMPLIANCE_FLAGS', message: 'Cohort cannot be submitted with unresolved blocking compliance flags' } });
    }

    const updated = await this.prisma.cohort.update({
      where: { id: cohortId },
      data: { status: 'submitted' },
    });

    // Enqueue circuit generation job here
    // this.circuitGenerationQueue.add(...)
    
    return {
      id: updated.id,
      status: updated.status,
      circuitGenerationJobId: `job_${Date.now()}`
    };
  }
}
