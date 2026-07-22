import getGeminiResponse from "../utils/geminiService.js";
import { callGroq } from "../utils/groqService.js";

const parseAIJSON = (raw) => {
  try {
    let clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON found");
    }

    clean = clean.substring(start, end + 1);

    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON Parse Failed:\n", raw);
    return {};
  }
};

const normalizeProjects = (projects = []) => {
  return projects.map((p) => {
    let techStack = [];

    if (Array.isArray(p.techStack)) techStack = p.techStack;
    else if (Array.isArray(p.skills_used)) techStack = p.skills_used;
    else if (Array.isArray(p.full_stack_technologies))
      techStack = p.full_stack_technologies;
    else if (typeof p.skills_used === "object")
      techStack = Object.values(p.skills_used).flat();

    return {
      title: p.title || p.name || "Project",
      description: p.description || "",
      difficulty: p.difficulty || "intermediate",
      keyFeatures: p.keyFeatures || p.key_features || [],
      techStack: techStack,
    };
  });
};

const filterProjects = (projects, skills) => {
  if (!projects || !Array.isArray(projects)) return [];

  return projects.filter((project) =>
    Array.isArray(project.techStack) &&
    skills.some((skill) =>
      project.techStack.join(" ").toLowerCase().includes(skill.toLowerCase())
    )
  );
};

const sanitizeDays = (days) => {
  if (!Array.isArray(days)) return [];

  const uniqueDays = [];
  const seen = new Set();

  for (let i = 0; i < days.length; i++) {
    let d = days[i];
    let dayNum = i + 1;

    if (seen.has(dayNum)) continue;

    seen.add(dayNum);

    uniqueDays.push({
      day: dayNum,
      task: d.task || "Work on project",
      duration: "1-3 hrs",
    });
  }

  return uniqueDays.slice(0, 7);
};

//Generate Projects
export const generateProjects = async (req, res) => {
  try {
    const { role, skills } = req.body;

    const fallbackProjects = [
  {
    title: "To-Do App",
    description: "Task manager using React",
    difficulty: "easy",
    keyFeatures: ["Add/Delete Tasks", "Local Storage"],
    techStack: ["JavaScript", "React"]
  },
  {
    title: "Weather App",
    description: "Fetch API weather data",
    difficulty: "easy",
    keyFeatures: ["API Call", "UI Display"],
    techStack: ["JavaScript", "React"]
  },
  {
    title: "Blog Platform",
    description: "CRUD blog system",
    difficulty: "intermediate",
    keyFeatures: ["Create/Edit/Delete"],
    techStack: ["React", "Node"]
  },
  {
    title: "Chat App",
    description: "Realtime messaging",
    difficulty: "intermediate",
    keyFeatures: ["WebSockets"],
    techStack: ["React", "Node"]
  },
  {
    title: "E-commerce",
    description: "Full stack shopping app",
    difficulty: "advanced",
    keyFeatures: ["Cart", "Auth"],
    techStack: ["React", "Node"]
  },
  {
    title: "AI Dashboard",
    description: "Analytics dashboard",
    difficulty: "advanced",
    keyFeatures: ["Charts"],
    techStack: ["React"]
  }
];

    const prompt = `Generate EXACTLY 6 real-world ${role} projects (2 easy, 2 intermediate, 2 advanced). Return ONLY JSON in this format: {"projects":[{"title":"","description":"","difficulty":"easy|intermediate|advanced","keyFeatures":[],"techStack":[]}]} Do NOT return anything else.`;
    const result = await getGeminiResponse(prompt);

    console.log("RAW PROJECT RESPONSE:\n", result);

    const parsed = parseAIJSON(result);
    let safeProjects = parsed.projects;

    if (!safeProjects || !Array.isArray(safeProjects)) {
      console.log("Invalid AI response → using fallback projects");
      safeProjects = fallbackProjects;
    }

    const normalized = normalizeProjects(parsed.projects || []);
    const filtered = filterProjects(normalized, skills);
    const finalProjects =
      filtered.length >= 2 ? filtered : normalized;

    res.json({ projects: finalProjects });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to generate projects",
      projects: [],
    });
  }
};

//Project Plan
export const generateProjectPlan = async (req, res) => {
  try {
    const { title, difficulty, techStack } = req.body;

    let totalDays = 7;

    if (difficulty === "easy") totalDays = 5;
    else if (difficulty === "intermediate") totalDays = 10;
    else if (difficulty === "advanced") totalDays = 14;

    const prompt = `
      Create a COMPLETE day-by-day plan for project: ${title}

      Tech stack: ${techStack}
      Difficulty: ${difficulty}

      STRICT RULES:
      - Generate EXACTLY ${totalDays} days
      - Each day must contain:
        day number, task, duration
      - Duration must be "1-3 hrs"
      - Tasks must progress logically (start → build → finish)

      Return ONLY JSON:
      {
        "days": [
          { "day": 1, "task": "", "duration": "1-3 hrs" }
        ],
        "resources": [
          { "title": "", "link": "" }
        ],
        "finalGoal": ""
      }
      `;

    let parsed = {};

    try {
      const result = await getGeminiResponse(prompt);
      parsed = parseAIJSON(result);
    } catch (err) {
      console.log(" Gemini failed → using fallback");
    }

    if (!parsed.days || !Array.isArray(parsed.days)) {
      parsed = {
        days: Array.from({ length: totalDays }, (_, i) => ({
          day: i + 1,
          task: `Work on ${title} - Step ${i + 1}`,
          duration: "1-3 hrs"
        })),
        resources: [
          {
            title: "Search on YouTube",
            link: "https://www.youtube.com"
          }
        ],
        finalGoal: `Complete ${title} project`
      };
    }

    const sanitizeDays = (days, maxDays) => {
      if (!Array.isArray(days)) return [];

      const unique = [];
      const seen = new Set();

      for (let i = 0; i < days.length; i++) {
        let dayNum = i + 1;

        if (seen.has(dayNum)) continue;
        seen.add(dayNum);

        unique.push({
          day: dayNum,
          task: days[i]?.task || "Work on project",
          duration: "1-3 hrs"
        });
      }

      return unique.slice(0, maxDays);
    };

    parsed.days = sanitizeDays(parsed.days, totalDays);

    parsed.resources = (parsed.resources || []).filter(
      (r) => r.link && r.link.startsWith("http")
    );

    if (!parsed.resources.length) {
      parsed.resources = [
        {
          title: "Search on YouTube",
          link: "https://www.youtube.com"
        }
      ];
    }

    if (!parsed.finalGoal) {
      parsed.finalGoal = `Complete ${title} project`;
    }

    res.json(parsed);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      days: [],
      resources: [],
      finalGoal: "Complete project"
    });
  }
};

//PROJECT CHAT 
    export const projectChat = async (req, res) => {
      try {
        const { message, project } = req.body;

        const response = await getGeminiResponse(`
            Project: ${project.title}
            Tech: ${project.techStack}

            ${message}
        `);

        res.json({ reply: response });

      } catch (err) {
        console.error(err);
        res.json({ reply: "Something went wrong" });
      }
    };