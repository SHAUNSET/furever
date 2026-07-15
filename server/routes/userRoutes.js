import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getAdmin, getCurrentUser } from "../controller/userController.js";
import adminAuth from "../middleware/adminAuth.js";


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

userRoutes.get("/getadmin", adminAuth, getAdmin);

export default userRoutes;