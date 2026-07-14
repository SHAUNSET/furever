import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId) => {
  try {
    const token = jwt.sign(
      {
        userId, // ✅ Changed from id to userId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};


export const generateAdminToken = () => {
  try {
    return jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
  } catch (error) {
    console.error("Admin Token Error:", error);
    throw new Error("Admin token generation failed");
  }
};