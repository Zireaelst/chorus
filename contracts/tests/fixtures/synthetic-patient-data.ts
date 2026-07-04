/**
 * SYNTHETIC PATIENT DATA FIXTURE
 * 
 * WARNING: This data is 100% synthetically generated for cryptographic testing and external audit.
 * It contains NO real patient data and does not structurally represent any real institution's dataset.
 * It must not be deployed or connected to any real hospital infrastructure.
 */

export interface SyntheticPatient {
    id: string;
    age: number;
    hasDiagnosisX: boolean;
    hasPriorTreatmentY: boolean;
    featureVector: number[]; // Used for mock local training
}

export const SYNTHETIC_COHORT_DATA: SyntheticPatient[] = [
    { id: "synth_1", age: 34, hasDiagnosisX: true, hasPriorTreatmentY: false, featureVector: [0.1, 0.4, 0.2] },
    { id: "synth_2", age: 45, hasDiagnosisX: true, hasPriorTreatmentY: false, featureVector: [0.2, 0.5, 0.1] },
    { id: "synth_3", age: 29, hasDiagnosisX: false, hasPriorTreatmentY: false, featureVector: [0.9, 0.1, 0.3] },
    { id: "synth_4", age: 52, hasDiagnosisX: true, hasPriorTreatmentY: true, featureVector: [0.4, 0.2, 0.8] },
    { id: "synth_5", age: 41, hasDiagnosisX: true, hasPriorTreatmentY: false, featureVector: [0.3, 0.6, 0.1] }
];
