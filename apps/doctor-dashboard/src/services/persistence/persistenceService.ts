import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: ReturnType<typeof createClient> | null = null;
export const getSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseInstance;
};

export class PersistenceService {
  private static SESSION_VERSION = 2;
  private static SESSION_TTL_MS = 30 * 60 * 1000;
  private static STORAGE_KEY = "medikiosk_active_queue_v1";
  private static SESSION_KEY = "medikiosk_active_patient_session_v1";

  public static saveQueueLocal(items: unknown[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  public static loadQueueLocal<T = unknown>(): T[] | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
      return null;
    }
  }

  public static saveActiveSessionLocal(data: unknown): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({
        version: this.SESSION_VERSION,
        savedAt: Date.now(),
        data
      }));
    } catch (e) {
      console.warn("Could not save session to sessionStorage:", e);
    }
  }

  public static loadActiveSessionLocal<T = unknown>(): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(this.SESSION_KEY);
      if (!raw) return null;
      const envelope = JSON.parse(raw) as { version?: number; savedAt?: number; data?: T };
      if (envelope.version !== this.SESSION_VERSION || !envelope.savedAt || Date.now() - envelope.savedAt > this.SESSION_TTL_MS) {
        this.clearActiveSessionLocal();
        return null;
      }
      return envelope.data ?? null;
    } catch (e) {
      console.warn("Could not load session from sessionStorage:", e);
      return null;
    }
  }

  public static clearActiveSessionLocal(): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(this.SESSION_KEY);
    } catch (e) {
      console.warn("Could not clear session from sessionStorage:", e);
    }
  }
}
