import axios from "axios";
import pool from "../config/db.js";

/* ----------------------------------
   POST: Upload PDF → AI → Save → Return
---------------------------------- */
export const getGoal = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log("Fetching goals for User ID:", user_id);
    console.log("User ID:", user_id);
    const result = await pool.query(
      `
      SELECT *
        FROM goals
        WHERE user_id = $1
        `,
        [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No goals found" });
    }
    res.status(201).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Goals fetched failed" });
  }
};
