import { Complaint } from "../../models";
import { ClinicalAiService } from "../../services/ai/geminiService";

export class HistoryEngineModule {
  public static getFollowUpQuestions(complaints: Complaint[]) {
    return complaints.flatMap(c => ClinicalAiService.getAdaptiveQuestions(c.anatomicalRegion));
  }
}
