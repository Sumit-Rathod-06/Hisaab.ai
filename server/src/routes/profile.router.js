import express from "express";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/profile.controller.js";
import protect from "../middlewares/auth.middlewares.js";

const profile_router = express.Router();

profile_router.route("/").get(protect, getUserProfile);
profile_router.route("/").post(protect, createUserProfile);
profile_router.route("/").put(protect, updateUserProfile);
profile_router.route("/").delete(protect, deleteUserProfile);

export default profile_router;
