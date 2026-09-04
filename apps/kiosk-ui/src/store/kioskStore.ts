import { create } from "zustand";
import { Complaint, RedFlag, ClinicalSummary, Patient, PatientVitals, MedicalTimelineEvent } from "@/models";
import { routePatientToOPD } from "@/rules/triageRules";
import { determineAyushProfile } from "@/rules/ayushRules";
import { RedFlagDetectionModule } from "@/modules/red-flags";
import { ClinicalSummaryGenerationModule } from "@/modules/summary-generation";
import { IntegrationModule } from "@/modules/integration";
import { PersistenceService } from "@/services/persistence/persistenceService";

export interface Medication {
  id?: string;
  name: string;
  dose: string;
  frequency: string;
  note: string;
  confidence?: number;
  source?: 'ocr' | 'reported';
}

export interface LabValue {
  id?: string;
  test: string;
  value: string;
  range: string;
  flag: 'high' | 'low' | 'normal';
  confidence?: number;
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
  vitals?: PatientVitals;
  complaint: {
    symptomLabel: string;
    anatomicalRegion?: string;
    duration?: string;
    severity?: number;
    onset?: string;
    character?: string;
    radiation?: string;
    associated?: string[];
    aggravatingFactors?: string[];
    relievingFactors?: string[];
  };
  ayushAssessment?: {
    prakriti: string;
    agni: string;
    bala: string;
    koshtha?: string;
    satmya?: string;
  };
  documents?: {
    scanned: boolean;
    medications: Medication[];
    labValues: LabValue[];
  };
  hpiOverride?: string;
  pastHistory?: {
    medical: string[];
    surgical: string[];
  };
  allergies?: string[];
  familyHistory?: string[];
  personalHistory?: {
    diet: string;
    smoking: string;
    alcohol: string;
    sleep: string;
    bowelBladder: string;
  };
  medicalTimeline?: MedicalTimelineEvent[];
  redFlags?: RedFlag[];
  clinicalSummary?: ClinicalSummary;
  reviewStatus: 'ai_draft' | 'doctor_verified' | 'doctor_rejected' | 'reinterview_requested';
  verifiedBy?: string;
  verifiedAt?: number;
  rejectionReason?: string;
  reinterviewNotes?: string;
  status: 'waiting' | 'in-consult' | 'completed' | 'rejected' | 'reinterview' | 'pushed';
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
  updatePatientRecord: (id: string, updates: Partial<PatientRecord>) => void;
  confirmPatient: (id: string, doctorName?: string) => void;
  rejectPatient: (id: string, reason: string) => void;
  requestReinterview: (id: string, notes: string) => void;
  pushToEmr: (id: string) => void;
}

