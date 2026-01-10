# agents/alerts.py

import os
import google.generativeai as genai


# =====================================
# Alert & Recommendation Agent
# =====================================

class AlertRecommendationAgent:
    def __init__(self, context: dict, llm_model):
        self.context = context
        self.llm_model = llm_model

    # ----------------------------
    # Generate Alerts (Rule-based)
    # ----------------------------
    def generate_alerts(self, expense_analysis: dict):
        alerts = []

        total_expense = expense_analysis["total_expense"]
        category_spend = expense_analysis["category_wise_spending"]
        avg_txn = expense_analysis["average_transaction_value"]
        expense_count = expense_analysis["expense_count"]
        highest = expense_analysis["highest_single_expense"]

        def percent(x):
            return round((x / total_expense) * 100, 1)

        alert_id = 1

        # 1️⃣ Category Overspending
        for cat, amt in category_spend.items():
            p = percent(amt)
            if p > 35:
                alerts.append({
                    "alert_id": f"A{alert_id}",
                    "type": "Category Overspending",
                    "severity": "High",
                    "message": f"{cat} accounts for {p}% of total expenses"
                })
                alert_id += 1

        # 2️⃣ Uncategorized Expense Risk
        if "Others" in category_spend:
            p = percent(category_spend["Others"])
            if p > 25:
                alerts.append({
                    "alert_id": f"A{alert_id}",
                    "type": "Uncategorized Expense Risk",
                    "severity": "High",
                    "message": f"Uncategorized expenses form {p}% of total spending"
                })
                alert_id += 1

        # 3️⃣ High Average Transaction Value
        if avg_txn > 150:
            alerts.append({
                "alert_id": f"A{alert_id}",
                "type": "High Transaction Value",
                "severity": "Medium",
                "message": f"Average transaction value is ₹{avg_txn}"
            })
            alert_id += 1

        # 4️⃣ Expense Concentration
        top_cat = expense_analysis["top_3_categories"][0]
        p = percent(top_cat["amount"])
        if p > 40:
            alerts.append({
                "alert_id": f"A{alert_id}",
                "type": "Expense Concentration Risk",
                "severity": "High",
                "message": f"{top_cat['category']} dominates spending at {p}%"
            })
            alert_id += 1

        # 5️⃣ Frequent Expenses
        if expense_count > 40:
            alerts.append({
                "alert_id": f"A{alert_id}",
                "type": "Frequent Spending",
                "severity": "Medium",
                "message": f"{expense_count} expense transactions detected"
            })
            alert_id += 1

        # 6️⃣ Large One-time Expense
        if highest and highest["amount"] > 500:
            alerts.append({
                "alert_id": f"A{alert_id}",
                "type": "Large One-time Expense",
                "severity": "Medium",
                "message": f"Single expense of ₹{highest['amount']} detected in {highest['category']}"
            })

        return alerts

    # ----------------------------
    # Gemini Recommendations PER ALERT
    # ----------------------------
    def generate_recommendations(self, alert: dict, expense_analysis: dict):
        prompt = f"""
You are acting as a personal CFO.

Generate EXACTLY 2 actionable recommendations
for the following financial alert.

Alert:
Type: {alert['type']}
Message: {alert['message']}
Severity: {alert['severity']}

User Expense Context:
- Total Expense: {expense_analysis['total_expense']}
- Top Categories: {expense_analysis['top_3_categories']}
- Average Transaction Value: {expense_analysis['average_transaction_value']}

Rules:
- One sentence per recommendation
- Concrete financial action
- No generic advice
- No numbering or headings

Return only the 2 recommendations, one per line.
"""
        try:
            response = self.llm_model.generate_content(prompt)
            recs = [
                line.strip()
                for line in response.text.split("\n")
                if line.strip()
            ]
            return recs[:2]
        except Exception:
            return ["Review this spending pattern", "Set a corrective budget limit"]

    # ----------------------------
    # Run Agent
    # ----------------------------
    def run(self):
        expense_analysis = self.context.get("expense_analysis")
        if not expense_analysis:
            raise ValueError("Expense analysis not found in MCP context")

        alerts = self.generate_alerts(expense_analysis)

        for alert in alerts:
            alert["recommendations"] = self.generate_recommendations(
                alert, expense_analysis
            )

        output = {"alerts": alerts}
        self.context["alerts_and_recommendations"] = output
        return output


# =====================================
# MCP-Callable Wrapper
# =====================================

def run_alerts(state: dict):
    """
    Entry point used by server.py.
    Receives the shared MCP STATE and returns alerts + recommendations.
    """

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")

    agent = AlertRecommendationAgent(
        context=state,
        llm_model=gemini_model
    )

    return agent.run()
