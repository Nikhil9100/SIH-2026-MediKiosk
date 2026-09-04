export class VoiceService {
  private static isSpeaking: boolean = false;

  public static speak(text: string, lang: string = "hi-IN", onEnd?: () => void): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.92;
      
      utterance.onstart = () => { VoiceService.isSpeaking = true; };
      utterance.onend = () => { 
        VoiceService.isSpeaking = false; 
        onEnd?.();
      };
      utterance.onerror = () => { 
        VoiceService.isSpeaking = false; 
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Voice speech error:", err);
    }
  }

  public static stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      VoiceService.isSpeaking = false;
    }
  }

  public static isAudioActive(): boolean {
    return VoiceService.isSpeaking;
  }
}
