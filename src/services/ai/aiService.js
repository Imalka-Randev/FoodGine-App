import { GoogleGenerativeAI } from "@google/generative-ai";

// SECURITY NOTE: Storing the API key on the client is insecure for a production app 
// because it can be extracted from the JavaScript bundle. 
// For a production app, the Gemini API should be called from a backend server (e.g., Firebase Cloud Functions).
// However, since this is a Coursera learning project and a backend is unavailable (requires a paid plan),
// we are intentionally keeping it here for simplicity.
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
You are 'Foodby', a friendly and expert culinary AI assistant.
STRICT RULE: YOU MUST ONLY ANSWER QUESTIONS RELATED TO FOOD, COOKING, AND RECIPES. If a user asks about anything else (e.g., coding, politics, math), politely decline and steer the conversation back to food.

YOUR RULES:
1. Be concise, friendly, and helpful.
2. HEALTH WARNING: If they suggest dangerous cooking methods or unhealthy combos, gently warn them.

RECIPE WORKFLOW:
- When a user asks for general recommendations (e.g., "what's good for gastric people?"), DO NOT generate a JSON recipe. Simply suggest 2-3 options in plain text.
- Wait for the user to select one of the options. Once they select an option OR if they explicitly ask to generate a recipe, THEN you will provide the JSON block.
- If the user asks to modify the current recipe (e.g., "I don't have banana"), suggest alternatives and ask, "Shall I update the recipe?". If the user says "yes" or agrees, generate the updated JSON block.

JSON OUTPUT FORMAT:
When you generate or update a recipe, you MUST include a JSON block at the very end of your message. 
The JSON block must be enclosed in \`\`\`json and \`\`\` and match this EXACT structure:
{
  "name": "Recipe Title",
  "category": "Dinner", 
  "prepTime": "20 Mins",
  "difficulty": "Medium",
  "calories": "300 Cal",
  "servings": "2 Servings",
  "ingredients": ["item 1", "item 2"],
  "instructions": "1. Step one.\\n2. Step two.",
  "warning": "Any health warning. Leave empty if none."
}
Do not output the JSON block unless you are actually giving them a recipe to be pinned/saved.
`;

const sanitizeInput = (text) => {
  if (!text) return text;
  // Strip HTML tags to prevent injection
  const stripped = text.replace(/<[^>]*>?/gm, '');
  // Limit to 500 characters
  return stripped.substring(0, 500);
};

export const aiService = {
  sendMessage: async (history, userPrompt, audioBase64 = null) => {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3.5-flash",
      });

      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: "System Instruction: " + SYSTEM_INSTRUCTION }] },
          { role: 'model', parts: [{ text: "Understood, I will act as Foodby and strictly follow the JSON formatting and behavior constraints." }] },
          ...history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          }))
        ]
      });

      let messagePayload = sanitizeInput(userPrompt);
      if (audioBase64) {
        messagePayload = [
          { inlineData: { data: audioBase64, mimeType: "audio/m4a" } },
          { text: sanitizeInput(userPrompt) || "Respond to this audio in character." }
        ];
      }

      const result = await chat.sendMessage(messagePayload);
      const responseText = result.response.text();
      
      return responseText;
    } catch (error) {
      console.error("Foodby Error:", error);
      throw new Error("Foodby is having trouble right now. Please check your internet or try again later.");
    }
  },
  
  parseRecipeFromText: (text) => {
    const jsonMatch = text.match(/\`\`\`json\n([\s\S]*?)\n\`\`\`/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  
  cleanMessageText: (text) => {
    return text.replace(/\`\`\`json\n[\s\S]*?\n\`\`\`/, '').trim();
  }
};