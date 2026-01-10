class MilestoneAdjustmentAgent:
    def __init__(self, llm_model):
        self.llm_model = llm_model

    def generate_adjusted_recommendations(
        self,
        saved_amount: float,
        expected_amount: float,
        current_recommendations: list,
        expense_summary: dict
    ):
        delta = saved_amount - expected_amount

        if abs(delta) < expected_amount * 0.05:
            return {
                "status": "On Track",
                "recommendations": current_recommendations
            }

        performance = "Ahead" if delta > 0 else "Behind"

        prompt = f"""
You are an Autonomous CFO.

The user had a saving target of ₹{expected_amount} but actually saved ₹{saved_amount}.
They are currently {performance.lower()} of plan.

Current Recommendations:
{current_recommendations}

Expense Summary:
{expense_summary}

Generate EXACTLY 3 updated recommendations.

Rules:
- One sentence each
- Concrete and practical
- No generic advice
- No numbering or headings

Return only the 3 lines.
"""

        try:
            response = self.llm_model.generate_content(prompt)
            lines = [line.strip() for line in response.text.split("\n") if line.strip()]
            return {
                "status": performance,
                "recommendations": lines[:3]
            }
        except Exception:
            return {
                "status": performance,
                "recommendations": current_recommendations
            }

    def run(self, saved_amount, expected_amount, goal_plan, expense_analysis):
        current_recs = goal_plan.get("recommendations", [])

        result = self.generate_adjusted_recommendations(
            saved_amount,
            expected_amount,
            current_recs,
            expense_analysis
        )

        updated_plan = {
            **goal_plan,
            "milestone_status": result["status"],
            "recommendations": result["recommendations"]
        }

        return updated_plan
