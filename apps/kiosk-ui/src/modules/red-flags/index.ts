import { Complaint, RedFlag } from "../../models";
import { evaluateRedFlags } from "../../rules/redFlags";

export class RedFlagDetectionModule {
  public static analyze(sessionId: string, complaints: Complaint[]): { redFlags: RedFlag[]; isEmergency: boolean } {
    const flags = evaluateRedFlags(sessionId, complaints);
    const isEmergency = flags.some(f => f.severity === "emergency_code_red");
    return { redFlags: flags, isEmergency };
  }
}
