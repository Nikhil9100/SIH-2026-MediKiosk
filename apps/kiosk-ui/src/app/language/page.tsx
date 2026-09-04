"use client";

import React from "react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "hi", name: "हिन्दी", enName: "Hindi" },
  { code: "en", name: "English", enName: "English" },
  { code: "mr", name: "मराठी", enName: "Marathi" },
  { code: "gu", name: "ગુજરાતી", enName: "Gujarati" },
  { code: "bn", name: "বাংলা", enName: "Bengali" },
  { code: "ta", name: "தமிழ்", enName: "Tamil" },
];

export default function LanguageScreen() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-24">
      {/* Branding Header (Government/Ayush Logo placeholder) */}
      <header className="w-full max-w-[1024px] px-8 pt-12 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center border-4 border-white shadow-sm mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <h1 className="text-primary font-bold text-3xl mb-2">MediKiosk</h1>
        <p className="text-text-muted text-lg">Smart Clinical Intake</p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[640px] mt-12 flex flex-col items-center">
        
        {/* Universal Audio Prompt */}
        <div className="mb-10 text-center flex flex-col items-center gap-4">
          <button className="w-20 h-20 bg-teal-light text-teal border-2 border-teal-bright rounded-full flex items-center justify-center animate-press shadow-md relative group hover:bg-[#E8F8F0]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <div className="absolute -inset-2 border-2 border-teal-bright rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
          </button>
          <h2 className="text-text-muted text-2xl font-medium mt-4">Tap a language to start</h2>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            
            return (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 min-h-[140px] rounded-xl border-2 transition-all duration-200 animate-press bg-surface-card",
                  isSelected 
                    ? "border-primary bg-primary-light shadow-md" 
                    : "border-border shadow-sm hover:shadow-md hover:border-primary/50"
                )}
              >
                <div className="text-center">
                  <div className="text-text font-bold text-4xl mb-2">{lang.name}</div>
                  <div className="text-text-muted text-lg font-medium">{lang.enName}</div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Big Action Button */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-sm p-6 flex justify-center border-t border-border">
        <button 
          disabled={!selected}
          className="max-w-[640px] w-full bg-primary text-white font-bold text-2xl py-5 rounded-lg shadow-lg hover:bg-primary-dark animate-press transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => window.location.href = '/login'}
        >
          Begin / शुरू करें →
        </button>
      </div>
    </div>
  );
}
