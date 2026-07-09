import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    console.log("JWT User ID:", req.userId);

    const user = await User.findById(req.userId).select("-password");

    console.log("Mongo User:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("getCurrentUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};