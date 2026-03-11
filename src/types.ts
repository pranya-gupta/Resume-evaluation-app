export interface AnalysisResult {
  suitabilityScore: number;
  skills: string[];
  experienceSummary: string;
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
}

export interface AnalysisRequest {
  resumeText: string;
  jobDescription?: string;
}
