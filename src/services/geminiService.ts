import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalysisRequest } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function analyzeResume(request: AnalysisRequest): Promise<AnalysisResult> {
  const { resumeText, jobDescription } = request;

  const prompt = `
    Analyze the following resume text. 
    ${jobDescription ? `Compare it against this job description: ${jobDescription}` : "Provide a general professional analysis."}
    
    Extract the following information in a structured format:
    1. Suitability score (0-100) based on the ${jobDescription ? "job description" : "general professional standards"}.
    2. List of key skills found.
    3. A brief summary of the work experience.
    4. Key strengths found in the resume.
    5. Specific suggestions for improvement.
    6. Overall feedback.

    Resume Text:
    ${resumeText}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suitabilityScore: { type: Type.NUMBER },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experienceSummary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallFeedback: { type: Type.STRING },
        },
        required: ["suitabilityScore", "skills", "experienceSummary", "strengths", "improvements", "overallFeedback"],
      },
    },
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Failed to get analysis from AI");
  }

  return JSON.parse(resultText) as AnalysisResult;
}
