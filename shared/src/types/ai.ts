
export interface AIAssistantResponse {
  analysis: string;
  suggestedServices: {
    id: string;
    name: string;
    confidence: 'high' | 'medium' | 'low';
  }[];
}

export interface VisualEstimatorResponse {
  damagedParts: string[];
  damageType: string;
  assessment: string;
  suggestedServices: {
    id: string;
    name: string;
  }[];
}
