export interface EconomicActivity {
  order: number;
  activity: string;
  percentage: number;
  startDate: string;
  endDate: string | null;
}

export interface DocumentData {
  name: string | null;
  curp: string | null;
  rfc: string | null;
  dateOfBirth: string | null;
  confidence: number;
  economicActivities?: EconomicActivity[];
}

export interface OcrProvider {
  extractData(imageBase64: string, mimeType: string): Promise<DocumentData>;
}
