import { GoogleGenAI, Type } from "@google/genai";
import { SymptomAnalysis, HealthRecordData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = ai.models;

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeSymptoms = async (symptoms: string): Promise<SymptomAnalysis> => {
  try {
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following symptoms: "${symptoms}". Provide a list of possible conditions, a severity level, and recommended next steps.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            possibleConditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            severity: {
              type: Type.STRING,
              enum: ['Low', 'Moderate', 'High']
            },
            recommendedNextSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          }
        },
      }
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw new Error("Failed to analyze symptoms. Please try again.");
  }
};


export const diagnoseImage = async (imageFile: File, context: string): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [
          {text: `Analyze this medical image of a ${context} and provide a possible diagnosis and recommendations. Disclaimer: This is an AI analysis and not a substitute for professional medical advice.`}, 
          imagePart
        ]},
    });
    return response.text;
  } catch (error) {
    console.error("Error diagnosing image:", error);
    throw new Error("Failed to diagnose image. Please try again.");
  }
};

export const scanHealthRecord = async (recordFile: File): Promise<HealthRecordData[]> => {
  try {
    const imagePart = await fileToGenerativePart(recordFile);
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: "Extract key medical values like Sugar levels, Hemoglobin, WBC, RBC, etc., from this health record. For each value, provide an insight ('Normal', 'Low', 'High', or 'N/A')." },
          imagePart
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING, description: "Name of the medical metric (e.g., 'Blood Sugar')" },
              value: { type: Type.STRING, description: "The extracted value (e.g., '120 mg/dL')" },
              insight: { type: Type.STRING, enum: ['Normal', 'Low', 'High', 'N/A'] }
            }
          }
        },
      }
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error scanning health record:", error);
    throw new Error("Failed to scan health record. Please try again.");
  }
};
