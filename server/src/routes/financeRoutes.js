import express from "express";
import fs from "fs";
import path from "path";
import { getMCPClient } from "../mcpClient.js";

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

router.post("/milestone", async (req, res) => {
  req.setTimeout(300000);

  try {
    const { goalId, savedAmount, expectedAmount, expenseAnalysis } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!goalId) {
      return res.status(400).json({ error: "goalId is required" });
    }

    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "update_milestone",
        arguments: {
          user_id: userId,
          goal_id: goalId,
          saved_amount: savedAmount,
          expected_amount: expectedAmount,
          expense_analysis: expenseAnalysis
        }
      },
      undefined,
      { timeout: 300000 }
    );

    const rawText = result.content[0].text;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const json = JSON.parse(cleaned);

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
