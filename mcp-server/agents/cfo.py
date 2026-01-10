# agents/cfo.py

import os
import google.generativeai as genai


# ----------------------------
# CFO Summary Agent Class
# ----------------------------
class CFOSummaryAgent:
    def __init__(self, context: dict, llm_model):
        self.context = context
        self.llm_model = llm_model

    def compute_health_score(self, expense_analysis, alerts, goal_plan):
        score = 100

        high_alerts = [a for a in alerts if a["severity"] == "High"]
        score -= len(high_alerts) * 10

        top_category = expense_analysis["top_3_categories"][0]
        top_share = top_category["amount"] / expense_analysis["total_expense"]

        if top_share > 0.45:
            score -= 20
        elif top_share > 0.35:
            score -= 10

        if goal_plan["feasibility"] == "Not Feasible":
            score -= 20
        elif goal_plan["feasibility"] == "Partially Feasible":
            score -= 10

        return max(0, min(100, score))

    def verdict_from_score(self, score):
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Stable"
        elif score >= 40:
            return "Needs Attention"
        else:
            return "Critical"

    def generate_executive_summary(self, context_block):
        prompt = f"""
You are an Autonomous CFO addressing a young professional.

Write a concise executive financial summary (4–5 sentences).
Tone: confident, supportive, professional.
No bullet points, no numbers, no technical jargon.

Context:
{context_block}
"""
        try:
            response = self.llm_model.generate_content(prompt)
            return response.text.strip()
        except Exception:
            return "Executive summary temporarily unavailable."

    def generate_action_plan(self, context_block):
        prompt = f"""
You are an Autonomous CFO.

Based on the financial context below, generate EXACTLY 5
clear and actionable next-month actions.

Rules:
- One sentence per action
- Concrete and practical
- No generic advice
- No numbering or headings

Context:
{context_block}

Return only the 5 actions, one per line.
"""
        try:
            response = self.llm_model.generate_content(prompt)
            actions = [
                line.strip()
                for line in response.text.split("\n")
                if line.strip()
            ]
            return actions[:5]
        except Exception:
            return ["Action plan temporarily unavailable"]

    def run(self):
        expense_analysis = self.context.get("expense_analysis")
        alerts_data = self.context.get("alerts_and_recommendations", {})
        goal_plan = self.context.get("goal_plan")

        if not expense_analysis or not goal_plan:
            raise ValueError("Required agent outputs missing in MCP context")

        alerts = alerts_data.get("alerts", [])

        health_score = self.compute_health_score(
            expense_analysis, alerts, goal_plan
        )
        verdict = self.verdict_from_score(health_score)

        context_block = {
            "health_score": health_score,
            "verdict": verdict,
            "expense_summary": expense_analysis,
            "alerts": alerts,
            "goal_plan": goal_plan
        }

        executive_summary = self.generate_executive_summary(context_block)
        action_plan = self.generate_action_plan(context_block)

        output = {
            "financial_health_score": health_score,
            "financial_verdict": verdict,
            "executive_summary": executive_summary,
            "top_risks": [a["message"] for a in alerts if a["severity"] == "High"],
            "next_month_action_plan": action_plan
        }

        self.context["cfo_summary"] = output
        return output


# ----------------------------
# MCP-Callable Wrapper
# ----------------------------
def run_cfo_summary(state: dict):
    """
    This function is what server.py calls.
    It receives the shared MCP STATE and returns the CFO summary.
    """

    # Configure Gemini once
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")

    agent = CFOSummaryAgent(
        context=state,
        llm_model=gemini_model
    )

    return agent.run()
