import { create } from 'zustand';

export interface Medication {
  name: string;
  dose: string;
  frequency: string;
  note: string;
}

export interface LabValue {
  test: string;
  value: string;
  range: string;
  flag: 'high' | 'low' | 'normal';
}

export interface PatientRecord {
  id: string;
  token: number;
  room: string;
  department: string;
  name: string;
  age: number;
  gender: string;
  abhaId: string;
  mobile: string;
  waitSince: number;
  complaint: {
    symptomLabel: string;
    duration?: string;
    severity?: number;
    associated?: string[];
  };
  ayushAssessment?: {
    prakriti: string;
    agni: string;
    bala: string;
  };
  documents?: {
    scanned: boolean;
    medications: Medication[];
    labValues: LabValue[];
  };
  hpiOverride?: string;
  status: 'waiting' | 'in-consult' | 'pushed';
}

interface KioskState {
  activeView: 'kiosk' | 'physician';
  language: string;
  
  // Current in-progress intake session
  currentPatient: {
    name: string;
    age: number;
    gender: string;
    abhaId: string;
    mobile: string;
    complaintId: string;
    complaintLabel: string;
    complaintIds: string[];
    complaintLabels: string[];
    severity: number;
    duration: string;
    prakriti: string;
    scannedDocs: {
      medications: Medication[];
      labValues: LabValue[];
    };
  };

  // Shared OPD Queue
  queue: PatientRecord[];
  selectedPatientId: string | null;

  // Actions
  setView: (view: 'kiosk' | 'physician') => void;
  setLanguage: (lang: string) => void;
  setComplaint: (id: string, label: string) => void;
  toggleComplaint: (id: string, label: string) => void;
  setAyushData: (prakriti: string) => void;
  setScannedDocuments: (meds: Medication[], labs: LabValue[]) => void;
  completeIntakeAndEnqueue: () => number;
  selectPatient: (id: string) => void;
  amendRecord: (id: string, hpi: string) => void;
  pushToEmr: (id: string) => void;
}

const SEED_QUEUE: PatientRecord[] = [
  {
    id: 'p-101',
    token: 41,
    room: 'Room 2 (Ayush OPD)',
    department: 'Kayachikitsa (Internal Medicine)',
    name: 'Ravi Kumar',
    age: 54,
    gender: 'M',
    abhaId: '91-8842-1923-7712',
    mobile: '+91 98451 23412',
    waitSince: Date.now() - 14 * 60 * 1000,
    complaint: {
      symptomLabel: 'Stomach Pain & Acid Reflux',
      duration: '3 Days',
      severity: 6,
      associated: ['Bloating', 'Loss of appetite', 'Nausea'],
    },
    ayushAssessment: {
      prakriti: 'Pitta-Vata',
      agni: 'Tikshna (Hyperactive)',
      bala: 'Madhyama (Medium)',
    },
    documents: {
      scanned: true,
      medications: [
        { name: 'Sutshekhar Ras', dose: '125mg', frequency: 'BD', note: 'with honey' },
        { name: 'Avipattikar Churna', dose: '3g', frequency: 'HS', note: 'warm water' },
        { name: 'Pantoprazole', dose: '40mg', frequency: 'OD', note: 'empty stomach' },
      ],
      labValues: [
        { test: 'Serum Bilirubin', value: '1.4 mg/dL', range: '0.2 – 1.2 mg/dL', flag: 'high' },
        { test: 'SGPT/ALT', value: '48 U/L', range: '7 – 56 U/L', flag: 'normal' },
      ],
    },
    status: 'waiting',
  },
  {
    id: 'p-102',
    token: 42,
    room: 'Room 4',
    department: 'Cardiology',
    name: 'Sunita Devi',
    age: 62,
    gender: 'F',
    abhaId: '91-4521-9981-4019',
    mobile: '+91 94120 44812',
    waitSince: Date.now() - 6 * 60 * 1000,
    complaint: {
      symptomLabel: 'Chest tightness & Breathlessness',
      duration: '2 Hours',
      severity: 8,
      associated: ['Cold sweats', 'Dizziness'],
    },
    documents: {
      scanned: true,
      medications: [
        { name: 'Amlodipine', dose: '5mg', frequency: 'OD', note: 'morning' },
        { name: 'Atorvastatin', dose: '20mg', frequency: 'HS', note: 'bedtime' },
      ],
      labValues: [
        { test: 'Blood Pressure', value: '168/98 mmHg', range: '120/80 mmHg', flag: 'high' },
        { test: 'Blood Glucose (R)', value: '194 mg/dL', range: '70 – 140 mg/dL', flag: 'high' },
      ],
    },
    status: 'waiting',
  },
];

