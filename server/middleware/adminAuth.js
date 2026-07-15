import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { adminToken } = req.cookies;

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Admin Login Required",
      });
    }

    const verifyToken = jwt.verify(adminToken, process.env.JWT_SECRET);

    if (!verifyToken || verifyToken.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.admin = verifyToken;

    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Admin Authentication Error",
    });
  }
};

export default adminAuth;