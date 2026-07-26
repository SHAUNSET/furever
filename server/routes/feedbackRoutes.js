import express from "express";
import { sendFeedback } from "../controller/feedbackController.js";

const feedbackRoutes = express.Router();

feedbackRoutes.post("/send", sendFeedback);

export default feedbackRoutes;