
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (userPrompt: string, history: {role: 'user' | 'model', text: string}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })).concat({
        role: 'user',
        parts: [{ text: userPrompt }]
      }),
      config: {
        systemInstruction: "Tu es l'assistant intelligent de PayCongo, une fintech en République Démocratique du Congo. Aide les utilisateurs à comprendre comment créer des cartes virtuelles, les frais de transaction, et donne des conseils financiers simples en français. Sois amical et concis.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.";
  }
};
