import pdfParse from "pdf-parse/lib/pdf-parse.js";
import getGeminiResponse from "../utils/geminiService.js";

const safeParse = (text) => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON parse error:", err);
    return {
      role: "Fallback",
      knownSkills: [],
      missingSkills: ["Try again later"]
    };
  }
};

const formatSkills = (skills = []) =>
  [...new Set(skills)]
    .flatMap((s) => String(s).split(","))
    .map((s) => s.trim())
    .filter(Boolean);

export const analyzeFull = async (req, res) => {
  try {
    let resumeText = "";
    let { role, completedSkills } = req.body;
    if (typeof completedSkills === "string") {
      completedSkills = completedSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (!Array.isArray(completedSkills)) {
      completedSkills = [];
    }

    if (req.file) {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text;
    }

    const prompt = `
      You are an expert career analyzer.

      Inputs:
      Resume:
      ${resumeText || "N/A"}

      Target Role:
      ${role || "Detect from resume"}

      User Completed Skills (if any):
      ${JSON.stringify(completedSkills)}

      Rules:
      - If resume is provided:
        • Detect likely role from resume (if role not given)
        • Extract skills from resume as Known Skills
        • Determine Missing Skills required for that role but not in resume

      - If only role is provided (no resume):
        • Known Skills = user completed skills (if any), else []
        • Missing Skills = all required skills for the role (minus any completed skills)

      - If both resume and role are provided:
        • Known Skills = resume skills
        • Missing Skills = required skills for that role minus resume skills

      Return ONLY JSON:
      {
        "role": "",
        "knownSkills": [],
        "missingSkills": []
      }
      `;

    const result = await getGeminiResponse(prompt);
    const parsed = safeParse(result);
    const knownSkills = formatSkills(parsed.knownSkills || completedSkills);
    const missingSkills = formatSkills(parsed.missingSkills || []);

    res.json({
      role: parsed.role || role || "",
      knownSkills,
      missingSkills,
    });
  } catch (err) {
    console.error("analyzeFull error:", err);
    if (err?.status === 429) {
      return res.status(429).json({ message: "API limit reached. Try later." });
    }
    res.status(500).json({ message: "Analysis failed" });
  }
};