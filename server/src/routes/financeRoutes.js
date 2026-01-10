import express from "express";
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
  // req.setTimeout(300000);

  // try {
  //   const mcp = await getMCPClient();

  //   const result = await mcp.callTool(
  //     {
  //       name: "expense_analysis",
  //       arguments: {}
  //     },
  //     undefined,
  //     { timeout: 300000 }
  //   );

  //   // SAFETY CHECK
  //   const rawText =
  //     result?.content?.[0]?.text || "";

  //   if (!rawText) {
  //     return res.status(500).json({
  //       error: "Empty response from expense_analysis tool"
  //     });
  //   }

  //   // CLEAN + PARSE
  //   const cleanedText = rawText.replace(/json|/g, "").trim();
  //   const jsonObject = JSON.parse(cleanedText);

  //   // OPTIONAL: Validate minimum required fields
  //   if (!jsonObject.total_expense || !jsonObject.category_wise_spending) {
  //     return res.status(500).json({
  //       error: "Invalid expense analysis format",
  //       raw: jsonObject
  //     });
  //   }

  //   res.json(jsonObject);

  // } catch (err) {
  //   console.error("Expense analysis error:", err);
  //   res.status(500).json({ error: err.message });
  // }

  return res.json(
    {
      "total_expense": 2183.02,
      "expense_count": 20,
      "category_wise_spending": {
        "Others": 1110,
        "Food & Dining": 396,
        "Online Shopping": 260.12,
        "Mobile Recharge": 240.9,
        "Groceries": 110,
        "Pharmacy": 62,
        "Shopping": 4
      },
      "top_3_categories": [
        {
          "category": "Others",
          "amount": 1110
        },
        {
          "category": "Food & Dining",
          "amount": 396
        },
        {
          "category": "Online Shopping",
          "amount": 260.12
        }
      ],
      "average_transaction_value": 109.15,
      "highest_single_expense": {
        "amount": 396,
        "category": "Food & Dining",
        "description": "Paid to ZOMATO LIMITED",
        "date": "05 Dec 2025"
      },
      "ai_insights": [
        "Re-evaluating \"Others\" category expenses (₹1110, 50.8% of your spending) to identify and eliminate unnecessary subscriptions or recurring charges could save you ₹500+ annually.",
        "Reducing food and dining expenses by 25% (₹99 from ₹396) through meal prepping or cooking at home can free up ₹1188 annually for investments or debt repayment.",
        "Decreasing online shopping purchases by half (₹130.06 from ₹260.12) and investing that amount in an index fund with an average 7% annual return could yield approximately ₹140 next year."
      ]
    }
  )
});

/* ================================
   UPLOAD → MCP → CSV
================================ */

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

/* ================================
   READ TEMP CSV (FOR UI EDITING)
================================ */

router.get("/transactions/:upload_id", async (req, res) => {
  try {
    const { upload_id } = req.params;
    const csvPath = path.join(uploadDir, `${upload_id}.csv`);

    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: "Upload not found" });
    }

    const lines = fs.readFileSync(csvPath, "utf-8")
      .split("\n")
      .filter(Boolean);

    const headers = lines[0].split(",");

    const data = lines.slice(1).map(line => {
      const values = line.split(",");
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });

    res.json({ transactions: data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read CSV" });
  }
});

/* ================================
   SAVE ONLY MODIFIED TRANSACTIONS
================================ */

router.post("/transactions/modify", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const {
      upload_id,
      txn_id,
      corrected_category,
      corrected_description,
      corrected_amount
    } = req.body;

    await db.query(
      `
      INSERT INTO transaction_corrections (
        user_id,
        upload_id,
        txn_id,
        corrected_category,
        corrected_description,
        corrected_amount
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        userId,
        upload_id,
        txn_id,
        corrected_category,
        corrected_description,
        corrected_amount
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save correction" });
  }
});

/* ================================
   FINAL DB TRANSACTIONS VIEW
================================ */

router.get("/transactions", async (req, res) => {
  try {
    const userId = "cc683836-754d-498c-88cd-0c29acb7e50d";
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const result = await db.query(
      `
      SELECT
        id,
        upload_id,
        date,
        description,
        amount,
        transaction_type,
        category,
        created_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      count: result.rowCount,
      transactions: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
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

export default router;
