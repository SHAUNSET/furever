import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser } from "../controller/userController.js";

const userRoutes = express.Router();

// Temporary test route
userRoutes.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User routes are working!",
  });
});

// Current User Route
userRoutes.post("/getcurrentuser", isAuth, getCurrentUser);

export default userRoutes;