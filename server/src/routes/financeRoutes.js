import express from "express";
import { getMCPClient } from "../mcpClient.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  // 1. Set the Express response timeout
  req.setTimeout(300000);

  try {
    const { pdfPath } = req.body || {};
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!pdfPath) {
      return res.status(400).json({ error: "pdfPath is required" });
    }

    const mcp = await getMCPClient();

    // 2. Use callTool with the options object as the THIRD argument
    // Signature: callTool(args, schema, options)
    const result = await mcp.callTool(
      {
        name: "upload_statement",
        arguments: {
          user_id: userId,
          pdf_path: pdfPath,
        },
      },
      undefined, // We skip the custom result schema
      {
        timeout: 300000, // Correct key is 'timeout' for callTool options
      }
    );

    res.json(result);
  } catch (err) {
    console.error("Upload error details:", err);
    res.status(500).json({ error: err.message });
  }
});

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

router.post("/goal", async (req, res) => {
  req.setTimeout(300000);

  try {
    const { amount, months, purpose } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "set_goal",
        arguments: { user_id: userId, amount, months, purpose },
      },
      undefined,
      { timeout: 300000 }
    );

    // 1. Extract the text string
    const rawText = result.content[0].text;

    try {
      // 2. Clean and Parse the JSON
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const jsonObject = JSON.parse(cleanedText);

      // 3. Return the parsed goal object
      res.json(jsonObject);
    } catch (parseErr) {
      // If the response isn't JSON (e.g., just a success string), return it as text
      res.json({ message: rawText });
    }
  } catch (err) {
    console.error("Goal creation error:", err);
    res.status(500).json({ error: err.message });
  }
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

export default router;
