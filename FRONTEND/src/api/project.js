import API from "./api";

export const getProjects = (data) =>
  API.post("/projects/suggestions", data);