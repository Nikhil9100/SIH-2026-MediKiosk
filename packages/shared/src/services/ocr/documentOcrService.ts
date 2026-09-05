import { ExtractedMedicalEntity } from "../../models";

export interface OcrExtractionResult {
  medications: ExtractedMedicalEntity[];
  labValues: ExtractedMedicalEntity[];
  confidence: number;
  status: "UNAVAILABLE" | "EXTRACTED";
  message: string;
}

export class DocumentOcrService {
  public static extractEntitiesFromDocument(_docId: string = "doc-unavailable"): OcrExtractionResult {
    return {
      medications: [],
      labValues: [],
      confidence: 0,
      status: "UNAVAILABLE",
      message: "OCR provider is not configured. No clinical facts were extracted."
    };
  }
}
