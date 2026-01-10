import express from "express";
import multer from "multer";
import {
  getGoal,
} from "../controllers/goal.controller.js";
import protect from "../middlewares/auth.middlewares.js";

const goal_router = express.Router();
const upload = multer({ dest: "uploads/" });

// goal_router.route('/expense-analysis').post(protect,  createGoal);
goal_router.route('/expense-analysis').get(protect, getGoal);

export default goal_router;
