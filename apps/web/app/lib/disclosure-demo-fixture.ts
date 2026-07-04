// Static, fictional cohort record backing the demo — this is a non-real status fixture.
// It never touches a live API or real data, enforcing the unauthenticated boundary of apps/web.

export type DisclosureView = 'hospital' | 'sponsor' | 'regulator'

export interface DemoField {
  label: string
  hospitalValue: string
  sponsorValue: string | null // null means fully redacted for this view
  regulatorValue: string | null
}

export const demoFixture: DemoField[] = [
  {
    label: 'Patient Count',
    hospitalValue: '1,492',
    sponsorValue: '1,000 - 5,000', // Size range instead of exact count
    regulatorValue: null
  },
  {
    label: 'Diagnosis Code',
    hospitalValue: 'ICD-10-CM E84.0', // Cystic Fibrosis with pulmonary manifestations
    sponsorValue: 'ICD-10-CM E84.0',
    regulatorValue: null
  },
  {
    label: 'Demographics',
    hospitalValue: 'Age: 18-35, Female',
    sponsorValue: 'Age: 18-35, Female',
    regulatorValue: null
  },
  {
    label: 'Verification Proof ID',
    hospitalValue: '0x8f2a...3b9c',
    sponsorValue: '0x8f2a...3b9c',
    regulatorValue: '0x8f2a...3b9c'
  },
  {
    label: 'Compliance Check',
    hospitalValue: 'Cleared (No Article 9 flags)',
    sponsorValue: null,
    regulatorValue: 'Cleared (No Article 9 flags)'
  },
  {
    label: 'Timestamp',
    hospitalValue: '2026-07-04T14:32:01Z',
    sponsorValue: '2026-07-04T14:32:01Z',
    regulatorValue: '2026-07-04T14:32:01Z'
  }
]
