"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKioskStore } from "@/store/kioskStore";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";

const LANGUAGES = [
  { code: "hi", name: "हिन्दी", enName: "Hindi", prompt: "नमस्ते, कृपया अपनी भाषा चुनें।" },
  { code: "en", name: "English", enName: "English", prompt: "Welcome, please choose your language to begin." },
  { code: "mr", name: "मराठी", enName: "Marathi", prompt: "नमस्कार, कृपया आपली भाषा निवडा." },
  { code: "gu", name: "ગુજરાતી", enName: "Gujarati", prompt: "નમસ્તે, કૃપા કરીને તમારી ભાષા પસંદ કરો." },
  { code: "bn", name: "বাংলা", enName: "Bengali", prompt: "নমস্কার, অনুগ্রহ করে আপনার ভাষা নির্বাচন করুন।" },
  { code: "ta", name: "தமிழ்", enName: "Tamil", prompt: "வணக்கம், தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்." },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { setLanguage } = useKioskStore();
  const [selected, setSelected] = useState<string>("hi");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleSelect = (code: string) => {
    setSelected(code);
    setLanguage(code);
    playSpeech(LANGUAGES.find(l => l.code === code)?.prompt || "");
  };

  const playSpeech = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBegin = () => {
    setLanguage(selected);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-28">
      {/* Branding Header */}
      <header className="w-full max-w-[1024px] px-8 pt-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-primary-light flex items-center justify-center border-2 border-primary/20 shadow-sm mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1A5276" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <h1 className="text-primary font-bold text-3xl mb-1">MediKiosk</h1>
        <p className="text-text-muted text-base">All India Institute of Ayurveda · OPD Block</p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[640px] mt-8 flex flex-col items-center px-4">
        
        {/* Universal Audio Prompt with real TTS */}
        <div className="mb-8 text-center flex flex-col items-center gap-3">
          <button 
            onClick={() => playSpeech("Namaste. Kripya apni bhasha chunein. Please select your language.")}
            aria-label="Play audio prompt"
            className={cn(
              "w-18 h-18 rounded-full flex items-center justify-center animate-press shadow-md relative transition-all",
              isSpeaking ? "bg-teal text-white ring-4 ring-teal/30 scale-105" : "bg-teal-light text-teal border-2 border-teal-bright hover:bg-[#E8F8F0]"
            )}
          >
            <Volume2 className="w-8 h-8" />
            <div className="absolute -inset-2 border-2 border-teal-bright rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
          </button>
          <h2 className="text-text font-bold text-2xl mt-2">अपनी भाषा चुनें / Select Language</h2>
          <p className="text-text-muted text-sm">Tap the speaker above to hear instructions</p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  "flex flex-col items-center justify-center p-5 min-h-[130px] rounded-2xl border-2 transition-all duration-200 animate-press bg-surface-card",
                  isSelected 
                    ? "border-primary bg-primary-light shadow-md ring-2 ring-primary/20" 
                    : "border-border shadow-sm hover:shadow-md hover:border-primary/40"
                )}
              >
                <div className="text-center">
                  <div className="text-text font-bold text-3xl mb-1">{lang.name}</div>
                  <div className="text-text-muted text-sm font-medium">{lang.enName}</div>
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
          onClick={handleBegin}
          className="max-w-[640px] w-full bg-primary text-white font-bold text-xl sm:text-2xl py-4 sm:py-5 rounded-xl shadow-lg hover:bg-primary-dark animate-press transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Shuru Karein (Begin) →
        </button>
      </div>
    </div>
  );
}
