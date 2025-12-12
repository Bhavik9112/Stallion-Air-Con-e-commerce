import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Stallion Parts Expert", a knowledgeable assistant for Stallion Air Con & Refrigeration Spare Parts.
Your goal is to assist customers with:
1. Identifying spare parts from descriptions or photos (e.g., specific compressor models from labels, valve types).
2. Suggesting compatible replacements for obsolete parts (like Copeland, Danfoss, Emerson).
3. Helping them find products in our catalog (Compressors, Gases, Copper Pipes, Tools).
4. Explaining technical specifications of HVAC components.

Tone: Professional, Technical, Helpful.

Context:
- We do not show live prices due to market fluctuation.
- Users must add items to the "Quote Basket" to get a price.
- If a user uploads a photo of a part, analyze the label for Part Numbers, Refrigerant Type, Voltage, and Brand.

Key restrictions:
- Do not invent prices. Tell them to "Request a Quote".
- If identifying a part is risky or unclear, ask for more clear photos of the nameplate.
`;

export const sendMessageToGemini = async (
  history: { role: string; text: string }[],
  newMessage: string,
  imageBase64?: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Error: API Key is missing. Please configure the environment.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We use gemini-2.5-flash for fast, responsive chat
    const modelId = imageBase64 ? "gemini-2.5-flash-image" : "gemini-2.5-flash";

    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      });
    }
    
    parts.push({ text: newMessage });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: "user",
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 500,
        temperature: 0.4, // Lower temperature for more factual technical specs
      },
    });

    return response.text || "I'm having trouble identifying that part. Please try providing the Model Number directly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please use the Search bar to find your part.";
  }
};
