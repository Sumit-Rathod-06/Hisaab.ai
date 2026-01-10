# agents/goal.py

import os
import google.generativeai as genai


# =====================================
# Goal-Based Planning Agent
# =====================================

class GoalPlanningAgent:
    def __init__(self, context: dict, llm_model):
        self.context = context
        self.llm_model = llm_model

    def generate_ai_advice(self, goal_summary: dict):
        prompt = f"""
You are acting as a personal CFO.

Based on the financial goal and current situation below,
generate EXACTLY 3 actionable recommendations.

Rules:
- One sentence per recommendation
- Concrete financial action
- No generic advice
- No numbering or headings

Goal Summary:
{goal_summary}

Return only the 3 recommendations, one per line.
"""
        try:
            response = self.llm_model.generate_content(prompt)
            advice = [
                line.strip()
                for line in response.text.split("\n")
                if line.strip()
            ]
            return advice[:3]
        except Exception:
            return ["Goal advice temporarily unavailable"]

    def run(self, goal_amount: float, goal_purpose: str, time_period_months: int):
        expense_analysis = self.context.get("expense_analysis")
        transactions = self.context.get("categorized_transactions")

        if not expense_analysis or transactions is None:
            raise ValueError("Required data not found in MCP context")

        # ----------------------------
        # Estimate Monthly Expenses
        # ----------------------------
        monthly_expense = expense_analysis["total_expense"]

        # ----------------------------
        # Estimate Monthly Income
        # ----------------------------
        income_df = transactions[transactions["transaction_nature"] == "Income"]
        monthly_income = income_df["amount"].sum()

        # ----------------------------
        # Monthly Surplus
        # ----------------------------
        monthly_surplus = monthly_income - monthly_expense

        # ----------------------------
        # Required Monthly Saving
        # ----------------------------
        required_monthly_saving = round(goal_amount / time_period_months, 2)

        # ----------------------------
        # Feasibility Analysis
        # ----------------------------
        if monthly_surplus >= required_monthly_saving:
            feasibility = "Feasible"
        elif monthly_surplus > 0:
            feasibility = "Partially Feasible"
        else:
            feasibility = "Not Feasible"

        # ----------------------------
        # Milestone Planning
        # ----------------------------
        milestones = []
        milestone_interval = max(1, time_period_months // 4)

        for i in range(1, 5):
            months = i * milestone_interval
            milestones.append({
                "month": months,
                "target_amount": round(required_monthly_saving * months, 2)
            })

        # ----------------------------
        # Prepare Gemini Input
        # ----------------------------
        goal_summary = {
            "goal_purpose": goal_purpose,
            "goal_amount": goal_amount,
            "time_period_months": time_period_months,
            "required_monthly_saving": required_monthly_saving,
            "monthly_surplus": round(monthly_surplus, 2),
            "feasibility": feasibility
        }

        recommendations = self.generate_ai_advice(goal_summary)

        # ----------------------------
        # Final Output
        # ----------------------------
        plan = {
            "goal": {
                "purpose": goal_purpose,
                "amount": goal_amount,
                "time_period_months": time_period_months
            },
            "required_monthly_saving": required_monthly_saving,
            "estimated_monthly_surplus": round(monthly_surplus, 2),
            "feasibility": feasibility,
            "milestones": milestones,
            "recommendations": recommendations
        }

        self.context["goal_plan"] = plan
        return plan


# =====================================
# MCP-Callable Wrapper
# =====================================

def run_goal_planner(state: dict, amount: float, purpose: str, months: int):
    """
    Entry point used by server.py.
    Receives the shared MCP STATE and user goal parameters.
    """

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")

    agent = GoalPlanningAgent(
        context=state,
        llm_model=gemini_model
    )

    return agent.run(
        goal_amount=amount,
        goal_purpose=purpose,
        time_period_months=months
    )
