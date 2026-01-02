
import { GoogleGenAI } from "@google/genai";

// Initialize with process.env.API_KEY directly as a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRomanticMessage = async (isFebruary: boolean): Promise<string> => {
  try {
    const prompt = isFebruary 
      ? "Genera un mensaje muy romántico y profundo para un aniversario que cae el 27 de febrero. Debe ser corto, dulce y terminar con 'Feliz aniversario mi amor y que sean muchos más'."
      : "Genera una frase corta y profundamente romántica para celebrar un mes más de novios (aniversario mensual del día 27). No uses hashtags.";

    // Call generateContent with model name and contents.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });

    // Extract text output using the .text property.
    return response.text?.trim() || "Cada día a tu lado es un regalo.";
  } catch (error) {
    console.error("Error generating message:", error);
    return isFebruary ? "Feliz aniversario mi amor y que sean muchos más" : "Te amo más que ayer.";
  }
};
