import { GoogleGenerativeAI } from "@google/generative-ai";
import prompt from "../prompt/prompt.js";
import "dotenv/config"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function AI_recommendation(degree, skill, location, interests) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Gemini API call
  const geminiCall = model.generateContent(
    prompt(degree, skill, location, interests)
  );

  // Timeout  (10 seconds)
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Recommendation timeout")), 150000)
  );

  try {
    const result = await Promise.race([geminiCall, timeout]);
    const recommendation = result.response.text();
    return recommendation;
  } catch (error) {
    return error.message;
  }
}

export default AI_recommendation;
