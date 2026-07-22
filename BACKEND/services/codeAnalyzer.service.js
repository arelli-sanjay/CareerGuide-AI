import AdmZip from "adm-zip";
import { callGroq } from "../utils/groqService.js";

const validExt = ["js", "jsx", "ts", "tsx", "py", "java"];

export const analyzeZip = async (buffer) => {

  const zip = new AdmZip(buffer);

  let files = [];

  zip.getEntries().forEach((entry) => {
    if (entry.isDirectory) return;

    const fileName = entry.entryName;

    if (
      fileName.includes("node_modules") ||
      fileName.includes("dist") ||
      fileName.includes("build")
    ) return;

    const ext = fileName.split(".").pop();

    if (validExt.includes(ext)) {
      const content = entry.getData().toString("utf-8");

      files.push({
        name: fileName,
        content,
      });
    }
  });

  let responses = [];

  for (let file of files) {
    const chunks = file.content.match(/.{1,1500}/gs) || [];

    for (let chunk of chunks) {
      const prompt = `
      You are a senior software engineer.

      Analyze this code:

      ${chunk}

      Return JSON:
      {
        "score": 0,
        "strengths": [],
        "issues": [],
        "improvements": []
      }
      `;

      const res = await callGroq(prompt);

      try {
        const parsed = JSON.parse(res);
        responses.push(parsed);
      } catch {}
    }
  }

  let totalScore = 0;
  let strengths = [];
  let issues = [];
  let improvements = [];

  responses.forEach((r) => {
    totalScore += r.score || 0;
    strengths.push(...(r.strengths || []));
    issues.push(...(r.issues || []));
    improvements.push(...(r.improvements || []));
  });

  return {
    score: Math.round(totalScore / (responses.length || 1)),
    summary: "AI code review completed",
    strengths,
    issues,
    improvements,
    totalFiles: files.length,
  };
};