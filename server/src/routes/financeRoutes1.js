import express from "express";
import { getMCPClient } from "../mcpClient.js";
import db from "../config/db.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}.pdf`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDFs allowed"), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

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
  //   const cleanedText = rawText.replace(/```json|```/g, "").trim();
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


router.post("/goal", async (req, res) => {
//   req.setTimeout(300000);

//   try {
//     const { amount, months, purpose } = req.body;
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const mcp = await getMCPClient();

//     const result = await mcp.callTool(
//       {
//         name: "set_goal",
//         arguments: { user_id: userId, amount, months, purpose },
//       },
//       undefined,
//       { timeout: 300000 }
//     );

//     // 1. Extract the text string
//     const rawText = result.content[0].text;

//     try {
//       // 2. Clean and Parse the JSON
//       const cleanedText = rawText.replace(/```json|```/g, "").trim();
//       const jsonObject = JSON.parse(cleanedText);

//       // 3. Return the parsed goal object
//       res.json(jsonObject);
//     } catch (parseErr) {
//       // If the response isn't JSON (e.g., just a success string), return it as text
//       res.json({ message: rawText });
//     }
//   } catch (err) {
//     console.error("Goal creation error:", err);
//     res.status(500).json({ error: err.message });
//   }
    return res.json({
    "goal": {
        "purpose": "Emergency funds",
        "amount": 1000,
        "time_period_months": 12
    },
    "required_monthly_saving": 83.33,
    "estimated_monthly_surplus": -783.02,
    "feasibility": "Not Feasible",
    "milestones": [
        {
            "month": 3,
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
    "recommendations": [
        "Increase your monthly income by $400 through a part-time job or side hustle.",
        "Reduce discretionary spending on entertainment and dining out by $200 per month.",
        "Transfer $200 per month from existing investment accounts with low liquidity to a high-yield savings account."
    ]
});
});

router.get("/alerts", async (req, res) => {
  // req.setTimeout(300000);

  // try {
  //   const userId = req.user?.id;
  //   if (!userId) return res.status(401).json({ error: "Unauthorized" });

  //   const mcp = await getMCPClient();

  //   const result = await mcp.callTool(
  //     {
  //       name: "alerts",
  //       arguments: { user_id: userId }
  //     },
  //     undefined,
  //     { timeout: 300000 }
  //   );

  //   const rawText = result.content[0].text;

  //   try {
  //     const cleanedText = rawText.replace(/json|/g, "").trim();
  //     const jsonObject = JSON.parse(cleanedText);
  //     res.json(jsonObject);
  //   } catch {
  //     res.json({ alerts: rawText });
  //   }
  // } catch (err) {
  //   console.error("Alerts tool error:", err);
  //   res.status(500).json({ error: err.message });
  // }
  return res.json({
    alerts: [
      {
        alert_id: "A1",
        type: "Category Overspending",
        severity: "High",
        message: "Others accounts for 60.5% of total expenses",
        recommendations: [
          "Categorize the \"Others\" transactions from the last month to identify specific spending patterns.",
          "Reduce \"Others\" spending by $411 next month, aligning it with 45% of total expenses."
        ]
      },
      {
        alert_id: "A2",
        type: "Uncategorized Expense Risk",
        severity: "High",
        message: "Uncategorized expenses form 60.5% of total spending",
        recommendations: [
          "Dedicate 30 minutes this week to categorize your past \"Others\" transactions in your expense tracking app.",
          "Set a weekly \"Others\" spending limit of $100 in your budgeting app to reduce uncategorized expenses."
        ]
      },
      {
        alert_id: "A3",
        type: "Expense Concentration Risk",
        severity: "High",
        message: "Others dominates spending at 60.5%",
        recommendations: [
          "Analyze \"Others\" transactions to identify potential subcategories, aiming to reduce spending by 10% next month.",
          "Allocate an additional $200 to \"Food & Dining\" to reduce reliance on uncategorized spending."
        ]
      },
      {
        alert_id: "A4",
        type: "Large One-time Expense",
        severity: "Medium",
        message: "Single expense of ₹504.0 detected in Others",
        recommendations: [
          "Review the \"Others\" category transactions to identify the source of the ₹504 expense and ensure it aligns with your budget.",
          "Allocate ₹504 from your next paycheck's discretionary spending towards replenishing your emergency fund."
        ]
      }
    ]
  });
});

/* ================================
   UPLOAD → MCP → CSV
================================ */

router.post(
  "/upload",
  upload.single("pdf"),   // 🔥 THIS WAS MISSING
  async (req, res) => {
    req.setTimeout(300000);

    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" });
      }

      // ✅ THIS is the real pdfPath
      const pdfPath = req.file.path;

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
  }
);

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

router.get("/summary", async (req, res) => {
  req.setTimeout(300000);

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "cfo_summary",
        arguments: { user_id: userId },
      },
      undefined,
      { timeout: 300000 }
    );

    // 1. Extract the string from the MCP response structure
    // result.content is usually [{ type: 'text', text: '...' }]
    const rawText = result.content[0].text;

    try {
      // 2. Parse the string into a JSON object
      const jsonObject = JSON.parse(rawText);

      // 3. Send the actual object to the frontend
      res.json(jsonObject);
    } catch (parseErr) {
      console.error("JSON Parsing failed. Sending raw text as fallback.");
      // Fallback: If the AI returns malformed JSON, send the raw text
      res.json({ error: "Failed to parse summary", rawText });
    }
  } catch (err) {
    console.error("CFO Summary error:", err);
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

export default router;
