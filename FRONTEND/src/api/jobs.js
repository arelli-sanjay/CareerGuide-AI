import API from "./api";

export const getJobRecommendations = (data) =>
  API.post("/jobs/recommend", data);