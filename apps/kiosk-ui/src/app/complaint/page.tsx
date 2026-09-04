"use client";

import React, from "react";
import { HeadacheIcon, ChestPainIcon, StomachPainIcon, FeverIcon, MicIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const COMPLAINTS = [
  { id: "headache", labelEn: "Headache", labelHi: "सिर दर्द", icon: HeadacheIcon },
  { id: "chest_pain", labelEn: "Chest pain", labelHi: "छाती में दर्द", icon: ChestPainIcon },
  { id: "stomach_pain", labelEn: "Stomach pain", labelHi: "पेट दर्द", icon: StomachPainIcon },
  { id: "fever", labelEn: "Fever", labelHi: "बुखार", icon: FeverIcon },
];

export default function ChiefComplaintScreen() {
  const [selected, setSelected] = React.useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-24">
      {/* Progress Bar (Kiosk Mode: 8px height) */}
      <div className="w-full max-w-[1024px] px-8 pt-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal to-teal-bright w-1/4 transition-all duration-500 ease-out" />
        </div>
        <div className="mt-2 text-text-muted text-sm font-medium">25%</div>
      </div>

      {/* Header Navigation */}
      <header className="w-full max-w-[1024px] px-8 flex justify-between items-center mt-6">
        <button className="text-primary font-semibold text-xl flex items-center gap-2 animate-press">
          <span className="text-2xl">←</span> Peeche
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[640px] mt-12 flex flex-col items-center">
        
        {/* Prompts */}
        <div className="text-center mb-10 flex flex-col items-center gap-2">
          <h1 className="text-primary text-3xl md:text-4xl font-semibold flex items-center justify-center gap-3">
            Aapko kya taklif hai?
            <button className="text-teal bg-teal-light rounded-full p-2 animate-press">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            </button>
          </h1>
          <h2 className="text-text-muted text-xl md:text-2xl">What is your problem?</h2>
        </div>

        {/* Options Grid (Max 4-6 options per screen as per PRD) */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {COMPLAINTS.map((item) => {
            const Icon = item.icon;
            const isSelected = selected === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 min-h-[140px] rounded-xl border-2 transition-all duration-200 animate-press bg-surface-card",
                  isSelected 
                    ? "border-primary bg-primary-light shadow-md" 
                    : "border-border shadow-sm hover:shadow-md hover:border-primary/50"
                )}
              >
                <div className="w-[72px] h-[72px] mb-4">
                  <Icon />
                </div>
                <div className="text-center">
                  <div className="text-text font-semibold text-lg">{item.labelHi}</div>
                  <div className="text-text-muted text-base">{item.labelEn}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Voice Pill */}
        <div className="mt-12 w-full">
          <button className="w-full flex items-center justify-center gap-4 bg-teal-light border-2 border-success rounded-full py-4 px-6 animate-press hover:bg-[#E8F8F0]">
            <div className="w-8 h-8">
              <MicIcon />
            </div>
            <span className="text-text font-semibold text-xl">Bol kar batayein (Speak your problem)</span>
          </button>
        </div>
      </main>

      {/* Big Action Button (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-sm p-6 flex justify-center border-t border-border">
        <button className="max-w-[640px] w-full bg-primary text-white font-bold text-2xl py-5 rounded-lg shadow-lg hover:bg-primary-dark animate-press transition-colors disabled:opacity-50">
          Aur Dikhayein (Show More) ▼
        </button>
      </div>
    </div>
  );
}
