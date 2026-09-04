"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ConversationalHistoryEngine } from "@/modules/history-engine/engine";
import { VoiceService } from "@/services/voice/voiceService";
import { 
  Sparkles, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw,
  Mic
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  complaintId: string;
  onHistoryUpdate?: (summaryText: string) => void;
}

export default function AdaptiveClinicalInquiry({ complaintId, onHistoryUpdate }: Props) {
  // Map complaintId to pathway key
  const pathwayKey = useMemo(() => {
    switch (complaintId) {
      case "chest_heart_lungs": return "chest_pain";
      case "stomach_abdomen": return "abdominal_pain";
      case "head_brain": return "headache";
      case "fever_vitals": return "fever";
      case "throat_neck": return "cough";
      case "spine_back": return "back_pain";
      default: return "abdominal_pain";
    }
  }, [complaintId]);

  const [engine, setEngine] = useState(() => new ConversationalHistoryEngine(pathwayKey));
  const [engineState, setEngineState] = useState(() => engine.getState());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Re-initialize engine whenever complaint changes
  useEffect(() => {
    const newEngine = new ConversationalHistoryEngine(pathwayKey);
    setEngine(newEngine);
    setEngineState(newEngine.getState());
  }, [pathwayKey]);

  const currentQ = engineState.currentQuestion;

  // Speak question aloud
  const speakCurrentQuestion = () => {
    if (!currentQ) return;
    setIsSpeaking(true);
    VoiceService.speak(currentQ.promptHi, "hi-IN", () => setIsSpeaking(false));
  };

  // Handle patient choice tap
  const handleChoiceSelect = (choiceId: string) => {
    engine.answerChoice(choiceId);
    const updated = engine.getState();
    setEngineState(updated);
    if (updated.summaryDraft && onHistoryUpdate) {
      onHistoryUpdate(updated.summaryDraft);
    }
  };

  // Handle voice simulation / verbal answer
  const handleVoiceAnswer = () => {
    if (!currentQ) return;
    // Simulate first or second choice based on prompt
    const targetChoice = currentQ.choices[0];
    setVoiceNotice(`Sun rahe hain... / Listening: "${targetChoice.labelHi.split("/")[0]}"`);
    setTimeout(() => {
      engine.answerNaturalText(targetChoice.labelHi);
      const updated = engine.getState();
      setEngineState(updated);
      setVoiceNotice(null);
      if (updated.summaryDraft && onHistoryUpdate) {
        onHistoryUpdate(updated.summaryDraft);
      }
    }, 1200);
  };

  const handleReset = () => {
    const fresh = new ConversationalHistoryEngine(pathwayKey);
    setEngine(fresh);
    setEngineState(fresh.getState());
  };

  const activeRedFlag = engineState.detectedRedFlags[0];

  return (
    <div className="w-full bg-surface-card border-2 border-primary/20 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-light text-teal flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-text text-base sm:text-lg">
                नैदानिक पूछताछ (Conversational Clinical History)
              </h3>
              <span className="text-[10px] font-bold bg-teal-light text-teal px-2 py-0.5 rounded-full border border-teal/20">
                Controlled Clinical Pathway
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Adaptive SOCRATES probing for {engineState.history.chiefComplaint}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-text-muted hover:text-primary flex items-center gap-1 self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start Again (पुनः शुरू करें)
        </button>
      </div>

      {/* Red-Flag Emergency Banner if triggered */}
      {activeRedFlag && (
        <div className="bg-alert/15 border-2 border-alert rounded-2xl p-4 flex items-center gap-3.5 text-alert animate-pulse">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold block">🚨 RED-FLAG TRIAGE ALERT: {activeRedFlag.condition}</span>
            <span className="text-text-muted">{activeRedFlag.rationale}</span>
          </div>
        </div>
      )}

      {/* Current Active Question */}
      {!engineState.isComplete && currentQ ? (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Next Clinical Inquiry · {currentQ.field.toUpperCase()}
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-text mt-1 leading-snug">
                {currentQ.promptHi}
              </h4>
              <p className="text-sm text-text-muted mt-0.5">
                {currentQ.promptEn}
              </p>
            </div>

            <button
              onClick={speakCurrentQuestion}
              className={cn(
                "p-3 rounded-2xl border-2 transition-all shrink-0 animate-press",
                isSpeaking 
                  ? "bg-teal text-white border-teal ring-4 ring-teal/20" 
                  : "bg-surface border-border text-teal hover:border-teal/50"
              )}
              aria-label="Play question audio"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* Voice listener notification pill */}
          {voiceNotice && (
            <div className="bg-teal-light text-teal text-xs font-bold px-3 py-1.5 rounded-xl border border-teal/20 animate-pulse">
              {voiceNotice}
            </div>
          )}

          {/* Large Accessible Choices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice.id)}
                className="flex flex-col items-start p-4 rounded-2xl border-2 border-border bg-surface hover:border-primary hover:bg-primary-light transition-all text-left group animate-press min-h-[76px] justify-center"
              >
                <span className="font-bold text-text text-base leading-tight group-hover:text-primary">
                  {choice.labelHi}
                </span>
                <span className="text-xs text-text-muted font-medium mt-1">
                  {choice.labelEn}
                </span>
              </button>
            ))}
          </div>

          {/* Voice Interaction Option */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleVoiceAnswer}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal hover:underline"
            >
              <Mic className="w-4 h-4" /> Bol Kar Batayein (Tap to Speak Answer)
            </button>
            <span className="text-xs text-text-muted font-medium">
              Trained on Ministry of Ayush clinical intake standards
            </span>
          </div>
        </div>
      ) : (
        /* Completed State */
        <div className="bg-success-light/40 border border-success/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-success font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            Information Collected Successfully (जानकारी दर्ज कर ली गई है)
          </div>
          <p className="text-xs text-text-muted">
            All mandatory clinical history parameters have been elicited and structured into physician draft.
          </p>

          <div className="bg-surface rounded-xl p-3.5 border border-border text-xs text-text font-mono whitespace-pre-wrap leading-relaxed">
            {engineState.summaryDraft}
          </div>
        </div>
      )}
    </div>
  );
}
