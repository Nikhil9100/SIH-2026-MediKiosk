"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKioskStore } from "@/store/kioskStore";
import { 
  FileScan, 
  Pill, 
  FlaskConical, 
  CheckCircle2, 
  Camera, 
  RefreshCw 
} from "lucide-react";

const SCAN_STEPS = [
  "Optical document edge detection...",
  "Running AI OCR on handwritten prescription...",
  "Extracting Ayurvedic & Allopathic medications (NER)...",
  "Validating dosage & cross-checking lab reference ranges...",
];

export default function DocumentStep() {
  const router = useRouter();
  const { currentPatient } = useKioskStore();
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [messageIdx, setMessageIdx] = useState(0);

  const startScan = () => {
    setScanStatus('scanning');
    setProgress(0);
    setMessageIdx(0);

    const duration = 2200;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      setMessageIdx(Math.min(Math.floor((pct / 100) * SCAN_STEPS.length), SCAN_STEPS.length - 1));

      if (elapsed >= duration) {
        clearInterval(timer);
        setScanStatus('done');
      }
    }, interval);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-28">
      {/* Progress Bar */}
      <div className="w-full max-w-[1024px] px-8 pt-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal to-teal-bright w-[70%] transition-all duration-500 ease-out" />
        </div>
        <div className="mt-2 text-text-muted text-sm font-medium">Step 3 of 4 · Documents & Labs</div>
      </div>

      {/* Header Navigation */}
      <header className="w-full max-w-[1024px] px-8 flex justify-between items-center mt-6">
        <button 
          onClick={() => router.push("/complaint")}
          className="text-primary font-semibold text-xl flex items-center gap-2 animate-press"
        >
          <span className="text-2xl">←</span> Peeche (Back)
        </button>
        <button 
          onClick={() => router.push("/summary")}
          className="text-text-muted hover:text-text font-semibold text-base flex items-center gap-1.5 animate-press bg-surface-card px-4 py-2 rounded-xl border border-border"
        >
          Skip (No Docs) ⏭
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[800px] mt-6 flex flex-col items-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-primary text-3xl md:text-4xl font-semibold flex items-center justify-center gap-3">
            Puraani Parchi Ya Test Report Scan Karein
          </h1>
          <h2 className="text-text-muted text-xl mt-1">
            Scan your previous doctor prescriptions or blood test reports
          </h2>
        </div>

        {scanStatus === 'idle' && (
          <div className="w-full bg-surface-card border-2 border-dashed border-primary/30 rounded-3xl p-10 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center text-primary mb-6 animate-pulse">
              <Camera className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-2">Place document under kiosk scanner</h3>
            <p className="text-text-muted text-lg max-w-md mb-8">
              Hold the prescription flat or upload your previous digital medical summary
            </p>
            <button
              onClick={startScan}
              className="bg-primary text-white font-bold text-xl px-10 py-5 rounded-2xl shadow-md hover:bg-primary-dark animate-press flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              Start Scanner (स्कैन शुरू करें)
            </button>
          </div>
        )}

        {scanStatus === 'scanning' && (
          <div className="w-full bg-surface-card border-2 border-teal rounded-3xl p-10 flex flex-col items-center text-center shadow-md">
            <div className="relative w-28 h-28 mb-6">
              <div className="w-full h-full rounded-full border-4 border-teal-light border-t-teal animate-spin" />
              <FileScan className="w-12 h-12 text-teal absolute inset-0 m-auto" />
            </div>

            <h3 className="text-2xl font-bold text-text mb-2">
              {SCAN_STEPS[messageIdx]}
            </h3>
            
            <div className="w-full max-w-md h-3 bg-gray-200 rounded-full overflow-hidden mt-6">
              <div 
                className="h-full bg-teal transition-all duration-100 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="text-sm font-bold text-teal mt-2">{progress}% Completed</span>
          </div>
        )}

        {scanStatus === 'done' && (
          <div className="w-full space-y-6">
            <div className="bg-success-light border border-success/30 rounded-2xl p-4 flex items-center gap-3 text-success">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div className="text-sm font-semibold">
                Document analyzed successfully! Extracted 2 active medications and 3 laboratory values.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Extracted Meds */}
              <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-text text-base flex items-center gap-2 mb-3">
                  <Pill className="w-4 h-4 text-primary" />
                  Prescriptions Detected
                </h4>
                <div className="space-y-2">
                  {currentPatient.scannedDocs.medications.map((m, idx) => (
                    <div key={idx} className="p-3 bg-surface rounded-xl border border-border flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm text-text">{m.name} ({m.dose})</div>
                        <div className="text-xs text-text-muted">{m.note}</div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-primary-light text-primary px-2 py-1 rounded">
                        {m.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted Labs */}
              <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-text text-base flex items-center gap-2 mb-3">
                  <FlaskConical className="w-4 h-4 text-teal" />
                  Lab Biomarkers Flagged
                </h4>
                <div className="space-y-2">
                  {currentPatient.scannedDocs.labValues.map((l, idx) => (
                    <div key={idx} className="p-3 bg-surface rounded-xl border border-border flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm text-text">{l.test}</div>
                        <div className="text-xs text-text-muted">Norm: {l.range}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-alert">{l.value}</span>
                        <span className="block text-[10px] font-bold text-alert">HIGH</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={startScan}
                className="text-primary text-sm font-semibold flex items-center gap-2 hover:underline"
              >
                <RefreshCw className="w-4 h-4" /> Scan Another Page
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Big Action Button */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-sm p-6 flex justify-center border-t border-border">
        <button
          onClick={() => router.push("/summary")}
          className="max-w-[800px] w-full bg-primary text-white font-bold text-2xl py-5 rounded-xl shadow-lg hover:bg-primary-dark animate-press transition-colors"
        >
          {scanStatus === 'done' ? "Review & Generate Token →" : "Aage Badhein (Next) →"}
        </button>
      </div>
    </div>
  );
}
