export type CohortStatus = 'healthy' | 'pending' | 'archived' | 'error';

export interface Cohort {
  id: string;
  name: string;
  description: string;
  patientCount: number;
  proofsSubmitted: number;
  compensationEarned: string;
  status: CohortStatus;
  createdAt: string;
}

export type ContributionStatus = 'verified' | 'processing' | 'failed';

export interface Contribution {
  id: string;
  cohortId: string;
  actor: string;
  event: string;
  txHash: string;
  disclosedTo: string;
  status: ContributionStatus;
  timestamp: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Node Admin' | 'Compliance Officer' | 'Data Steward' | string;
  status: 'active' | 'invited';
}

export const mockCohorts: Cohort[] = [
  {
    id: 'c_1',
    name: 'Rare Disease Consortium A',
    description: 'Multi-institutional effort pooling verifiable records for ultra-rare oncology.',
    patientCount: 12450,
    proofsSubmitted: 34,
    compensationEarned: '4,500 USDC',
    status: 'healthy',
    createdAt: '2025-10-12T08:00:00Z',
  },
  {
    id: 'c_2',
    name: 'Precision Oncology Baseline',
    description: 'Initial sequence batch for alpha research group, EHDS compliant.',
    patientCount: 4320,
    proofsSubmitted: 12,
    compensationEarned: '1,200 USDC',
    status: 'pending',
    createdAt: '2025-11-05T14:30:00Z',
  },
  {
    id: 'c_3',
    name: 'Cardio Baseline Trial',
    description: 'Cardiology baseline metrics for adult patients 2025. Strict HIPAA/GDPR bounding.',
    patientCount: 38900,
    proofsSubmitted: 89,
    compensationEarned: '12,400 USDC',
    status: 'healthy',
    createdAt: '2025-08-20T09:15:00Z',
  },
  {
    id: 'c_4',
    name: 'Neurology Sync (Failed)',
    description: 'Daily neurology dataset sync with external partner.',
    patientCount: 890,
    proofsSubmitted: 0,
    compensationEarned: '0 USDC',
    status: 'error',
    createdAt: '2025-11-10T10:00:00Z',
  },
];

export const mockContributions: Contribution[] = [
  {
    id: 'cont_1',
    cohortId: 'c_1',
    actor: 'system_agent',
    event: 'Proof of Honest Local Training',
    txHash: '0x8f2a...3b9c',
    disclosedTo: 'None (Zero-Knowledge)',
    status: 'verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'cont_2',
    cohortId: 'c_2',
    actor: 'dr_smith',
    event: 'Eligibility ZK Proof',
    txHash: 'Pending',
    disclosedTo: 'Sponsor CRO',
    status: 'processing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'cont_3',
    cohortId: 'c_3',
    actor: 'automated',
    event: 'Compliance Sync Query',
    txHash: '0x1a4f...9d2e',
    disclosedTo: 'EHDS Regulator',
    status: 'verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export const mockMembers: Member[] = [
  {
    id: 'm_1',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@hospital.org',
    role: 'Node Admin',
    status: 'active',
  },
  {
    id: 'm_2',
    name: 'James Wilson',
    email: 'j.wilson@hospital.org',
    role: 'Compliance Officer',
    status: 'active',
  },
  {
    id: 'm_3',
    name: 'Elena Rostova',
    email: 'elena.r@hospital.org',
    role: 'Data Steward',
    status: 'invited',
  },
];
