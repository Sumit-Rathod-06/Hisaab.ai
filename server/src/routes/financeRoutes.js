import express from "express";
import fs from "fs";
import path from "path";
import { getMCPClient } from "../mcpClient.js";
import db from "../config/db.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const router = express.Router();

/* ================================
   TEMP CSV STORAGE
================================ */

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const saveTransactionsAsCSV = (transactions, uploadId) => {
  const csvPath = path.join(uploadDir, `${uploadId}.csv`);

  const headers = [
    "txn_id",
    "date",
    "description",
    "amount",
    "ai_category"
  ];

  const rows = transactions.map((t, i) => [
    i + 1,
    t.date || "",
    `"${(t.description || "").replace(/,/g, " ").replace(/"/g, "")}"`,
    t.amount || 0,
    t.category || "Others"
  ].join(","));

  fs.writeFileSync(csvPath, [headers.join(","), ...rows].join("\n"));
  return csvPath;
};

router.get("/expense", async (req, res) => {
  req.setTimeout(300000);

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "expense_analysis",
        arguments: { user_id: userId },
      },
      undefined,
      {
        timeout: 300000,
      }
    );

    // Fix: Access the text inside the first array element
    const rawText = result.content[0].text;

    try {
      // Clean and Parse the JSON string into an object
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const jsonObject = JSON.parse(cleanedText);

      res.json(jsonObject);
    } catch (parseErr) {
      console.error("Expense JSON Parsing failed:", parseErr);
      res.json({ analysis: rawText });
    }
  } catch (err) {
    console.error("Expense analysis error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/upload", async (req, res) => {
  req.setTimeout(300000);

  try {
    const { pdfPath } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!pdfPath) return res.status(400).json({ error: "pdfPath is required" });

    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "upload_statement",
        arguments: {
          user_id: userId,
          pdf_path: pdfPath
        }
      },
      undefined,
      { timeout: 300000 }
    );

    const rawText = result?.content?.[0]?.text || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const transactions = JSON.parse(cleaned);

    const uploadId = crypto.randomUUID();
    saveTransactionsAsCSV(transactions, uploadId);

    res.json({
      success: true,
      upload_id: uploadId,
      total_transactions: transactions.length
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/alerts", async (req, res) => {
  req.setTimeout(300000);

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "alerts",
        arguments: { user_id: userId }
      },
      undefined,
      { timeout: 300000 }
    );

    const rawText = result.content[0].text;

    try {
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const jsonObject = JSON.parse(cleanedText);
      res.json(jsonObject);
    } catch {
      res.json({ alerts: rawText });
    }
  } catch (err) {
    console.error("Alerts tool error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   DELETE TRANSACTION (POSTGRES)
================================ */

router.delete("/transactions/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const transactionId = req.params.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const result = await db.query(
      `DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
      [transactionId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});


function updateMilestones(plan, savedAmount, expectedAmount, month) {
  const milestones = [...plan.milestones].sort(
    (a, b) => a.month - b.month
  );

  const saved = Number(savedAmount);
  const expected = Number(expectedAmount);

  const delta = saved - expected;

  const futureMilestones = milestones.filter(m => m.month > month);
  const remainingCount = futureMilestones.length;

  // Amount still needed for current month
  const currentMonthRemaining = Math.max(0, expected - saved);

  // Nothing to redistribute
  if (remainingCount === 0) {
    return {
      ...plan,
      milestones: milestones.map(m =>
        m.month === month
          ? { ...m, target_amount: Number(currentMonthRemaining.toFixed(2)) }
          : m
      )
    };
  }

  // Redistribute surplus or shortfall
  const adjustmentPerMonth = delta / remainingCount;

  const updatedMilestones = milestones.map(m => {
    // ✅ CURRENT MONTH
    if (m.month === month) {
      return {
        ...m,
        target_amount: Number(currentMonthRemaining.toFixed(2))
      };
    }

    // ✅ FUTURE MONTHS
    if (m.month > month) {
      let newTarget = m.target_amount - adjustmentPerMonth;

      // Safety: never negative
      newTarget = Math.max(0, newTarget);

      return {
        ...m,
        target_amount: Number(newTarget.toFixed(2))
      };
    }

    // Past months unchanged
    return m;
  });

  return {
    ...plan,
    milestones: updatedMilestones
  };
}



router.post("/milestone", async (req, res) => {
  req.setTimeout(300000);

  try {
    const { goalId, savedAmount, month, expectedAmount } = req.body;
    const userId = req.user?.id;
    const expenseAnalysisResult = await db.query(
      `SELECT total_expense, expense_count, category_wise_spending, top_3_categories, average_transaction_value FROM expense_analysis WHERE user_id = $1`,
      [userId]
    );

    const expenseAnalysis = expenseAnalysisResult.rows;

    console.log("Milestone update request:", { goalId, savedAmount, expectedAmount, expenseAnalysis, month });
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!goalId) {
      return res.status(400).json({ error: "goalId is required" });
    }

    // const mcp = await getMCPClient();

    // const result = await mcp.callTool(
    //   {
    //     name: "update_milestone",
    //     arguments: {
    //       user_id: userId,
    //       goal_id: goalId,
    //       saved_amount: savedAmount,
    //       expected_amount: expectedAmount,
    //       expense_analysis: expenseAnalysis
    //     }
    //   },
    //   undefined,
    //   { timeout: 300000 }
    // );

    // const rawText = result.content[0].text;
    // const cleaned = rawText.replace(/```json|```/g, "").trim();
    // const json = JSON.parse(cleaned);
    const json = {
    "goal": {
        "amount": 1000,
        "purpose": "Emergency funds",
        "time_period_months": 12
    },
    "milestones": [
        {
            "month": 1,
            "target_amount": 249.99
        },
        {
            "month": 6,
            "target_amount": 499.98
        },
        {
            "month": 9,
            "target_amount": 749.97
        },
        {
            "month": 12,
            "target_amount": 999.96
        }
    ],
    "feasibility": "Not Feasible",
    "recommendations": [
        "Since you're ₹200 short, explore freelancing in your area of expertise for 5-10 hours per week to bridge the savings gap.",
        "Given your high spending in \"Others\", meticulously track these expenses for the next two weeks to identify potential cuts of ₹100.",
        "Temporarily reduce your \"Food & Dining\" expenditure by ₹50 per week by opting for home-cooked meals more often."
    ],
    "required_monthly_saving": 83.33,
    "estimated_monthly_surplus": -783.02,
    "milestone_status": "Behind"
};

    const updatedPlan = updateMilestones(
      json,
      savedAmount,
      expectedAmount,
      month
    );
    console.log("Updated Plan after milestone adjustment:", updatedPlan);

    // -------- STORE IN DB --------
    const updateResult = await db.query(
      `
      UPDATE goals
      SET plan = $1
      WHERE id = $2 AND user_id = $3
      RETURNING plan
      `,
      [updatedPlan, goalId, userId]
    );
    res.json(json);
  } catch (err) {
    console.error("Milestone update error:", err);
    res.status(500).json({ error: err.message });
  }

});

// POST /api/finance/chat
router.post("/chat", async (req, res) => {
  req.setTimeout(300000);

  try {
    const userId = req.user?.id;
    const { question } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!question) {
      return res.status(400).json({ error: "question is required" });
    }

    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "finance_chat",
        arguments: {
          user_id: userId,
          question: question,
        },
      },
      undefined,
      { timeout: 300000 }
    );

    // MCP returns text in content array
    const rawText = result.content?.[0]?.text || "";

    // If the agent returns JSON, try parsing
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const json = JSON.parse(cleaned);
      return res.json(json);
    } catch {
      // Otherwise return plain text answer
      return res.json({ answer: rawText });
    }
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
