import express from "express";
import multer from "multer";
import {
  createExpenseAnalysis,
  getExpenseAnalysis,
} from "../controllers/expense.controller.js";
import protect from "../middlewares/auth.middlewares.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// router.post(
//   "/expense-analysis",
//   upload.single("pdf"),
//   createExpenseAnalysis
// );

// router.get(
//   "/expense-analysis",
//   getExpenseAnalysis
// );

router.route('/expense-analysis').post(protect, upload.single('pdf'), createExpenseAnalysis);
router.route('/expense-analysis').get(protect, getExpenseAnalysis);

export default router;
