import { Test, TestingModule } from '@nestjs/testing';
import { CopilotService } from '../copilot.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('CopilotService - getComplianceCheck', () => {
  let service: CopilotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CopilotService],
    }).compile();

    service = module.get<CopilotService>(CopilotService);

    // Mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw InternalServerErrorException on network failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(
      service.getComplianceCheck({ criteria: {} as any, jurisdiction: 'US' })
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException on invalid schema from AI service', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        flags: [
          {
            severity: 'invalid_severity',
            regulation: 'HIPAA',
            citation: 'Section 1',
            explanation: 'Something',
          },
        ],
      }),
    });

    await expect(
      service.getComplianceCheck({ criteria: {} as any, jurisdiction: 'US' })
    ).rejects.toThrow('AI Compliance Check returned invalid data format');
  });

  it('should filter out ungrounded flags (no citation)', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        flags: [
          {
            severity: 'blocking',
            regulation: 'HIPAA',
            citation: 'Section 1',
            explanation: 'Has citation',
          },
          {
            severity: 'advisory',
            regulation: 'GDPR',
            citation: '',
            explanation: 'Empty citation',
          },
          {
            severity: 'advisory',
            regulation: 'GDPR',
            citation: '   ',
            explanation: 'Whitespace citation',
          },
        ],
      }),
    });

    const result = await service.getComplianceCheck({ criteria: {} as any, jurisdiction: 'US' });

    expect(result.flags).toHaveLength(1);
    expect(result.flags[0].explanation).toBe('Has citation');
  });

  it('should return validated flags', async () => {
    const mockData = {
      flags: [
        {
          severity: 'blocking',
          regulation: 'HIPAA',
          citation: 'Section 1',
          explanation: 'Has citation',
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await service.getComplianceCheck({ criteria: {} as any, jurisdiction: 'US' });

    expect(result).toEqual(mockData);
  });
});
