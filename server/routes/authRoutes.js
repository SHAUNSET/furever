import express from "express";
import { registeration , login, logout } from "../controller/authController.js";

const authRoutes = express.Router();

authRoutes.post("/registeration", registeration);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;