import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AIAssistantResponse, VisualEstimatorResponse } from '../types';
import { availableServices } from './mockData';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this prototype, we'll allow it to fail if the key isn't set.
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = 'gemini-3-flash-preview';
// FIX: The 'gemini-3-flash-preview' model is for text only. Switched to 'gemini-2.5-flash-image' for visual analysis, as per the guidelines.
const visionModel = 'gemini-2.5-flash-image';

export const getServiceSuggestion = async (description: string): Promise<AIAssistantResponse> => {
  try {
    const serviceList = availableServices.map(s => `ID: ${s.id}, Name: ${s.name}`).join('\n');
    
    // FIX: Simplified prompt and removed JSON structure example, as responseSchema now enforces the output format.
    const prompt = `
      You are an expert car mechanic assistant for a Chilean company called RedMecánica. 
      A user has described a problem with their car in Spanish. Based on their description, identify the most likely technical issues and suggest which of the following services they might need. 
      Respond in Spanish in a helpful, conversational tone. Your entire response must be a single JSON object.

      User Description: "${description}"

      Available Services:
      ${serviceList}
    `;

    // FIX: Use responseSchema for robust JSON output, as recommended by Gemini API guidelines.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: 'A brief, user-friendly explanation in Spanish of what might be wrong.',
            },
            suggestedServices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  confidence: { type: Type.STRING },
                },
                required: ['id', 'name', 'confidence'],
              },
            },
          },
          required: ['analysis', 'suggestedServices'],
        },
      },
    });
    
    // FIX: Parse JSON directly from the response text. The use of responseSchema and responseMimeType makes regex matching unnecessary.
    if (!response.text) {
        throw new Error("Invalid JSON response from AI");
    }

    return JSON.parse(response.text);

  } catch (error) {
    console.error("Error getting service suggestion from Gemini:", error);
    // Return a fallback response on error
    return {
      analysis: 'No pudimos procesar tu solicitud en este momento. Por favor, intenta seleccionar un servicio de la lista.',
      suggestedServices: [],
    };
  }
};

export const estimateVisualDamage = async (imageBase64: string, mimeType: string): Promise<VisualEstimatorResponse> => {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };

    const textPart = {
      text: `
        You are an expert in automotive bodywork and damage assessment for a Chilean audience. Analyze the provided image of a car. 
        Identify the damaged parts (e.g., bumper, fender, door) and describe the type of damage (e.g., scratch, dent, crack) in Spanish. 
        Provide a preliminary, non-binding assessment of the repair complexity. Respond in a structured JSON format. Do not wrap the JSON in markdown backticks.

        Your JSON output should look EXACTLY like this:
        {
          "damagedParts": ["parachoques_delantero", "tapabarro_izquierdo"],
          "damageType": "rayones profundos y una abolladura mediana",
          "assessment": "El daño parece ser cosmético, pero podría requerir lijado, relleno y pintura profesional. Es poco probable que las piezas necesiten un reemplazo completo, pero se requiere una inspección presencial para una cotización final.",
          "suggestedServices": [
             { "id": "body_repair", "name": "Desabolladura y Pintura" }
          ]
        }
      `,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: visionModel,
      contents: { parts: [imagePart, textPart] },
    });

    const jsonString = response.text.match(/{[\s\S]*}/);
     if (!jsonString) {
        throw new Error("Invalid JSON response from AI");
    }

    return JSON.parse(jsonString[0]);

  } catch (error) {
    console.error("Error estimating visual damage from Gemini:", error);
    return {
      damagedParts: [],
      damageType: 'Error',
      assessment: 'No pudimos analizar la imagen. Por favor, intenta de nuevo o describe el problema.',
      suggestedServices: [],
    };
  }
};