const SEED_QUEUE: PatientRecord[] = [
  {
    id: 'p-102',
    token: 42,
    room: 'Room 1 (Red Flag Emergency)',
    department: 'Cardiology Triage',
    name: 'Sunita Devi',
    age: 62,
    gender: 'F',
    abhaId: '91-4521-9981-4019',
    mobile: '+91 94120 44812',
    waitSince: Date.now() - 6 * 60 * 1000,
    vitals: {
      bp: '168/98 mmHg',
      pulse: 104,
      temp: 98.6,
      spO2: 93,
      respiratoryRate: 24
    },
    complaint: {
      symptomLabel: 'Chest tightness & Breathlessness',
      anatomicalRegion: 'chest_heart_lungs',
      duration: '2 Hours',
      severity: 8,
      onset: 'Sudden onset while climbing stairs',
      character: 'Crushing retrosternal tightness with heavy squeezing pressure',
      radiation: 'Radiating to left inner arm, shoulder blade, and lower jaw',
      associated: ['Severe cold sweats (Diaphoresis)', 'Dizziness', 'Mild nausea'],
      aggravatingFactors: ['Exertion', 'Deep inspiration'],
      relievingFactors: ['Rest (Minimal relief)']
    },
    ayushAssessment: {
      prakriti: 'Vata-Pitta',
      agni: 'Vishamagni (Irregular)',
      bala: 'Avara (Diminished)',
      koshtha: 'Madhyama'
    },
    documents: {
      scanned: true,
      medications: [
        { id: 'm1', name: 'Amlodipine', dose: '5mg', frequency: 'OD', note: 'morning, post-meal', confidence: 0.96, source: 'ocr' },
        { id: 'm2', name: 'Metformin HCl', dose: '500mg', frequency: 'BD', note: 'with meals', confidence: 0.94, source: 'ocr' },
        { id: 'm3', name: 'Atorvastatin', dose: '20mg', frequency: 'HS', note: 'at bedtime', confidence: 0.93, source: 'ocr' }
      ],
      labValues: [
        { id: 'l1', test: 'Blood Pressure', value: '168/98 mmHg', range: '120/80 mmHg', flag: 'high', confidence: 0.98 },
        { id: 'l2', test: 'Blood Glucose (R)', value: '194 mg/dL', range: '70 – 140 mg/dL', flag: 'high', confidence: 0.96 },
        { id: 'l3', test: 'Serum Creatinine', value: '1.1 mg/dL', range: '0.6 – 1.2 mg/dL', flag: 'normal', confidence: 0.94 }
      ]
    },
    pastHistory: {
      medical: ['Hypertension (6 years, on Tab Amlodipine)', 'Type 2 Diabetes Mellitus (8 years)', 'Dyslipidemia'],
      surgical: ['Tubal Ligation (1998)']
    },
    allergies: [
      'Penicillin (Cutaneous rash, facial angioedema risk)'
    ],
    familyHistory: [
      'Mother: Coronary Artery Disease with Acute MI at age 58',
      'Father: Ischemic Stroke at age 66'
    ],
    personalHistory: {
      diet: 'Vegetarian (High sodium diet)',
      smoking: 'Never smoker',
      alcohol: 'Non-drinker',
      sleep: 'Disturbed for past 2 nights due to orthopnea',
      bowelBladder: 'Regular bowel movements; no hematuria or dysuria'
    },
    medicalTimeline: [
      {
        id: 't-1',
        date: '2026-06-14',
        type: 'visit',
        title: 'Cardiology Follow-up OPD',
        facility: 'AIIMS Delhi - Outpatient Dept',
        details: 'Hypertension evaluation. BP recorded 142/88. Advised continuing Amlodipine 5mg OD.',
        doctor: 'Dr. V. Raman, MD'
      },
      {
        id: 't-2',
        date: '2025-11-20',
        type: 'lab',
        title: 'Comprehensive Metabolic Panel & Lipid Profile',
        facility: 'Dr. Lal PathLabs',
        details: 'HbA1c: 7.8% (Elevated), Fasting Glucose: 148 mg/dL, Total Cholesterol: 212 mg/dL, LDL: 136 mg/dL.',
        status: 'Abnormal'
      },
      {
        id: 't-3',
        date: '2024-03-10',
        type: 'admission',
        title: 'Emergency Inpatient Admission (Hypertensive Urgency)',
        facility: 'Safdarjung Hospital, New Delhi',
        details: 'Admitted for 72h with symptomatic BP 190/110 mmHg. IV Labetalol administered, stabilized and discharged.',
        doctor: 'Dr. S. K. Mehra'
      }
    ],
    redFlags: [
      {
        id: 'rf-102',
        sessionId: 'sess-102',
        severity: 'emergency_code_red',
        condition: 'Chest pain + breathlessness + severe sweating',
        clinicalRationale: 'Potential emergency symptoms reported — urgent clinical assessment recommended.',
        triggeredAt: Date.now() - 6 * 60 * 1000,
        acknowledged: false
      }
    ],
    reviewStatus: 'ai_draft',
    status: 'waiting'
  },
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
    vitals: {
      bp: '128/82 mmHg',
      pulse: 76,
      temp: 98.4,
      spO2: 99,
      respiratoryRate: 16
    },
    complaint: {
      symptomLabel: 'Stomach Pain & Acid Reflux',
      anatomicalRegion: 'stomach_abdomen',
      duration: '3 Days',
      severity: 6,
      onset: 'Gradual onset, worsening after dinner',
      character: 'Burning epigastric pain with acid regurgitation and sour belching',
      radiation: 'Retrosternal radiation up to the throat',
      associated: ['Bloating', 'Loss of appetite', 'Morning nausea'],
      aggravatingFactors: ['Spicy food', 'Fried snacks', 'Late night meals'],
      relievingFactors: ['Cold milk', 'Antacid liquid']
    },
    ayushAssessment: {
      prakriti: 'Pitta-Vata',
      agni: 'Tikshna (Hyperactive / Acidic)',
      bala: 'Madhyama (Medium)',
      koshtha: 'Krura (Tendency to constipation)'
    },
    documents: {
      scanned: true,
      medications: [
        { id: 'm1', name: 'Sutshekhar Ras', dose: '125mg', frequency: 'BD', note: 'with honey', confidence: 0.95, source: 'ocr' },
        { id: 'm2', name: 'Avipattikar Churna', dose: '3g', frequency: 'HS', note: 'warm water', confidence: 0.96, source: 'ocr' },
        { id: 'm3', name: 'Pantoprazole', dose: '40mg', frequency: 'OD', note: 'empty stomach', confidence: 0.98, source: 'ocr' }
      ],
      labValues: [
        { id: 'l1', test: 'Serum Bilirubin', value: '1.4 mg/dL', range: '0.2 – 1.2 mg/dL', flag: 'high', confidence: 0.94 },
        { id: 'l2', test: 'SGPT/ALT', value: '48 U/L', range: '7 – 56 U/L', flag: 'normal', confidence: 0.96 }
      ]
    },
    pastHistory: {
      medical: ['Gastroesophageal Reflux Disease (GERD) - 3 years', 'Mild Fatty Liver Grade I'],
      surgical: ['Appendectomy (2012)']
    },
    allergies: [
      'No Known Drug Allergies (NKDA)'
    ],
    familyHistory: [
      'Father: Chronic Peptic Ulcer Disease',
      'Brother: Essential Hypertension'
    ],
    personalHistory: {
      diet: 'Non-Vegetarian (Spicy curries, irregular eating timings)',
      smoking: 'Ex-smoker (Quit in 2020 after 8 pack-years)',
      alcohol: 'Occasional social drinking (1-2 units/month)',
      sleep: '6 hours/night; frequent awakenings from reflux',
      bowelBladder: 'Koshtha: Krura; bowel movement every alternate day'
    },
    medicalTimeline: [
      {
        id: 't-1',
        date: '2026-01-18',
        type: 'visit',
        title: 'Kayachikitsa OPD Consultation',
        facility: 'All India Institute of Ayurveda (AIIA), New Delhi',
        details: 'Evaluated for Amlapitta (Hyperacidity). Prescribed Avipattikar Churna and Pitta-shamak diet chart.',
        doctor: 'Dr. P. Joshi, BAMS, MD (Ay)'
      },
      {
        id: 't-2',
        date: '2025-10-05',
        type: 'lab',
        title: 'Ultrasound Whole Abdomen',
        facility: 'Mahajan Imaging Center',
        details: 'USG findings: Diffuse Grade I hepatic steatosis (Fatty Liver). Gallbladder, pancreas, spleen normal. No gallstones.',
        status: 'Normal'
      },
      {
        id: 't-3',
        date: '2024-08-14',
        type: 'lab',
        title: 'Liver Function Test (LFT)',
        facility: 'Metropolis Healthcare',
        details: 'Serum Bilirubin: 1.3 mg/dL, SGOT: 38 U/L, SGPT: 44 U/L, Alkaline Phosphatase: 92 U/L.',
        status: 'Normal'
      }
    ],
    redFlags: [],
    reviewStatus: 'ai_draft',
    status: 'waiting'
  },
  {
    id: 'p-103',
    token: 39,
    room: 'Room 5 (Shalakya OPD)',
    department: 'Shalakya Tantra (ENT & Head)',
    name: 'Meera Patel',
    age: 29,
    gender: 'F',
    abhaId: '91-3144-8821-6502',
    mobile: '+91 97182 89012',
    waitSince: Date.now() - 48 * 60 * 1000,
    vitals: {
      bp: '116/74 mmHg',
      pulse: 72,
      temp: 98.2,
      spO2: 99,
      respiratoryRate: 14
    },
    complaint: {
      symptomLabel: 'Unilateral Throbbing Headache',
      anatomicalRegion: 'head_brain',
      duration: '1 Day',
      severity: 5,
      onset: 'Gradual, started right fronto-temporal',
      character: 'Pulsating, throbbing hemicranial ache',
      associated: ['Photophobia', 'Phonophobia'],
      aggravatingFactors: ['Bright sunlight', 'Computer screens'],
      relievingFactors: ['Dark quiet room', 'Cold compress']
    },
    ayushAssessment: {
      prakriti: 'Pitta-Kapha',
      agni: 'Samagni (Balanced)',
      bala: 'Madhyama (Medium)',
      koshtha: 'Mridu'
    },
    documents: {
      scanned: true,
      medications: [
        { id: 'm1', name: 'Shirashoolavajra Ras', dose: '250mg', frequency: 'BD', note: 'with cow ghee', confidence: 0.96, source: 'ocr' },
        { id: 'm2', name: 'Naproxen', dose: '250mg', frequency: 'SOS', note: 'after food', confidence: 0.98, source: 'ocr' }
      ],
      labValues: []
    },
    pastHistory: {
      medical: ['Migraine without aura (4 years)'],
      surgical: ['None']
    },
    allergies: [
      'Sulfa drugs (Skin erythema & pruritus)'
    ],
    familyHistory: [
      'Mother: Migraine with aura'
    ],
    personalHistory: {
      diet: 'Lacto-Vegetarian',
      smoking: 'Never',
      alcohol: 'Never',
      sleep: 'Irregular (6 hours), daily screen exposure > 9h',
      bowelBladder: 'Normal'
    },
    medicalTimeline: [
      {
        id: 't-1',
        date: '2026-09-04',
        type: 'visit',
        title: 'Consultation Completed & Verified',
        facility: 'AIIA Shalakya OPD',
        details: 'Clinical intake verified by Dr. Anand Sharma. Commenced Nasya therapy (Anu Taila) and Pathyadi Kwath.',
        doctor: 'Dr. Anand Sharma, MD (Reg #DMC-49210)'
      },
      {
        id: 't-2',
        date: '2025-07-22',
        type: 'lab',
        title: 'Magnetic Resonance Imaging (MRI) Brain',
        facility: 'Fortis Healthcare',
        details: 'Brain MRI without contrast: Normal study. No intracranial mass, bleed, or vascular malformation.',
        status: 'Normal'
      }
    ],
    redFlags: [],
    reviewStatus: 'doctor_verified',
    verifiedBy: 'Dr. Anand Sharma, MD (Reg #DMC-49210)',
    verifiedAt: Date.now() - 40 * 60 * 1000,
    status: 'completed'
  },
  {
    id: 'p-104',
    token: 43,
    room: 'Room 3 (Shalya Tantra)',
    department: 'Shalya Tantra (Orthopedics / Spine)',
    name: 'Vikram Singh',
    age: 48,
    gender: 'M',
    abhaId: '91-6288-4491-1002',
    mobile: '+91 99201 88321',
    waitSince: Date.now() - 3 * 60 * 1000,
    vitals: {
      bp: '134/86 mmHg',
      pulse: 80,
      temp: 98.5,
      spO2: 98,
      respiratoryRate: 18
    },
    complaint: {
      symptomLabel: 'Chronic Lower Back Pain with Lumbar Stiffness',
      anatomicalRegion: 'back_spine',
      duration: '3 Weeks',
      severity: 6,
      onset: 'Insidious, aggravated by prolonged sitting',
      character: 'Dull aching stiffness with morning tightness',
      radiation: 'Radiation to right posterior thigh up to knee',
      associated: ['Difficulty standing upright after prolonged sitting'],
      aggravatingFactors: ['Forward bending', 'Lifting weights'],
      relievingFactors: ['Lying supine with knee flexion', 'Hot fomentation']
    },
    ayushAssessment: {
      prakriti: 'Vata',
      agni: 'Vishamagni',
      bala: 'Madhyama',
      koshtha: 'Madhyama'
    },
    documents: {
      scanned: true,
      medications: [
        { id: 'm1', name: 'Yograj Guggulu', dose: '500mg', frequency: 'BD', note: 'after food with warm water', confidence: 0.94, source: 'ocr' },
        { id: 'm2', name: 'Paracetamol', dose: '650mg', frequency: 'SOS', note: 'for severe ache', confidence: 0.97, source: 'ocr' }
      ],
      labValues: []
    },
    pastHistory: {
      medical: ['Lumbar disc desiccation L4-L5', 'Chronic mechanical back pain'],
      surgical: ['None']
    },
    allergies: [
      'No Known Drug Allergies (NKDA)'
    ],
    familyHistory: [
      'Father: Severe Lumbar Spondylosis'
    ],
    personalHistory: {
      diet: 'Mixed diet',
      smoking: 'Active smoker (4-5 bidis/day)',
      alcohol: 'Occasional',
      sleep: 'Interrupted by back pain when turning in bed',
      bowelBladder: 'Normal'
    },
    medicalTimeline: [
      {
        id: 't-1',
        date: '2026-02-12',
        type: 'visit',
        title: 'Panchakarma OPD Consultation',
        facility: 'AIIA Panchakarma Dept',
        details: 'Completed 7-day Kati Basti with Sahacharadi Taila. Moderate relief in stiffness reported.',
        doctor: 'Dr. M. K. Rao'
      },
      {
        id: 't-2',
        date: '2025-09-15',
        type: 'lab',
        title: 'Digital X-Ray Lumbosacral Spine (AP & Lateral)',
        facility: 'City Diagnostic Centre',
        details: 'Mild reduction of L4-L5 intervertebral disc space. Small marginal osteophytes noted.',
        status: 'Abnormal'
      }
    ],
    redFlags: [],
    reviewStatus: 'ai_draft',
    status: 'waiting'
  }
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
        { name: 'Metformin', dose: '500mg', frequency: 'BD', note: 'with meals', confidence: 0.94, source: 'ocr' },
        { name: 'Aspirin', dose: '75mg', frequency: 'OD', note: 'post lunch', confidence: 0.95, source: 'ocr' },
      ],
      labValues: [
        { test: 'HbA1c', value: '8.4%', range: '4.0 – 5.6%', flag: 'high', confidence: 0.96 },
        { test: 'Fasting Glucose', value: '162 mg/dL', range: '70 – 100 mg/dL', flag: 'high', confidence: 0.95 },
        { test: 'LDL Cholesterol', value: '138 mg/dL', range: '< 100 mg/dL', flag: 'high', confidence: 0.93 },
      ],
    },
  },

  queue: SEED_QUEUE,
  selectedPatientId: 'p-102',

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
      let newIds;
      let newLabels;

      if (exists) {
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
    const nextToken = (state.queue[state.queue.length - 1]?.token || 43) + 1;
    
    // 1. Map Complaints to Domain Models
    const complaintsList: Complaint[] = state.currentPatient.complaintIds.map((id, idx) => ({
      id,
      anatomicalRegion: id,
      labelHi: state.currentPatient.complaintLabels[idx] || id,
      labelEn: id,
      severity: state.currentPatient.severity,
      duration: state.currentPatient.duration
    }));

    // 2. Rule Engine Evaluation (Triage + Red Flags + AYUSH)
    const triage = routePatientToOPD(complaintsList);
    const { redFlags, isEmergency } = RedFlagDetectionModule.analyze(
      "sess-" + Date.now(),
      complaintsList
    );
    const ayushProfile = determineAyushProfile(state.currentPatient.prakriti);

    // 3. Clinical Summary Draft (Strict AI Governance: isAiDraft is true)
    const draftSummary = ClinicalSummaryGenerationModule.buildDraftSummary({
      patient: {
        id: "p-" + Date.now(),
        name: state.currentPatient.name,
        age: state.currentPatient.age,
        gender: state.currentPatient.gender,
        abhaId: state.currentPatient.abhaId
      },
      sessionId: "sess-" + Date.now(),
      tokenNumber: nextToken,
      complaints: complaintsList,
      ayushAssessment: ayushProfile,
      medications: state.currentPatient.scannedDocs.medications.map((m, idx) => ({
        id: "med-" + idx,
        category: "medication",
        name: m.name,
        dosage: m.dose,
        frequency: m.frequency,
        note: m.note,
        confidence: m.confidence || 0.94,
        isVerifiedByDoctor: false
      })),
      labs: state.currentPatient.scannedDocs.labValues.map((l, idx) => ({
        id: "lab-" + idx,
        category: "lab_biomarker",
        name: l.test,
        value: l.value,
        referenceRange: l.range,
        abnormalFlag: l.flag,
        confidence: l.confidence || 0.96,
        isVerifiedByDoctor: false
      })),
      redFlags,
      assignedRoom: isEmergency ? "Room 1 (Red Flag Emergency)" : triage.room,
      assignedDepartment: isEmergency ? "Emergency Triage" : triage.department,
      estimatedWaitMinutes: isEmergency ? 2 : triage.estimatedWaitMinutes
    });

    const newRecord: PatientRecord = {
      id: draftSummary.patientId,
      token: nextToken,
      room: draftSummary.assignedRoom,
      department: draftSummary.assignedDepartment,
      name: state.currentPatient.name,
      age: state.currentPatient.age,
      gender: state.currentPatient.gender,
      abhaId: state.currentPatient.abhaId,
      mobile: state.currentPatient.mobile,
      waitSince: Date.now(),
      vitals: {
        bp: isEmergency ? '154/96 mmHg' : '124/80 mmHg',
        pulse: isEmergency ? 98 : 78,
        temp: 98.6,
        spO2: isEmergency ? 95 : 99,
        respiratoryRate: isEmergency ? 22 : 16
      },
      complaint: {
        symptomLabel: state.currentPatient.complaintLabel,
        anatomicalRegion: state.currentPatient.complaintId,
        duration: state.currentPatient.duration,
        severity: state.currentPatient.severity,
        associated: ["Fatigue", "Mild headache"],
        onset: "Recent onset",
        character: "Persistent discomfort",
        radiation: "Localized",
        aggravatingFactors: ["Exertion"],
        relievingFactors: ["Rest"]
      },
      ayushAssessment: {
        prakriti: ayushProfile.prakriti,
        agni: ayushProfile.agni,
        bala: ayushProfile.bala,
        koshtha: 'Madhyama'
      },
      documents: {
        scanned: true,
        medications: state.currentPatient.scannedDocs.medications,
        labValues: state.currentPatient.scannedDocs.labValues,
      },
      pastHistory: {
        medical: ['No prior chronic medical conditions reported'],
        surgical: ['No prior surgical history']
      },
      allergies: [
        'No Known Drug Allergies (NKDA)'
      ],
      familyHistory: [
        'Non-contributory family medical history'
      ],
      personalHistory: {
        diet: 'Balanced mixed diet',
        smoking: 'Non-smoker',
        alcohol: 'Non-drinker',
        sleep: '7-8 hours restful sleep',
        bowelBladder: 'Normal regular habits'
      },
      medicalTimeline: [
        {
          id: "t-" + Date.now(),
          date: new Date().toISOString().split('T')[0],
          type: 'visit',
          title: 'Kiosk Intake Session Completed',
          facility: 'AIIA MediKiosk Self-Service Station',
          details: "Autonomous clinical intake completed for " + state.currentPatient.complaintLabel + ". AI-drafted record generated.",
          status: 'Triage Ready'
        }
      ],
      redFlags,
      clinicalSummary: draftSummary,
      reviewStatus: "ai_draft",
      status: "waiting",
    };

    const newQueue = [newRecord, ...state.queue];
    set({
      queue: newQueue,
      selectedPatientId: newRecord.id,
    });

    PersistenceService.saveQueueLocal(newQueue);
    return nextToken;
  },

  selectPatient: (id) => set({ selectedPatientId: id }),

  amendRecord: (id, hpi) =>
    set((state) => {
      const updatedQueue = state.queue.map((p) =>
        p.id === id ? { ...p, hpiOverride: hpi } : p
      );
      PersistenceService.saveQueueLocal(updatedQueue);
      return { queue: updatedQueue };
    }),

  updatePatientRecord: (id, updates) =>
    set((state) => {
      const updatedQueue = state.queue.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      PersistenceService.saveQueueLocal(updatedQueue);
      return { queue: updatedQueue };
    }),

  confirmPatient: (id, doctorName = "Dr. Anand Sharma, MD (Reg #DMC-49210)") =>
    set((state) => {
      const updatedQueue = state.queue.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          reviewStatus: "doctor_verified" as const,
          verifiedBy: doctorName,
          verifiedAt: Date.now(),
          status: "completed" as const,
          clinicalSummary: p.clinicalSummary
            ? {
                ...p.clinicalSummary,
                isAiDraft: false,
                status: "physician_reviewed" as const,
                reviewedAt: Date.now(),
                reviewedBy: doctorName,
              }
            : undefined,
        };
      });
      PersistenceService.saveQueueLocal(updatedQueue);
      return { queue: updatedQueue };
    }),

  rejectPatient: (id, reason) =>
    set((state) => {
      const updatedQueue = state.queue.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          reviewStatus: "doctor_rejected" as const,
          rejectionReason: reason,
          status: "rejected" as const,
          clinicalSummary: p.clinicalSummary
            ? {
                ...p.clinicalSummary,
                status: "physician_rejected" as const,
                reviewedAt: Date.now(),
              }
            : undefined,
        };
      });
      PersistenceService.saveQueueLocal(updatedQueue);
      return { queue: updatedQueue };
    }),

  requestReinterview: (id, notes) =>
    set((state) => {
      const updatedQueue = state.queue.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          reviewStatus: "reinterview_requested" as const,
          reinterviewNotes: notes,
          status: "reinterview" as const,
        };
      });
      PersistenceService.saveQueueLocal(updatedQueue);
      return { queue: updatedQueue };
    }),

  pushToEmr: (id) => {
    const state = get();
    const record = state.queue.find(p => p.id === id);
    if (record) {
      const patientModel: Patient = {
        id: record.id,
        name: record.name,
        age: record.age,
        gender: (record.gender === "F" ? "F" : "M"),
        abhaId: record.abhaId,
        mobile: record.mobile,
        registeredAt: record.waitSince
      };
      
      const summaryModel = record.clinicalSummary || ClinicalSummaryGenerationModule.buildDraftSummary({
        patient: patientModel,
        sessionId: "sess-" + record.id,
        tokenNumber: record.token,
        complaints: [{
          id: "c1",
          anatomicalRegion: record.complaint.anatomicalRegion || "general",
          labelHi: record.complaint.symptomLabel,
          labelEn: record.complaint.symptomLabel,
          severity: record.complaint.severity || 5
        }],
        medications: (record.documents?.medications || []).map((m, idx) => ({
          id: "m-" + idx,
          category: "medication",
          name: m.name,
          dosage: m.dose,
          frequency: m.frequency,
          note: m.note,
          confidence: m.confidence || 0.95,
          isVerifiedByDoctor: record.reviewStatus === "doctor_verified"
        })),
        labs: (record.documents?.labValues || []).map((l, idx) => ({
          id: "l-" + idx,
          category: "lab_biomarker",
          name: l.test,
          value: l.value,
          referenceRange: l.range,
          abnormalFlag: l.flag,
          confidence: l.confidence || 0.96,
          isVerifiedByDoctor: record.reviewStatus === "doctor_verified"
        })),
        redFlags: record.redFlags || [],
        assignedRoom: record.room,
        assignedDepartment: record.department,
        estimatedWaitMinutes: 8
      });

      const fhirBundle = IntegrationModule.generateAbdmBundle(patientModel, summaryModel);
      console.log("[ABDM Integration] Generated HL7 FHIR R4 Bundle:", fhirBundle);
    }

    set((state) => {
      const updatedQueue = state.queue.map((p) =>
        p.id === id ? { ...p, status: "pushed" as const, reviewStatus: "doctor_verified" as const } : p
      );
      PersistenceService.saveQueueLocal(updatedQueue);
      return { queue: updatedQueue };
    });
  },
}));
