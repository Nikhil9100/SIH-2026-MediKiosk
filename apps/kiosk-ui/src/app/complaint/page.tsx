"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  HeadAnatomyIcon, 
  ChestHeartLungsIcon, 
  StomachDigestiveIcon, 
  SpineBackIcon,
  KneeJointIcon,
  ThroatNeckIcon,
  ArmShoulderIcon,
  FeverVitalsIcon,
  MicIcon 
} from "@/components/icons";
import { useKioskStore } from "@/store/kioskStore";
import { cn } from "@/lib/utils";
import { Flame, Check, Volume2, X } from "lucide-react";

// 8 Anatomically Accurate Body Regions with clinical descriptions
const BODY_REGIONS = [
  { 
    id: "head_brain", 
    labelHi: "सिर / मस्तिष्क", 
    labelEn: "Head & Brain", 
    subtext: "Headache, Migraine, Dizziness",
    icon: HeadAnatomyIcon,
    snomed: "SCTID: 25064002"
  },
  { 
    id: "throat_neck", 
    labelHi: "गला एवं श्वासनली", 
    labelEn: "Throat & Neck", 
    subtext: "Sore Throat, Laryngitis, Thyroid",
    icon: ThroatNeckIcon,
    snomed: "SCTID: 162397003"
  },
  { 
    id: "chest_heart_lungs", 
    labelHi: "छाती / हृदय एवं फेफड़े", 
    labelEn: "Chest, Heart & Lungs", 
    subtext: "Chest Pain, Dyspnea, Cough",
    icon: ChestHeartLungsIcon,
    snomed: "SCTID: 29857009"
  },
  { 
    id: "stomach_abdomen", 
    labelHi: "पेट / पाचन तंत्र", 
    labelEn: "Stomach & Digestion", 
    subtext: "Abdominal Pain, Acidity, Nausea",
    icon: StomachDigestiveIcon,
    snomed: "SCTID: 21522001"
  },
  { 
    id: "spine_back", 
    labelHi: "रीढ़ की हड्डी एवं पीठ", 
    labelEn: "Spine & Back", 
    subtext: "Lumbar Pain, Sciatica, Stiffness",
    icon: SpineBackIcon,
    snomed: "SCTID: 279039007"
  },
  { 
    id: "arm_shoulder", 
    labelHi: "कंधा, हाथ एवं कलाई", 
    labelEn: "Shoulders, Arms & Hands", 
    subtext: "Rotator Cuff, Joint Strain, Numbness",
    icon: ArmShoulderIcon,
    snomed: "SCTID: 53120007"
  },
  { 
    id: "knee_joint", 
    labelHi: "घुटने एवं संधि (जोड़)", 
    labelEn: "Knees & Leg Joints", 
    subtext: "Arthritis, Swelling, Ligament",
    icon: KneeJointIcon,
    snomed: "SCTID: 30989003"
  },
  { 
    id: "fever_vitals", 
    labelHi: "बुखार एवं संपूर्ण शरीर", 
    labelEn: "Fever & Systemic", 
    subtext: "High Temp, Chills, Body Ache",
    icon: FeverVitalsIcon,
    snomed: "SCTID: 386661006"
  },
];

const PRAKRITI_TYPES = [
  { id: "Vata", label: "वात (Vata)", desc: "Dry, cold, light (वायु / Kinetic Energy)" },
  { id: "Pitta", label: "पित्त (Pitta)", desc: "Hot, sharp, metabolic (अग्नि / Metabolism)" },
  { id: "Kapha", label: "कफ (Kapha)", desc: "Heavy, cool, stability (जल-पृथ्वी / Structure)" },
];

