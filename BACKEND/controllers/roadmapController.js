import Roadmap from "../models/Roadmap.js";
import getGeminiResponse from "../utils/geminiService.js";

export const generateRoadmap = async (req, res) => {
  try {
    const { role, missingSkills } = req.body;

    const prompt = `
      Act as an expert mentor and generate a structured 4-5 week learning roadmap for "${role}" based on skill complexity.
      based on missing skills: ${missingSkills}.

      STRICT RULES:
      - ONLY include FREE learning resources
      - Prefer:
        - YouTube tutorials
        - Official documentation (MDN, React docs, etc.)
        - freeCodeCamp
        - GitHub repositories
        -freeCodeCamp
        -Coursera
        -edX
        -Udemy
        -GeeksforGeeks
        -roadmap.sh
        -MDN Web Docs
        -Apna College
        -CodeWithHarry
        -Hitesh Choudhary
        -Traversy Media
        -Programming with Mosh
        -The Net Ninja
        -DeepLearning.AI
        -Krish Naik
        -CampusX
        -Andrej Karpathy
        -Hugging Face
        -LangChain
        -takeUforward (Striver)
        -NeetCode
        -CodeHelp by Babbar
        -Aditya Verma
        -KodeKloud
        -TechWorld with Nana
        -AWS Skill Builder
        -Microsoft Learn
        -Google Cloud Skills Boost
        -TryHackMe
        -Hack The Box
        -NetworkChuck
        -John Hammond
        -Flutter Official
        -Philipp Lackner
        -Android Developers
        -Cisco Networking Academy
        -LeetCode
        -Codeforces
        -CodeChef
        -Kaggle
        -ByteByteGo
        -System Design Primer
        -Unity Learn
        -Unreal Engine Learning
        -Godot Docs
        -OWASP
        -Docker Curriculum
        -Kubernetes
        -Selenium Python
        -LearnWeb3
        -Solidity Docs
      - DO NOT include paid platforms like Udemy, Coursera and expired links.

      Return STRICT JSON:

      {
        "roadmap": [
          {
            "week": 1,
            "title": "",
            "topics": [],
            "goal": "",
            "estimatedTime": "",
            "days": [
              {
                "day": 1,
                "task": "",
                "duration": ""
              }
            ],
            Resources format:

      [
        {
          "title":"React Crash Course - Traversy Media",
          "type":"youtube",
          "link":"https://www.youtube.com/results?search_query=Traversy+Media+React+Crash+Course"
        },
        {
          "title":"React Official Documentation",
          "type":"docs",
          "link":"https://react.dev"
        },
        {
          "title":"MDN JavaScript Guide",
          "type":"docs",
          "link":"https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        },
        {
          "title":"Node.js Documentation",
          "type":"docs",
          "link":"https://nodejs.org/docs/latest/api/"
        }
      ]

      IMPORTANT:
      - Return 4 to 6 resources for every week.
      - Include BOTH YouTube tutorials and official documentation.
      - At least 2 YouTube resources.
      - At least 2 official documentation/resources.
      - NEVER return YouTube watch URLs (youtube.com/watch?v=...).
      - ALWAYS return YouTube search URLs in this format:
        https://www.youtube.com/results?search_query=<video_title>
      - Documentation links MUST be official websites only (React, MDN, Node.js, MongoDB, Express, Python, TensorFlow, etc.).
      - Every resource MUST include title, type, and link.
      - Ensure every link is valid and publicly accessible.
      - Return ONLY valid JSON.
            "projectTask": ""
          }
        ]
      }
      `;

    const result = await getGeminiResponse(prompt);
    let parsed = {};

    try {
      const clean = result.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      console.log(" JSON Parse Failed");
    }

    if (!parsed || !Array.isArray(parsed.roadmap)) {
      console.log(" Using fallback roadmap");

      parsed = {
        roadmap: [
          {
            week: 1,
            title: "Basic Web Development",
            topics: ["HTML", "CSS"],
            goal: "Start basics",
            estimatedTime: "5 hours",
            days: [
              { day: 1, task: "Learn HTML basics", duration: "1 hr" },
            ],
            resources: [
              {
                title: "HTML Crash Course",
                link: "https://www.youtube.com/watch?v=UB1O30fR-EE",
              },
            ],
            projectTask: "Build simple webpage",
          },
        ],
      };
    }

    const allowedDomains = [
      "youtube.com",
      "youtu.be",
      "freecodecamp.org",
      "developer.mozilla.org",
      "react.dev",
      "github.com",
      "w3schools.com",
    ];

    parsed.roadmap = (parsed.roadmap || []).map((week) => {
      let filteredResources = (week.resources || []).filter((res) =>
        allowedDomains.some((domain) =>
          res.link?.toLowerCase().includes(domain)
        )
      );

      if (filteredResources.length === 0) {
        filteredResources = [
          {
            title: "Search topic on YouTube",
            link: "https://www.youtube.com",
          },
        ];
      }

      return {
        ...week,
        resources: filteredResources,
      };
    });

    const roadmap = await Roadmap.create({
      role,
      weeks: parsed.roadmap.map((w) => ({
        weekNumber: w.week,
        title: w.title,
        topics: w.topics,
        goal: w.goal,
        estimatedTime: w.estimatedTime,
        days: w.days,
        resources: w.resources,
        projectTask: w.projectTask,
      })),
    });

    res.json({ roadmap: roadmap.weeks });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};



export const getWeekPlan = async (req, res) => {
  try {
    const { weekId } = req.params;

    const roadmap = await Roadmap.findOne().sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({ message: "No roadmap found" });
    }

    const week = roadmap.weeks.find(
      (w) => w.weekNumber === parseInt(weekId)
    );

    if (!week) {
      return res.status(404).json({ message: "Week not found" });
    }

    res.json(week);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};



export const getLatestRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne().sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({ message: "No roadmap found" });
    }

    res.json({ roadmap: roadmap.weeks });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleDay = async (req, res) => {
  try {
    const { weekId, dayId } = req.params;

    const roadmap = await Roadmap.findOne().sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    const week = roadmap.weeks.find(
      (w) => w.weekNumber === parseInt(weekId)
    );

    if (!week) {
      return res.status(404).json({ message: "Week not found" });
    }

    const day = week.days.find(
      (d) => d.day === parseInt(dayId)
    );

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    day.completed = !day.completed;

    week.completed = week.days.every((d) => d.completed);

    await roadmap.save();

    res.json({ message: "Updated", week });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};