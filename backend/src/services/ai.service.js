import { GoogleGenAI } from "@google/genai";
import { Env } from "../config/env.config.js";
import { ADVISOR_SYSTEM_PROMPT } from "../utils/prompt.js";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: Env.GEMINI_API_KEY });

export const generateFinancialAdviceService = async (context, userMessage) => {
    if (!Env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing. AI features are currently disabled.");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Context:\n${context}\n\nUser Query: ${userMessage}`,
            config: {
                systemInstruction: ADVISOR_SYSTEM_PROMPT,
                temperature: 0.7,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("AI Service Error:", error?.message || error);
        
        if (error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.toLowerCase().includes("daily limit")) {
           throw new Error("The AI has hit its API quota limit. Please try again later. Your data remains perfectly safe.");
        }
        throw new Error("Failed to generate financial advice. Please try again later.");
    }
};