export default function ChiefComplaintScreen() {
  const router = useRouter();
  const { currentPatient, toggleComplaint, setAyushData } = useKioskStore();
  const [selectedIds, setSelectedIds] = useState<string[]>(currentPatient.complaintIds || ["chest_heart_lungs"]);
  const [severity, setSeverity] = useState<number>(currentPatient.severity || 6);
  const [prakriti, setPrakriti] = useState<string>(currentPatient.prakriti || "Vata-Pitta");
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleToggle = (id: string, label: string) => {
    toggleComplaint(id, label);
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleNext = () => {
    setAyushData(prakriti);
    router.push("/document");
  };

  const handleMicToggle = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        // Multi-symptom natural voice simulation
        if (!selectedIds.includes("head_brain")) {
          handleToggle("head_brain", "सिर / मस्तिष्क (Head & Brain)");
        }
        if (!selectedIds.includes("chest_heart_lungs")) {
          handleToggle("chest_heart_lungs", "छाती / हृदय (Chest, Heart)");
        }
        setSeverity(7);
        setIsListening(false);
      }, 2400);
    } else {
      setIsListening(false);
    }
  };

  const playPromptAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Aapko kahan kahan dard ya takleef hai? Ek se zyada jagah bhi chun sakte hain."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Human-readable summary of selected pain points
  const selectedRegions = BODY_REGIONS.filter(r => selectedIds.includes(r.id));

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-36">
      {/* 1. Progress Bar (Responsive 8px) */}
      <div className="w-full max-w-6xl px-4 sm:px-8 pt-6">
        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal to-teal-bright w-[50%] transition-all duration-500 ease-out" />
        </div>
        <div className="mt-2 flex justify-between items-center text-xs font-semibold text-text-muted">
          <span>Step 2 of 4 · Anatomical Pain Mapping & Prakriti</span>
          <span className="text-teal font-bold bg-teal-light px-2.5 py-0.5 rounded-full border border-teal/20">
            Multi-Select Enabled
          </span>
        </div>
      </div>

      {/* 2. Header Navigation */}
      <header className="w-full max-w-6xl px-4 sm:px-8 flex justify-between items-center mt-4 sm:mt-6">
        <button 
          onClick={() => router.push("/login")}
          className="text-primary font-semibold text-lg sm:text-xl flex items-center gap-2 animate-press"
        >
          <span className="text-2xl">←</span> Peeche (Back)
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-bold text-teal bg-teal-light px-3 py-1.5 rounded-full border border-teal/20">
            Audio Guidance Active 🔊
          </span>
          <span className="text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-full border border-primary/20">
            {selectedIds.length} {selectedIds.length === 1 ? 'Point' : 'Points'} Selected
          </span>
        </div>
      </header>

      {/* 3. Main Content Area - Laptop/Mobile Responsive Wrapper */}
      <main className="w-full max-w-6xl mt-6 flex flex-col items-center px-4 space-y-6 sm:space-y-8">
        
        {/* Title and Voice Prompt */}
        <div className="text-center flex flex-col items-center gap-1.5 max-w-2xl">
          <h1 className="text-primary text-2xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            Aapko Kahan Dard Ya Takleef Hai?
            <button 
              onClick={playPromptAudio}
              className="text-teal bg-teal-light rounded-full p-2 sm:p-2.5 animate-press hover:bg-[#E8F8F0] shrink-0"
              aria-label="Listen to question"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </h1>
          <h2 className="text-text-muted text-base sm:text-lg md:text-xl">
            Tap all body parts where you feel pain or discomfort (Select one or more)
          </h2>
        </div>

        {/* Selected Points Chips Bar */}
        {selectedRegions.length > 0 && (
          <div className="w-full bg-surface-card border border-border rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-text-muted mr-1">Selected Pain Points:</span>
            {selectedRegions.map((region) => (
              <span 
                key={region.id}
                className="inline-flex items-center gap-1.5 bg-primary-light text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold"
              >
                {region.labelHi.split('/')[0]} ({region.labelEn})
                <button 
                  onClick={() => handleToggle(region.id, `${region.labelHi} (${region.labelEn})`)}
                  className="hover:text-alert text-primary/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 4. Anatomical Body Parts Grid (2 cols on mobile, 4 cols on laptop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full">
          {BODY_REGIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedIds.includes(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => handleToggle(item.id, `${item.labelHi} (${item.labelEn})`)}
                className={cn(
                  "flex flex-col items-center justify-between p-4 sm:p-5 min-h-[160px] sm:min-h-[190px] rounded-2xl border-2 transition-all duration-200 animate-press bg-surface-card relative text-left group",
                  isSelected 
                    ? "border-primary bg-primary-light shadow-md ring-2 ring-primary/20 scale-[1.01]" 
                    : "border-border shadow-sm hover:shadow-md hover:border-primary/40"
                )}
              >
                {/* Active Checkbox Badge */}
                <div className={cn(
                  "absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                  isSelected 
                    ? "bg-primary text-white shadow-sm" 
                    : "border-2 border-border bg-surface text-transparent group-hover:border-primary/50"
                )}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                {/* Anatomical Icon (Accurate 64x64) */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 my-2 shrink-0 transition-transform group-hover:scale-105">
                  <Icon />
                </div>

                {/* Labels & Subtext */}
                <div className="text-center w-full mt-1">
                  <div className="text-text font-bold text-sm sm:text-base leading-tight">
                    {item.labelHi}
                  </div>
                  <div className="text-primary font-semibold text-xs sm:text-sm mt-0.5">
                    {item.labelEn}
                  </div>
                  <div className="hidden sm:block text-[11px] text-text-muted mt-1 leading-tight truncate">
                    {item.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 5. Pain Severity & AYUSH Section - Responsive Dual Column on Laptop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
          
          {/* Pain Severity Scale */}
          <div className="bg-surface-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-text text-base sm:text-lg">Dard Kitna Hai? (Pain Severity)</span>
                <span className={cn(
                  "text-sm font-bold font-mono px-3 py-1 rounded-xl",
                  severity >= 7 ? "bg-alert/15 text-alert" : severity >= 4 ? "bg-warning/15 text-warning" : "bg-teal-light text-teal"
                )}>
                  Level {severity} / 10
                </span>
              </div>
              <p className="text-xs text-text-muted mb-4">
                Wong-Baker clinical rating across selected points
              </p>
            </div>

            <div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="1"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-3.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />

              <div className="flex justify-between text-xs text-text-muted mt-3 font-medium">
                <span className="text-teal font-semibold">0: Bilkul Nahi (None)</span>
                <span className="text-warning font-semibold">5: Madhyam (Moderate)</span>
                <span className="text-alert font-semibold">10: Asahaniya (Severe)</span>
              </div>
            </div>
          </div>

          {/* AYUSH Dashavidha Pariksha Intake (AIIA Evaluation Standard) */}
          <div className="bg-surface-card border-2 border-teal/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Flame className="w-5 h-5 text-warning" />
                <h3 className="font-bold text-text text-base sm:text-lg">Ayurvedic Prakriti (प्रकृति)</h3>
                <span className="text-[10px] font-bold bg-teal-light text-teal px-2 py-0.5 rounded ml-auto">
                  AIIA Standard
                </span>
              </div>
              <p className="text-xs text-text-muted mb-3">
                Select your general constitutional body type
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {PRAKRITI_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPrakriti(type.id)}
                  className={cn(
                    "p-2.5 sm:p-3 rounded-xl border text-left transition-all animate-press",
                    prakriti.includes(type.id)
                      ? "border-teal bg-teal-light text-teal shadow-sm ring-1 ring-teal/30"
                      : "border-border bg-surface text-text-muted hover:border-teal/40"
                  )}
                >
                  <div className="font-bold text-text text-xs sm:text-sm mb-0.5">{type.label}</div>
                  <div className="text-[10px] text-text-muted leading-tight">{type.desc.split('(')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Voice Pill with Active Listening State */}
        <div className="w-full">
          <button 
            onClick={handleMicToggle}
            className={cn(
              "w-full flex items-center justify-center gap-3 sm:gap-4 border-2 rounded-full py-4 px-6 animate-press transition-all",
              isListening 
                ? "bg-alert/10 border-alert text-alert ring-4 ring-alert/20 animate-pulse"
                : "bg-teal-light border-success text-text hover:bg-[#E8F8F0]"
            )}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7">
              <MicIcon />
            </div>
            <span className="font-bold text-base sm:text-lg">
              {isListening 
                ? "Sun rahe hain... Bolte rahiye (Listening to your pain points...)" 
                : "Bol kar batayein (Tap to Speak Multiple Symptoms)"}
            </span>
          </button>
        </div>
      </main>

      {/* 7. Big Action Button (Sticky Bottom with Safe Area) */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md p-4 sm:p-5 flex justify-center border-t border-border z-40">
        <button 
          onClick={handleNext}
          className="max-w-6xl w-full bg-primary text-white font-bold text-xl sm:text-2xl py-4 sm:py-5 rounded-2xl shadow-lg hover:bg-primary-dark animate-press transition-colors flex items-center justify-center gap-2"
        >
          <span>Puraani Parchi Scan Karein (Next: {selectedIds.length} Points Selected)</span>
          <span className="text-2xl">→</span>
        </button>
      </div>
    </div>
  );
}
