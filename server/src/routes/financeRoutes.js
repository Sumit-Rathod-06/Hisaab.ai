import express from "express";
import { getMCPClient } from "../mcpClient.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  // 1. Set the Express response timeout
  req.setTimeout(300000); 

  try {
    const { pdfPath } = req.body || {};
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
          pdf_path: pdfPath
        }
      },
      undefined, // We skip the custom result schema
      {
        timeout: 300000 // Correct key is 'timeout' for callTool options
      }
    );

    res.json(result);
  } catch (err) {
    console.error("Upload error details:", err);
    res.status(500).json({ error: err.message });
  }
});

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
  req.setTimeout(300000); 

  try {
    const { amount, months, purpose } = req.body;
    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "set_goal",
        arguments: { amount, months, purpose }
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
  //   const mcp = await getMCPClient();

  //   const result = await mcp.callTool(
  //     {
  //       name: "alerts",
  //       arguments: {} 
  //     },
  //     undefined,
  //     {
  //       timeout: 300000 
  //     }
  //   );

  //   // 1. Extract the text from the MCP content array
  //   const rawText = result.content[0].text;

  //   try {
  //     // 2. Parse the string into a real JSON object
  //     // We use a regex replace just in case the AI included markdown code blocks
  //     const cleanedText = rawText.replace(/```json|```/g, "").trim();
  //     const jsonObject = JSON.parse(cleanedText);
      
  //     // 3. Send the object to the frontend
  //     res.json(jsonObject);
  //   } catch (parseErr) {
  //     console.error("Alerts JSON Parsing failed:", parseErr);
  //     // Fallback: send as text if it's not valid JSON
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

router.get("/transactions", async (req, res) => {
  try {
    const userId = "d8f24ba0-b99d-4433-be84-7959d5298ff0";

    const result = await pool.query(
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
    console.error("Fetch transactions error:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.get("/summary", async (req, res) => {
  req.setTimeout(300000); 

  try {
    const mcp = await getMCPClient();

    const result = await mcp.callTool(
      {
        name: "cfo_summary",
        arguments: {}
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
