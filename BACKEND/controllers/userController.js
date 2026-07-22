import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const markRoadmapComplete = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.roadmapCompleted) {
      user.roadmapCompleted = true;
      await user.save();
    }

    res.json({
      message: "Roadmap completed",
      roadmapCompleted: user.roadmapCompleted,
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating roadmap" });
  }
};

export const updateProfile = async (req, res) => {
  const { name, username } = req.body;

  const user = await User.findById(req.user.id);

  user.name = name;
  user.username = username;

  await user.save();

  res.json(user);
};

export const resetUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.roadmapCompleted = false;
    user.projectCompleted = false;
    user.codeReviewScore = 0;

    await user.save();

    res.json({ message: "User reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Reset failed" });
  }
};