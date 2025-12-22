
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
    // Fix: Initialization must use the named parameter `apiKey` with `process.env.API_KEY` exclusively.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fix: Select the recommended Gemini 3 Flash model for basic text and vision tasks.
    const modelId = "gemini-3-flash-preview";

    const parts: any[] = [];
    
    if (imageBase64) {
      // Fix: Strip data URI prefix as Gemini API expects raw base64 data.
      const base64Data = imageBase64.includes('base64,') 
        ? imageBase64.split('base64,')[1] 
        : imageBase64;
        
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }
    
    parts.push({ text: newMessage });

    // Fix: When `maxOutputTokens` is specified for Gemini 3 series, `thinkingConfig.thinkingBudget` must also be set.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 500,
        thinkingConfig: { thinkingBudget: 100 },
        temperature: 0.4, // Lower temperature for more factual technical specs
      },
    });

    // Fix: Access `.text` as a property, not a method.
    return response.text || "I'm having trouble identifying that part. Please try providing the Model Number directly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please use the Search bar to find your part.";
  }
};
