import axios from "axios";
import pool from "../config/db.js";

/* ----------------------------------
   POST: Upload PDF → AI → Save → Return
---------------------------------- */
export const createExpenseAnalysis = async (req, res) => {
  try {
    const { user_id } = req.user.id;
    const pdfFile = req.file;
    console.log("User ID:", user_id);
    console.log("PDF File:", pdfFile);

    if (!pdfFile) {
      return res.status(400).json({ error: "PDF file required" });
    }

    // 🔹 Call AI Agent
    const aiResponse = await axios.post(
      "http://localhost:8080/analyze-expenses",
      {
        pdf_path: pdfFile.path,
        user_id,
      }
    );

    const data = aiResponse.data;

    // 🔹 Insert into DB
    const result = await pool.query(
      `
      INSERT INTO expense_analysis (
        user_id,
        total_expense,
        expense_count,
        category_wise_spending,
        top_3_categories,
        average_transaction_value,
        highest_single_expense,
        insights
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
      `,
      [
        user_id,
        data.total_expense,
        data.expense_count,
        data.category_wise_spending,
        data.top_3_categories,
        data.average_transaction_value,
        data.highest_single_expense,
        data.insights,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Expense analysis failed" });
  }
};

/* ----------------------------------
   GET: Fetch latest analysis for user
---------------------------------- */
export const getExpenseAnalysis = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log("Fetching analysis for User ID:", user_id);

    const result = await pool.query(
      `
      SELECT *
      FROM expense_analysis
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
      `,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No analysis found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
};
