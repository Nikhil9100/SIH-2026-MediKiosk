"use client";

import React, { useState } from "react";
import { HeadacheIcon, ChestPainIcon, StomachPainIcon, FeverIcon, MicIcon } from "@/components/icons";
import { useKioskStore } from "@/store/kioskStore";
import { cn } from "@/lib/utils";
import { Flame, Check } from "lucide-react";

const COMPLAINTS = [
  { id: "headache", labelEn: "Headache", labelHi: "सिर दर्द", icon: HeadacheIcon },
  { id: "chest_pain", labelEn: "Chest pain", labelHi: "छाती में दर्द", icon: ChestPainIcon },
  { id: "stomach_pain", labelEn: "Stomach pain", labelHi: "पेट दर्द", icon: StomachPainIcon },
  { id: "fever", labelEn: "Fever", labelHi: "बुखार", icon: FeverIcon },
];

const PRAKRITI_TYPES = [
  { id: "Vata", label: "वात (Vata)", desc: "Dry, cold, light (वायु / Air)" },
  { id: "Pitta", label: "पित्त (Pitta)", desc: "Hot, sharp, acidic (अग्नि / Fire)" },
  { id: "Kapha", label: "कफ (Kapha)", desc: "Heavy, slow, cool (जल-पृथ्वी / Earth)" },
];

export default function ChiefComplaintScreen() {
  const { setComplaint, setAyushData } = useKioskStore();
  const [selected, setSelected] = useState<string | null>("chest_pain");
  const [severity, setSeverity] = useState<number>(6);
  const [prakriti, setPrakriti] = useState<string>("Vata-Pitta");

  const handleSelect = (id: string, label: string) => {
    setSelected(id);
    setComplaint(id, label);
  };

  const handleNext = () => {
    setAyushData(prakriti);
    window.location.href = '/document';
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-28">
      {/* Progress Bar (Kiosk Mode: 8px height) */}
      <div className="w-full max-w-[1024px] px-8 pt-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal to-teal-bright w-[45%] transition-all duration-500 ease-out" />
        </div>
        <div className="mt-2 text-text-muted text-sm font-medium">Step 2 of 4 · Symptoms & Pariksha</div>
      </div>

      {/* Header Navigation */}
      <header className="w-full max-w-[1024px] px-8 flex justify-between items-center mt-6">
        <button 
          onClick={() => window.location.href = '/login'}
          className="text-primary font-semibold text-xl flex items-center gap-2 animate-press"
        >
          <span className="text-2xl">←</span> Peeche (Back)
        </button>
        <span className="text-xs font-bold text-teal bg-teal-light px-3 py-1.5 rounded-full border border-teal/20">
          Audio Guidance Active 🔊
        </span>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[680px] mt-8 flex flex-col items-center px-4 space-y-8">
        
        {/* Prompts */}
        <div className="text-center flex flex-col items-center gap-1">
          <h1 className="text-primary text-3xl md:text-4xl font-semibold flex items-center justify-center gap-3">
            Aapko kya taklif hai?
            <button className="text-teal bg-teal-light rounded-full p-2 animate-press">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            </button>
          </h1>
          <h2 className="text-text-muted text-xl md:text-2xl">What is your primary problem?</h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-5 w-full">
          {COMPLAINTS.map((item) => {
            const Icon = item.icon;
            const isSelected = selected === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id, `${item.labelHi} (${item.labelEn})`)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 min-h-[140px] rounded-2xl border-2 transition-all duration-200 animate-press bg-surface-card relative",
                  isSelected 
                    ? "border-primary bg-primary-light shadow-md ring-2 ring-primary/20" 
                    : "border-border shadow-sm hover:shadow-md hover:border-primary/50"
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="w-[68px] h-[68px] mb-3">
                  <Icon />
                </div>
                <div className="text-center">
                  <div className="text-text font-bold text-lg">{item.labelHi}</div>
                  <div className="text-text-muted text-sm">{item.labelEn}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pain Severity Scale (Wong-Baker FACES clinical representation) */}
        <div className="w-full bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-text text-base">Dard Kitna Hai? (Pain Severity)</span>
            <span className="text-sm font-bold text-primary font-mono bg-primary-light px-2.5 py-1 rounded-lg">
              Level {severity} / 10
            </span>
          </div>

          <input 
            type="range" 
            min="0" 
            max="10" 
            step="1"
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="flex justify-between text-xs text-text-muted mt-2 font-medium">
            <span>0: Bilkul Nahi (None)</span>
            <span>5: Madhyam (Moderate)</span>
            <span>10: Asahaniya (Severe)</span>
          </div>
        </div>

        {/* AYUSH Dashavidha Pariksha Intake (PS 26047 Core Evaluation Mandate) */}
        <div className="w-full bg-surface-card border-2 border-teal/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-warning" />
            <h3 className="font-bold text-text text-base">Ayurvedic Prakriti Triage (प्रकृति विश्लेषण)</h3>
            <span className="text-[10px] font-bold bg-teal-light text-teal px-2 py-0.5 rounded ml-auto">
              Ministry of Ayush Standard
            </span>
          </div>
          <p className="text-xs text-text-muted mb-4">
            Which constitution best matches your general physical state?
          </p>

          <div className="grid grid-cols-3 gap-3">
            {PRAKRITI_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setPrakriti(type.id)}
                className={cn(
                  "p-3 rounded-xl border text-left text-xs font-semibold transition-all animate-press",
                  prakriti.includes(type.id)
                    ? "border-teal bg-teal-light text-teal shadow-sm"
                    : "border-border bg-surface text-text-muted hover:border-teal/50"
                )}
              >
                <div className="font-bold text-text mb-0.5">{type.label}</div>
                <div className="text-[10px] text-text-muted font-normal">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Pill */}
        <div className="w-full">
          <button className="w-full flex items-center justify-center gap-4 bg-teal-light border-2 border-success rounded-full py-4 px-6 animate-press hover:bg-[#E8F8F0]">
            <div className="w-7 h-7">
              <MicIcon />
            </div>
            <span className="text-text font-bold text-lg">Bol kar batayein (Speak problem)</span>
          </button>
        </div>
      </main>

      {/* Big Action Button (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-sm p-6 flex justify-center border-t border-border">
        <button 
          onClick={handleNext}
          className="max-w-[680px] w-full bg-primary text-white font-bold text-2xl py-5 rounded-xl shadow-lg hover:bg-primary-dark animate-press transition-colors flex items-center justify-center gap-2"
        >
          Puraani Parchi Scan Karein (Next) →
        </button>
      </div>
    </div>
  );
}
