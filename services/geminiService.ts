
import { GoogleGenAI } from "@google/genai";

// Función segura para obtener la API KEY
const getApiKey = () => {
  try {
    // Intentamos obtenerla de process.env (inyectada por el entorno)
    return (window as any).process?.env?.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const apiKey = getApiKey();

export const generateRomanticMessage = async (isFebruary: boolean): Promise<string> => {
  // Si no hay API KEY, devolvemos mensajes predeterminados para no romper la app
  if (!apiKey) {
    return isFebruary 
      ? "Feliz aniversario mi amor y que sean muchos más ❤️" 
      : "Cada segundo a tu lado es un tesoro que guardo en mi corazón.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = isFebruary 
      ? "Genera un mensaje muy romántico y profundo para un aniversario que cae el 27 de febrero. Debe ser corto, dulce y terminar con 'Feliz aniversario mi amor y que sean muchos más'."
      : "Genera una frase corta y profundamente romántica para celebrar un mes más de novios (aniversario mensual del día 27). No uses hashtags.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });

    return response.text?.trim() || "Te amo más que ayer.";
  } catch (error) {
    console.error("Error en Gemini:", error);
    return isFebruary 
      ? "Feliz aniversario mi amor y que sean muchos más" 
      : "Eres lo mejor que me ha pasado en la vida.";
  }
};
