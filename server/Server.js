import express from "express";
import cors from "cors";
import auth_router from "./src/routes/auth.router.js";
import financeRoutes from "./src/routes/financeRoutes.js";

import expense_router from "./src/routes/expense.router.js";
import profile_router from "./src/routes/profile.router.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", auth_router);
app.use("/api/finance", financeRoutes);
app.use("/api", expense_router);
app.use("/api/profile", profile_router);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
