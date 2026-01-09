import jwt from "jsonwebtoken";
import express from "express";
import {register, login} from "../controllers/auth.controller.js";
const auth_router = express.Router();

auth_router.route('/register').post(register);
auth_router.route('/login').post(login);
auth_router.get("/validate-token", (req, res) => {
  console.log("Validating token...");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ valid: false });
  console.log("Token found:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("Token valid for user:", decoded.id);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(403).json({ valid: false });
  }
});
export default auth_router;