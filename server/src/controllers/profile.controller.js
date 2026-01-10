import db from "../config/db.js";

/* ============================
   GET USER PROFILE
   GET /api/profile/:userId
============================ */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching profile for User ID:", userId);

    const profile = await db.query(
      "SELECT * FROM user_profile WHERE user_id = $1",
      [userId]
    );

    if (profile.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ success: true, data: profile.rows[0] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   CREATE USER PROFILE
   POST /api/profile
============================ */
export const createUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const {
      full_name,
      age,
      city,
      employment_type,
      monthly_income,
      income_type,
      emergency_fund_amount,
      has_insurance,
      risk_profile,
      marital_status,
      dependents_count,
    } = req.body;

    // Check if profile already exists
    const existingProfile = await db.query(
      "SELECT id FROM user_profile WHERE user_id = $1",
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Profile already exists for this user" });
    }

    const newProfile = await db.query(
      `INSERT INTO user_profile (
        user_id, full_name, age, city, employment_type, monthly_income,
        income_type, emergency_fund_amount, has_insurance, risk_profile,
        marital_status, dependents_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        userId,
        full_name,
        age,
        city,
        employment_type,
        monthly_income,
        income_type,
        emergency_fund_amount,
        has_insurance,
        risk_profile,
        marital_status,
        dependents_count,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: newProfile.rows[0],
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   UPDATE USER PROFILE
   PUT /api/profile/:userId
============================ */
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      full_name,
      age,
      city,
      employment_type,
      monthly_income,
      income_type,
      emergency_fund_amount,
      has_insurance,
      risk_profile,
      marital_status,
      dependents_count,
    } = req.body;

    const updatedProfile = await db.query(
      `UPDATE user_profile SET
        full_name = COALESCE($1, full_name),
        age = COALESCE($2, age),
        city = COALESCE($3, city),
        employment_type = COALESCE($4, employment_type),
        monthly_income = COALESCE($5, monthly_income),
        income_type = COALESCE($6, income_type),
        emergency_fund_amount = COALESCE($7, emergency_fund_amount),
        has_insurance = COALESCE($8, has_insurance),
        risk_profile = COALESCE($9, risk_profile),
        marital_status = COALESCE($10, marital_status),
        dependents_count = COALESCE($11, dependents_count),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $12
      RETURNING *`,
      [
        full_name,
        age,
        city,
        employment_type,
        monthly_income,
        income_type,
        emergency_fund_amount,
        has_insurance,
        risk_profile,
        marital_status,
        dependents_count,
        userId,
      ]
    );

    if (updatedProfile.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile.rows[0],
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   DELETE USER PROFILE
   DELETE /api/profile/:userId
============================ */
export const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedProfile = await db.query(
      "DELETE FROM user_profile WHERE user_id = $1 RETURNING *",
      [userId]
    );

    if (deletedProfile.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
