import getGeminiResponse from "../utils/geminiService.js";

// SAFE JSON PARSER 
const parseAIJSON = (raw) => {
  try {
    let clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return {};
    }

    clean = clean.substring(start, end + 1);

    return JSON.parse(clean);
  } catch (err) {
    console.log("Invalid AI JSON");
    return {};
  }
};

// FALLBACK JOBS
const fallbackJobs = [
  {
    title: "Frontend Developer",
    matchReason: "Based on your frontend skills.",
    requiredSkills: ["HTML", "CSS", "JavaScript"]
  },
  {
    title: "React Developer",
    matchReason: "Good React development foundation.",
    requiredSkills: ["React", "JavaScript"]
  },
  {
    title: "UI Developer",
    matchReason: "Strong user interface skills.",
    requiredSkills: ["HTML", "CSS"]
  },
  {
    title: "Full Stack Developer",
    matchReason: "Frontend + backend exposure.",
    requiredSkills: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "JavaScript Developer",
    matchReason: "Good JavaScript knowledge.",
    requiredSkills: ["JavaScript"]
  },
  {
    title: "API Integration Developer",
    matchReason: "Experience integrating APIs.",
    requiredSkills: ["REST API"]
  },
  {
    title: "Junior Software Engineer",
    matchReason: "Entry-level software development role.",
    requiredSkills: ["JavaScript", "Git"]
  },
  {
    title: "Web Developer",
    matchReason: "Suitable based on your project experience.",
    requiredSkills: ["HTML", "CSS", "JavaScript"]
  }
];

// SCORE JOBS
const scoreJobs = (jobs, skills = []) => {

  return jobs
    .map((job) => {

      const required = Array.isArray(job.requiredSkills)
        ? job.requiredSkills
        : [];

      const score = skills.filter(skill =>
        required.join(" ").toLowerCase().includes(skill.toLowerCase())
      ).length;

      return {
        ...job,
        score
      };

    })
    .sort((a, b) => b.score - a.score);

};

export const recommendJobs = async (req, res) => {

  try {
    const {
      role,
      completedSkills = [],
      project
    } = req.body;

    if (!Array.isArray(completedSkills) || completedSkills.length === 0) {
      return res.status(400).json({
        message: "No skills provided",
        jobs: []
      });
    }

    const prompt = `
      You are an expert Career Advisor.

      Role:
      ${role}

      Skills:
      ${completedSkills.join(", ")}

      Project:
      ${project?.title || "No Project"}

      Tech Stack:
      ${project?.techStack?.join(", ") || "None"}

      Generate EXACTLY 8 realistic software jobs.

      Rules:
      - Beginner + Intermediate
      - Match the skills
      - Match the project
      - No explanations
      - Return ONLY JSON

      {
        "jobs":[
          {
            "title":"",
            "matchReason":"",
            "requiredSkills":[]
          }
        ]
      }
      `;

    const result = await getGeminiResponse(prompt);

    console.log("RAW JOB RESPONSE:\n", result);

    let parsed = parseAIJSON(result);

    if (
      !parsed.jobs ||
      !Array.isArray(parsed.jobs) ||
      parsed.jobs.length === 0
    ) {

      console.log("Using fallback jobs");

      parsed = {
        jobs: fallbackJobs
      };

    }

    const rankedJobs = scoreJobs(parsed.jobs, completedSkills);

    res.json({
      jobs: rankedJobs.slice(0, 8)
    });

  }

  catch (err) {
    console.error(err);
    res.json({
      jobs: fallbackJobs
    });

  }

};