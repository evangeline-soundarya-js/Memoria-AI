import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, AIModel, SummaryDetail } from "../types";
import { SYSTEM_PROMPT } from "../constants";

/**
 * Safely checks if an API key is available in the environment
 */
export const isIntelligenceEnabled = (): boolean => {
  try {
    const key = process.env.API_KEY;
    return !!(key && key.length > 5);
  } catch {
    return false;
  }
};

export const analyzeContent = async (
  input: string, 
  modelName: AIModel = 'gemini-3-flash-preview',
  detail: SummaryDetail = 'concise'
): Promise<AIResponse> => {
  if (!isIntelligenceEnabled()) {
    throw new Error("KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const instructionSet = detail === 'detailed' 
    ? "Perform an exhaustive deep-dive analysis." 
    : "Perform a rapid, high-level categorization.";

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: `INPUT: ${input}\n\nCONTEXT: ${instructionSet}` }] },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            platform: { type: Type.STRING },
            category: { type: Type.STRING },
            subcategory: { type: Type.STRING },
            aiInsight: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "platform", "category", "subcategory", "aiInsight", "keyPoints"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    const jsonStr = start !== -1 ? text.substring(start, end) : text;
    return JSON.parse(jsonStr) as AIResponse;

  } catch (error: any) {
    console.warn("AI Engine failed, falling back to manual entry:", error.message);
    throw error;
  }
};