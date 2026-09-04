"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useKioskStore } from "@/store/kioskStore";
import { 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Stethoscope, 
  Sparkles,
  MapPin,
  Clock
} from "lucide-react";

export default function SummaryStep() {
  const router = useRouter();
  const { currentPatient, completeIntakeAndEnqueue, setView } = useKioskStore();
  const [tokenNumber, setTokenNumber] = useState<number>(43);
  const hasEnqueued = useRef<boolean>(false);

  useEffect(() => {
    // Idempotent guard: only push to the OPD queue once per session
    if (!hasEnqueued.current) {
      hasEnqueued.current = true;
      const token = completeIntakeAndEnqueue();
      setTokenNumber(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-28">
      {/* Progress Bar (100% Complete) */}
      <div className="w-full max-w-[1024px] px-8 pt-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-success w-full transition-all duration-500 ease-out" />
        </div>
        <div className="mt-2 text-success text-sm font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> 100% Completed · OPD Slip Ready
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-[640px] mt-8 flex flex-col items-center px-4">
        <div className="text-center mb-6">
          <h1 className="text-primary text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
            Dhanyawad! Aapka Token Taiyaar Hai
          </h1>
          <p className="text-text-muted text-lg mt-1">
            Thank you! Your clinical case has been routed to the physician.
          </p>
        </div>

        {/* Printable Physical OPD Slip Card */}
        <div className="w-full bg-surface-card border-2 border-primary/20 rounded-3xl p-8 shadow-lg relative overflow-hidden flex flex-col items-center text-center">
          {/* Top Notch pattern */}
          <div className="w-16 h-2 bg-primary/20 rounded-full mb-6" />

          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
            All India Institute of Ayurveda · OPD Token
          </span>

          {/* Huge Token Number */}
          <div className="my-4">
            <span className="text-sm font-semibold text-text-muted block">Aapka Token Number</span>
            <div className="text-6xl sm:text-7xl font-extrabold text-primary tracking-tight font-mono">
              #{tokenNumber}
            </div>
          </div>

          {/* Routing Room and Department */}
          <div className="w-full bg-primary-light border border-primary/20 rounded-2xl p-4 my-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-primary font-bold uppercase">Assigned Cabin</span>
                <p className="text-base font-bold text-text">Room 3 · General OPD</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-muted flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" /> Est. Wait
              </span>
              <p className="text-sm font-bold text-teal">~8 minutes</p>
            </div>
          </div>

          {/* Patient Details Snapshot */}
          <div className="w-full border-t border-b border-border py-4 text-left space-y-1 text-sm text-text-muted">
            <div className="flex justify-between">
              <span>Patient:</span>
              <span className="font-bold text-text">{currentPatient.name} ({currentPatient.age}y / {currentPatient.gender})</span>
            </div>
            <div className="flex justify-between">
              <span>ABHA ID:</span>
              <span className="font-mono text-primary font-semibold">{currentPatient.abhaId}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="shrink-0 font-medium">Selected Pain Points:</span>
              <span className="font-semibold text-text text-left sm:text-right">{currentPatient.complaintLabel}</span>
            </div>
            <div className="flex justify-between">
              <span>Ayurvedic Assessment:</span>
              <span className="font-semibold text-teal">{currentPatient.prakriti} Prakriti</span>
            </div>
          </div>

          {/* QR Code & Barcode */}
          <div className="mt-6 flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-surface rounded-xl border border-border flex items-center justify-center p-2">
                <QrCode className="w-full h-full text-primary" />
              </div>
              <div className="text-left text-xs text-text-muted">
                <p className="font-semibold text-text">Scan at Doctor&apos;s Desk</p>
                <p>Digital Token Verified</p>
              </div>
            </div>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 border border-border bg-surface px-4 py-3 rounded-xl text-sm font-bold text-text hover:bg-surface-sunk animate-press"
            >
              <Printer className="w-4 h-4 text-primary" /> Print Slip
            </button>
          </div>
        </div>

        {/* Live Demo Switcher CTA */}
        <div className="mt-8 w-full">
          <div className="bg-teal-light border-2 border-teal/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="flex items-center gap-1.5 text-teal font-bold text-sm justify-center sm:justify-start">
                <Sparkles className="w-4 h-4" /> Live Demo Simulation
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Switch to Doctor Console to see #{tokenNumber} appear at the top of the queue!
              </p>
            </div>
            <button
              onClick={() => setView('physician')}
              className="bg-teal text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md hover:bg-teal-bright flex items-center gap-2 shrink-0 animate-press"
            >
              <Stethoscope className="w-4 h-4" /> Open Doctor Console →
            </button>
          </div>
        </div>
      </main>

      {/* Start Next Patient Button */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-sm p-6 flex justify-center border-t border-border">
        <button
          onClick={() => router.push("/language")}
          className="max-w-[640px] w-full bg-primary text-white font-bold text-lg sm:text-2xl py-4 sm:py-5 rounded-xl shadow-lg hover:bg-primary-dark animate-press transition-colors leading-tight"
        >
          Naye Mareez Ke Liye Shuru Karein <br className="sm:hidden" /> (New Patient) ⟳
        </button>
      </div>
    </div>
  );
}
