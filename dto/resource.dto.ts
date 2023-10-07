export interface scores {
  score: number;
  maxScore: number;
}

export interface PromptPayload {
  title: string;
  timeframe: string;
  type: string;
  data?: string;
  date: Date;
  scores?: scores[];
}

export interface testPayload {
  title: string;
  day: number;
}

export interface submitTestPayload extends testPayload, scores {}
