import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { CopilotDraftRequest, CopilotDraftResponse, ComplianceCheckRequest, ComplianceCheckResponse, complianceCheckResponseSchema } from '@chorus/types';

@Injectable()
export class CopilotService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

  async getCohortDraft(payload: CopilotDraftRequest): Promise<CopilotDraftResponse> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/v1/copilot/cohort-draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 422) {
        throw new UnprocessableEntityException({ error: { code: 'PII_DETECTED', message: 'Input rejected due to PII detection.' } });
      }

      if (!response.ok) {
        throw new InternalServerErrorException('AI Copilot request failed');
      }

      const data = await response.json();
      
      // Enforce the rule that AI service response is never auto-persisted and requires review
      return {
        suggestedCriteria: (data as any).suggestedCriteria,
        ambiguousFields: (data as any).ambiguousFields || [],
        requiresReview: true
      } as CopilotDraftResponse;
      
    } catch (error) {
      if (error instanceof UnprocessableEntityException) throw error;
      throw new InternalServerErrorException('Failed to communicate with AI service');
    }
  }

  async getComplianceCheck(payload: ComplianceCheckRequest): Promise<ComplianceCheckResponse> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/v1/copilot/compliance-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new InternalServerErrorException('AI Compliance Check failed');
      }

      const data = await response.json();
      
      const parsedData = complianceCheckResponseSchema.safeParse(data);
      if (!parsedData.success) {
        throw new InternalServerErrorException('AI Compliance Check returned invalid data format');
      }

      const validatedResponse = parsedData.data;

      // Flags without a grounded citation are suppressed per Sprint 30 and AI_ARCHITECTURE.md
      validatedResponse.flags = validatedResponse.flags.filter(
        (flag) => flag.citation && flag.citation.trim().length > 0
      );

      return validatedResponse;
      
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      throw new InternalServerErrorException('Failed to communicate with AI service');
    }
  }
}
