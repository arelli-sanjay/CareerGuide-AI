import API from "./api";

export const generateRoadmapAPI = (data) =>
  API.post("/roadmap/generate", data);

export const getWeekPlanAPI = (weekId) =>
  API.get(`/roadmap/week/${weekId}`);