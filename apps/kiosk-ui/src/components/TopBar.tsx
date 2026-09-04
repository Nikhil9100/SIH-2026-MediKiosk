"use client";

import React from "react";
import { useKioskStore } from "@/store/kioskStore";
import { Wifi, Siren, Activity, User, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { activeView, setView, queue } = useKioskStore();
  const waitingCount = queue.filter(p => p.status === 'waiting').length;

  return (
    <header className="h-16 shrink-0 border-b border-border bg-surface-card px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-50">
      {/* Brand & Hospital Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div className="hidden sm:block leading-tight">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-base">MediKiosk</span>
            <span className="text-xs bg-teal-light text-teal px-2 py-0.5 rounded-full font-medium border border-teal/20">
              AYUSH + Allopathic
            </span>
          </div>
          <p className="text-xs text-text-muted">All India Institute of Ayurveda · OPD Block</p>
        </div>
      </div>

      {/* Segmented Mode Switcher (The Hackathon Winner Feature) */}
      <div className="flex items-center bg-surface border border-border p-1 rounded-xl shadow-inner">
        <button
          onClick={() => setView('kiosk')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all animate-press",
            activeView === 'kiosk'
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text"
          )}
        >
          <User className="w-4 h-4" />
          <span>Patient Kiosk</span>
        </button>

        <button
          onClick={() => setView('physician')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all animate-press relative",
            activeView === 'physician'
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text"
          )}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctor Console</span>
          {waitingCount > 0 && (
            <span className={cn(
              "px-1.5 py-0.2 rounded-full text-xs font-bold",
              activeView === 'physician' ? "bg-white text-primary" : "bg-teal text-white"
            )}>
              {waitingCount}
            </span>
          )}
        </button>
      </div>

      {/* System Status Indicators & Emergency SOS */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-light text-teal text-xs font-medium border border-teal/30">
          <Wifi className="w-3.5 h-3.5" />
          <span>ABDM Gateway Live</span>
        </div>

        <button 
          onClick={() => alert("🚨 RED FLAG TRIAGE ACTIVATED: Code Red dispatched to OPD Triage Nurse. Kiosk locked in emergency mode.")}
          className="flex items-center gap-1.5 bg-alert text-white px-3 sm:px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#C0392B] animate-press shadow-sm"
        >
          <Siren className="w-4 h-4 animate-bounce" />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
}
