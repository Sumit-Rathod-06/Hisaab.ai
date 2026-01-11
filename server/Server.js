import express from "express";
import cors from "cors";
import auth_router from "./src/routes/auth.router.js";
import financeRoutes1 from "./src/routes/financeRoutes1.js";
import financeRoutes from "./src/routes/financeRoutes.js";
import expense_router from "./src/routes/expense.router.js";
import profile_router from "./src/routes/profile.router.js";
import protect from "./src/middlewares/auth.middlewares.js";
import goal_router from "./src/routes/goal.router.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", auth_router);
app.use("/api/finance", protect, financeRoutes);
// app.use("/api/finance", protect, financeRoutes1);
app.use("/api", expense_router);
app.use("/api/profile", profile_router);
app.use("/api/goals", goal_router);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
