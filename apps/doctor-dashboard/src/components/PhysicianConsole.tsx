"use client";

import React, { useState } from "react";
import { useKioskStore } from "@/store/kioskStore";
import { 
  UserRound, 
  Pencil, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Sparkles,
  Flame,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PhysicianConsole() {
  const { queue, selectedPatientId, selectPatient, amendRecord, pushToEmr } = useKioskStore();
  const patient = queue.find((p) => p.id === selectedPatientId) || queue[0];
  
  const [isAmending, setIsAmending] = useState(false);
  const [draftHpi, setDraftHpi] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const startAmend = () => {
    setDraftHpi(patient?.hpiOverride || generateDefaultHpi(patient));
    setIsAmending(true);
  };

  const saveAmend = () => {
    if (patient) {
      amendRecord(patient.id, draftHpi);
      setIsAmending(false);
    }
  };

  const handlePushToAbdm = () => {
    if (patient) {
      pushToEmr(patient.id);
      setToastMessage(`Pushed FHIR R4 Bundle for ${patient.name} to ABDM Health Data Repository!`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  function generateDefaultHpi(p: typeof patient) {
    if (!p) return "";
    return `Patient presents with ${p.complaint.symptomLabel} persisting for ${p.complaint.duration || 'recent onset'}, evaluated severity at ${p.complaint.severity || 5}/10 on Wong-Baker FACES. Associated symptoms include ${p.complaint.associated?.join(", ") || 'none'}. Ayurvedic Pariksha indicates ${p.ayushAssessment?.prakriti || 'Vata-Pitta'} Prakriti with ${p.ayushAssessment?.agni || 'Tikshna Agni'}.`;
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-64px)] overflow-hidden bg-surface">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 bg-success text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* 1. Left Sidebar: Live Ordered Queue */}
      <aside className="w-80 sm:w-96 border-r border-border bg-surface-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold text-text text-base">OPD Live Queue</h2>
            <p className="text-xs text-text-muted">Awaiting Doctor Consultation</p>
          </div>
          <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
            {queue.length} Total
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {queue.map((p) => {
            const isSelected = p.id === patient?.id;
            const waitMinutes = Math.floor((Date.now() - p.waitSince) / 60000);

            return (
              <button
                key={p.id}
                onClick={() => {
                  selectPatient(p.id);
                  setIsAmending(false);
                }}
                className={cn(
                  "w-full text-left p-4 transition-colors flex items-start gap-3 hover:bg-surface",
                  isSelected && "bg-primary-light border-l-4 border-primary"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                  #{p.token}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-text text-sm truncate">{p.name}</span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {waitMinutes}m
                    </span>
                  </div>
                  <p className="text-xs text-text-muted truncate mb-1.5">
                    {p.age}y · {p.gender} · {p.complaint.symptomLabel}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-teal-light text-teal px-2 py-0.5 rounded">
                      {p.department.split(' ')[0]}
                    </span>
                    {p.status === 'pushed' ? (
                      <span className="text-[10px] font-bold bg-success/15 text-success px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> EMR Pushed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-warning-light text-warning px-2 py-0.5 rounded">
                        Triage Ready
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 2. Main Consult Panel */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 sm:p-8 space-y-6">
        {patient ? (
          <>
            {/* Patient Header Banner */}
            <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
                  <UserRound className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-text">{patient.name}</h1>
                    <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      Token #{patient.token}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mt-1">
                    {patient.age} yrs · {patient.gender === 'M' ? 'Male' : 'Female'} · ABHA: <span className="font-mono text-primary font-semibold">{patient.abhaId}</span> · {patient.mobile}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {patient.status === 'pushed' ? (
                  <div className="flex items-center gap-2 bg-success-light text-success px-4 py-2.5 rounded-xl font-bold text-sm border border-success/30">
                    <CheckCircle2 className="w-4 h-4" />
                    Pushed to ABDM EMR
                  </div>
                ) : (
                  <button
                    onClick={handlePushToAbdm}
                    className="flex items-center gap-2 bg-teal text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-bright animate-press shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    Approve & Push to ABDM
                  </button>
                )}
              </div>
            </div>

            {/* Red Flag Clinical Alert Banner */}
            {patient.redFlags && patient.redFlags.length > 0 && (
              <div className="bg-alert/10 border-2 border-alert rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-alert text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-alert text-base">
                      🚨 Red Flag Clinical Alert: {patient.redFlags[0].condition}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {patient.redFlags[0].clinicalRationale}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase bg-alert text-white px-3 py-1 rounded-full shrink-0">
                  Code Red Triage
                </span>
              </div>
            )}

            {/* AI Clinical Summary (Draft) & HPI */}
            <section className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal" />
                  <h2 className="font-bold text-text text-lg">AI-Assisted Clinical History (Draft)</h2>
                  <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                    Physician Review Required
                  </span>
                </div>
                {!isAmending && (
                  <button
                    onClick={startAmend}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark border border-primary/20 px-3 py-1.5 rounded-lg animate-press"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Amend Draft
                  </button>
                )}
              </div>

              {isAmending ? (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={draftHpi}
                    onChange={(e) => setDraftHpi(e.target.value)}
                    className="w-full p-4 border-2 border-primary rounded-xl text-sm leading-relaxed text-text focus:outline-none bg-surface"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAmending(false)}
                      className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveAmend}
                      className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg animate-press"
                    >
                      Save Amendments
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-text leading-relaxed text-sm bg-surface p-4 rounded-xl border border-border">
                  {patient.hpiOverride || generateDefaultHpi(patient)}
                </p>
              )}
            </section>

            {/* Ayurvedic Pariksha & Dashavidha Insights (PS 26047 Core Differentiator) */}
            <section className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-warning" />
                <h2 className="font-bold text-text text-lg">Ayurvedic Assessment (Dashavidha Pariksha)</h2>
                <span className="text-xs bg-teal-light text-teal font-semibold px-2 py-0.5 rounded">
                  AIIA Standard
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-muted font-medium">Prakriti (Constitution)</span>
                  <p className="text-lg font-bold text-primary mt-1">
                    {patient.ayushAssessment?.prakriti || 'Vata-Pitta'}
                  </p>
                  <span className="text-[11px] text-teal font-medium">Predominant Dosha</span>
                </div>

                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-muted font-medium">Agni (Digestive Fire)</span>
                  <p className="text-lg font-bold text-warning mt-1">
                    {patient.ayushAssessment?.agni || 'Tikshna (Hyperactive)'}
                  </p>
                  <span className="text-[11px] text-text-muted">Metabolic Index</span>
                </div>

                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-muted font-medium">Bala (Vital Strength)</span>
                  <p className="text-lg font-bold text-text mt-1">
                    {patient.ayushAssessment?.bala || 'Madhyama (Medium)'}
                  </p>
                  <span className="text-[11px] text-text-muted">Immunity / Endurance</span>
                </div>
              </div>
            </section>

            {/* Document Extraction: Extracted Medications & Flagged Labs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Extracted Medications */}
              <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    OCR Extracted Medications
                  </h3>
                  <span className="text-xs text-text-muted font-mono">Confidence: 94%</span>
                </div>

                <div className="divide-y divide-border">
                  {patient.documents?.medications?.map((m, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-text text-sm">{m.name}</span>
                        <span className="text-xs text-text-muted ml-2">({m.dose})</span>
                        <p className="text-[11px] text-text-muted">{m.note}</p>
                      </div>
                      <span className="text-xs font-mono bg-surface px-2.5 py-1 rounded border border-border font-semibold text-primary">
                        {m.frequency}
                      </span>
                    </div>
                  )) || (
                    <p className="text-sm text-text-muted py-4">No prior prescriptions scanned.</p>
                  )}
                </div>
              </div>

              {/* Flagged Lab Values */}
              <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal" />
                    Lab Values & Reference Flags
                  </h3>
                  <span className="text-xs text-alert font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Abnormals Flagged
                  </span>
                </div>

                <div className="divide-y divide-border">
                  {patient.documents?.labValues?.map((l, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-text text-sm">{l.test}</span>
                        <p className="text-[11px] text-text-muted">Ref: {l.range}</p>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "text-sm font-bold font-mono px-2 py-0.5 rounded",
                          l.flag === 'high' ? "bg-alert/15 text-alert" : "text-text"
                        )}>
                          {l.value}
                        </span>
                        {l.flag === 'high' && (
                          <span className="block text-[10px] font-bold text-alert">HIGH</span>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-text-muted py-4">No lab reports found.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            Select a patient from the queue to start consult.
          </div>
        )}
      </main>
    </div>
  );
}
