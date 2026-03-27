import { genAI, genAIModel } from "../config/google-ai.config.js";

const VALID_CATEGORIES = [
  "groceries",
  "dining",
  "transportation",
  "utilities",
  "entertainment",
  "shopping",
  "healthcare",
  "travel",
  "housing",
  "income",
  "investments",
  "other",
];

export const suggestCategoryService = async (title, type) => {
  const prompt = `You are a financial transaction categorizer.
  Given a transaction title and type, suggest the best category.

  Transaction title: "${title}"
  Transaction type: "${type}"

  Available categories: ${VALID_CATEGORIES.join(", ")}

  Rules:
  - Return ONLY a valid JSON object, no explanation
  - category must be exactly one from the available list
  - confidence is a number 0-100
  - reasoning is one short sentence

  Response format:
  {
    "category": "groceries",
    "confidence": 95,
    "reasoning": "Title mentions grocery shopping"
  }`;

  try {
    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0,
      },
    });

    const text = result.text;
    const parsed = JSON.parse(text);

    if (!VALID_CATEGORIES.includes(parsed.category)) {
      return {
        category: "other",
        confidence: 0,
        reasoning: "Could not determine category",
      };
    }

    return parsed;
  } catch (error) {
    console.error("Categorize Service Error:", error);
    return {
      category: "other",
      confidence: 0,
      reasoning: "Could not determine category",
    };
  }
};
