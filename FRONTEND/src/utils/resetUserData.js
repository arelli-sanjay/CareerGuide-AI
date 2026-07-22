export const resetUserData = async (userId, API) => {
  try {
    console.log("FULL RESET STARTED");

    const keysToRemove = [
      `analysis_${userId}`,
      `roadmap_${userId}`,
      `projects_${userId}`,
      `selectedProject_${userId}`,
      `projectLocked_${userId}`,
      `completedSkills_${userId}`,
      `projectPlan`,
    ];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`week-${userId}`)) {
        localStorage.removeItem(key);
      }
    });

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    await API.post("/user/reset");

    console.log("FULL RESET DONE");

  } catch (err) {
    console.error(" RESET FAILED:", err);
  }
};