export const useKioskStore = create<KioskState>((set, get) => ({
  activeView: 'kiosk',
  language: 'hi',

  currentPatient: {
    name: 'Arjun Nair',
    age: 38,
    gender: 'M',
    abhaId: '91-7721-3914-1029',
    mobile: '+91 98112 39011',
    complaintId: 'chest_pain',
    complaintLabel: 'Chest Pain / छाती में दर्द',
    complaintIds: ['chest_pain'],
    complaintLabels: ['Chest Pain / छाती में दर्द'],
    severity: 7,
    duration: '2 Days',
    prakriti: 'Vata-Kapha',
    scannedDocs: {
      medications: [
        { name: 'Metformin', dose: '500mg', frequency: 'BD', note: 'with meals' },
        { name: 'Aspirin', dose: '75mg', frequency: 'OD', note: 'post lunch' },
      ],
      labValues: [
        { test: 'HbA1c', value: '8.4%', range: '4.0 – 5.6%', flag: 'high' },
        { test: 'Fasting Glucose', value: '162 mg/dL', range: '70 – 100 mg/dL', flag: 'high' },
        { test: 'LDL Cholesterol', value: '138 mg/dL', range: '< 100 mg/dL', flag: 'high' },
      ],
    },
  },

  queue: SEED_QUEUE,
  selectedPatientId: 'p-101',

  setView: (view) => set({ activeView: view }),
  setLanguage: (lang) => set({ language: lang }),
  
  setComplaint: (id, label) =>
    set((state) => ({
      currentPatient: {
        ...state.currentPatient,
        complaintId: id,
        complaintLabel: label,
        complaintIds: [id],
        complaintLabels: [label],
      },
    })),

  toggleComplaint: (id, label) =>
    set((state) => {
      const exists = state.currentPatient.complaintIds.includes(id);
      let newIds: string[];
      let newLabels: string[];

      if (exists) {
        // Remove if more than 1 selected, or keep at least 1
        if (state.currentPatient.complaintIds.length > 1) {
          newIds = state.currentPatient.complaintIds.filter((item) => item !== id);
          newLabels = state.currentPatient.complaintLabels.filter((item) => item !== label);
        } else {
          newIds = state.currentPatient.complaintIds;
          newLabels = state.currentPatient.complaintLabels;
        }
      } else {
        newIds = [...state.currentPatient.complaintIds, id];
        newLabels = [...state.currentPatient.complaintLabels, label];
      }

      return {
        currentPatient: {
          ...state.currentPatient,
          complaintId: newIds[0] || id,
          complaintLabel: newLabels.join(', '),
          complaintIds: newIds,
          complaintLabels: newLabels,
        },
      };
    }),

  setAyushData: (prakriti) =>
    set((state) => ({
      currentPatient: { ...state.currentPatient, prakriti },
    })),

  setScannedDocuments: (meds, labs) =>
    set((state) => ({
      currentPatient: {
        ...state.currentPatient,
        scannedDocs: { medications: meds, labValues: labs },
      },
    })),

  completeIntakeAndEnqueue: () => {
    const state = get();
    const nextToken = (state.queue[state.queue.length - 1]?.token || 42) + 1;
    const newRecord: PatientRecord = {
      id: `p-${Date.now()}`,
      token: nextToken,
      room: 'Room 3 (General OPD)',
      department: 'General OPD & Triage',
      name: state.currentPatient.name,
      age: state.currentPatient.age,
      gender: state.currentPatient.gender,
      abhaId: state.currentPatient.abhaId,
      mobile: state.currentPatient.mobile,
      waitSince: Date.now(),
      complaint: {
        symptomLabel: state.currentPatient.complaintLabel,
        duration: state.currentPatient.duration,
        severity: state.currentPatient.severity,
        associated: ['Fatigue', 'Mild Headache'],
      },
      ayushAssessment: {
        prakriti: state.currentPatient.prakriti,
        agni: 'Samagni (Balanced)',
        bala: 'Madhyama',
      },
      documents: {
        scanned: true,
        medications: state.currentPatient.scannedDocs.medications,
        labValues: state.currentPatient.scannedDocs.labValues,
      },
      status: 'waiting',
    };

    set({
      queue: [newRecord, ...state.queue],
      selectedPatientId: newRecord.id,
    });

    return nextToken;
  },

  selectPatient: (id) => set({ selectedPatientId: id }),

  amendRecord: (id, hpi) =>
    set((state) => ({
      queue: state.queue.map((p) =>
        p.id === id ? { ...p, hpiOverride: hpi } : p
      ),
    })),

  pushToEmr: (id) =>
    set((state) => ({
      queue: state.queue.map((p) =>
        p.id === id ? { ...p, status: 'pushed' } : p
      ),
    })),
}));
