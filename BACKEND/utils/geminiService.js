import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(message);
    const response = await result.response;

    return response.text();

  } catch (err) {
    console.error("Gemini Error:", err.message);

    if (err.status === 429) {
      console.log(" Gemini quota exceeded, using fallback");

      return JSON.stringify({
        role: "Frontend Developer",
        knownSkills: ["HTML", "CSS"],
        missingSkills: ["JavaScript", "React", "API Integration"]
      });
    }

    return JSON.stringify({
      role: "Unknown",
      knownSkills: [],
      missingSkills: ["Something went wrong, try again later"]
    });
  }
};

export default getGeminiResponse;
