import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const callGroq = async (message, history = []) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are an API that returns ONLY valid JSON when requested.

Rules:
- NO markdown
- NO explanation unless asked
- Always follow the exact format
- Ensure valid JSON
          `,
        },

        ...history,

        {
          role: "user",
          content: message,
        },
      ],

      temperature: 0.6,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || "";

  } catch (err) {
    console.error(" Groq Error:", err.message);

    return JSON.stringify({
      error: "AI service temporarily unavailable",
    });
  }
};