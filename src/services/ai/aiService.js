import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini using our secure API key
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

export const aiService = {
  generateRecipe: async (userPrompt) => {
    try {
      // We use gemini-1.5-flash as it is the fastest model and great for mobile
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // This is the core "Brain" of Foodby. 
      // We instruct it to follow your specific health and formatting rules.
      const systemInstruction = `
        You are 'Foodby', a friendly and expert culinary AI assistant.
        The user will give you a list of ingredients, a mood, or a health condition.
        
        YOUR RULES:
        1. Suggest exactly ONE highly possible recipe based on the user's input.
        2. HEALTH WARNING: You must strictly consider health. If they suggest unhealthy combos, or cooking methods like frying acidic food in aluminum plates, YOU MUST INCLUDE A WARNING.
        3. Keep the recipe simple and user-friendly.

        FORMAT:
        You MUST return your response as a valid JSON object so the app can read it. Do not include markdown formatting like \`\`\`json.
        Return EXACTLY this structure:
        {
          "name": "Recipe Title",
          "category": "Dinner", 
          "prepTime": "20 Mins",
          "difficulty": "Medium",
          "calories": "300 Cal",
          "ingredients": ["item 1", "item 2"],
          "instructions": "1. Step one.\\n2. Step two.",
          "warning": "Any health or cooking warning goes here. If none, leave empty."
        }
      `;

      const finalPrompt = `${systemInstruction}\n\nUser Request: ${userPrompt}`;

      const result = await model.generateContent(finalPrompt);
      const responseText = result.response.text();
      
      // Convert the text back into a Javascript object
      return JSON.parse(responseText);

    } catch (error) {
      console.error("Foodby Error:", error);
      throw new Error("Foodby is having trouble right now. Please try again.");
    }
  }
};