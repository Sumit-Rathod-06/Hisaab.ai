# agents/expense.py

import os
import pandas as pd
import google.generativeai as genai


# ----------------
# Helper: Convert numpy → native
# ----------------
def to_native(value):
    if hasattr(value, "item"):
        return value.item()
    return value


# =====================================
# Expense Analysis Agent
# =====================================

class ExpenseAnalysisAgent:
    def __init__(self, context: dict, llm_model):
        self.context = context
        self.llm_model = llm_model

    def generate_ai_insights(self, summary: dict, category_percentages: dict):
        prompt = f"""
You are acting as a personal CFO for a young professional.

Generate EXACTLY 3 high-impact financial insights.
Each insight must:
- Be specific and data-driven
- Suggest a concrete action
- Explain why it matters financially
- Be ONE sentence only
- No generic advice
- No numbering or headings

Expense Summary:
- Total Expense: {summary['total_expense']}
- Expense Count: {summary['expense_count']}
- Average Transaction Value: {summary['average_transaction_value']}
- Top Categories: {summary['top_3_categories']}

Category Percentage Breakdown:
{category_percentages}

Return ONLY the 3 insights, one per line. Don't use $, use Rupees symbol instead.
"""
        try:
            response = self.llm_model.generate_content(prompt)
            insights = [
                line.strip()
                for line in response.text.split("\n")
                if line.strip()
            ]
            return insights[:3]
        except Exception as e:
            print("Gemini insight error:", e)
            return ["AI insights temporarily unavailable"]

    def run(self):
        df = self.context.get("categorized_transactions")
        if df is None or df.empty:
            raise ValueError("No categorized transactions found in MCP context")

        # ----------------------------
        # Ensure transaction_nature exists
        # ----------------------------
        if "transaction_nature" not in df.columns:
            if "transaction_type" in df.columns:
                df["transaction_nature"] = df["transaction_type"].map({
                    "Debit": "Expense",
                    "Credit": "Income"
                }).fillna("Expense")
            else:
                df["transaction_nature"] = df["amount"].apply(
                    lambda x: "Income" if x > 0 else "Expense"
                )

        # ----------------------------
        # Only REAL expenses (exclude transfers)
        # ----------------------------
        expense_df = df[
            (df["transaction_nature"] == "Expense") &
            (~df["category"].isin(["Peer Transfer", "Self Transfer"]))
        ].copy()

        if expense_df.empty:
            analysis = {
                "total_expense": 0,
                "expense_count": 0,
                "category_wise_spending": {},
                "top_3_categories": [],
                "average_transaction_value": 0,
                "highest_single_expense": None,
                "ai_insights": ["No expense transactions found"]
            }
            self.context["expense_analysis"] = analysis
            return analysis

        # ----------------------------
        # Core Calculations
        # ----------------------------
        total_expense = to_native(round(expense_df["amount"].sum(), 2))
        expense_count = int(len(expense_df))
        avg_expense = to_native(round(total_expense / expense_count, 2))

        # ----------------------------
        # Category-wise Spending
        # ----------------------------
        category_spend = (
            expense_df.groupby("category")["amount"]
            .sum()
            .sort_values(ascending=False)
            .to_dict()
        )
        category_spend = {k: to_native(v) for k, v in category_spend.items()}

        # ----------------------------
        # Category Percentages
        # ----------------------------
        category_percentages = {
            k: round((v / total_expense) * 100, 1)
            for k, v in category_spend.items()
        }

        # ----------------------------
        # Top 3 Categories
        # ----------------------------
        top_3_categories = [
            {"category": cat, "amount": amt}
            for cat, amt in list(category_spend.items())[:3]
        ]

        # ----------------------------
        # Highest Single Expense
        # ----------------------------
        max_row = expense_df.loc[expense_df["amount"].idxmax()]
        highest_single_expense = {
            "amount": to_native(max_row["amount"]),
            "category": max_row["category"],
            "description": max_row["description"],
            "date": max_row.get("date")
        }

        # ----------------------------
        # Gemini Insights
        # ----------------------------
        summary_for_llm = {
            "total_expense": total_expense,
            "expense_count": expense_count,
            "top_3_categories": top_3_categories,
            "average_transaction_value": avg_expense
        }

        ai_insights = self.generate_ai_insights(
            summary_for_llm, category_percentages
        )

        # ----------------------------
        # Final Output (JSON-safe)
        # ----------------------------
        analysis = {
            "total_expense": total_expense,
            "expense_count": expense_count,
            "category_wise_spending": category_spend,
            "top_3_categories": top_3_categories,
            "average_transaction_value": avg_expense,
            "highest_single_expense": highest_single_expense,
            "ai_insights": ai_insights
        }

        self.context["expense_analysis"] = analysis
        return analysis


# =====================================
# MCP-Callable Wrapper
# =====================================

def run_expense_analysis(state: dict):
    """
    Entry point used by server.py.
    Receives the shared MCP STATE and returns expense analysis.
    """

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")

    agent = ExpenseAnalysisAgent(
        context=state,
        llm_model=gemini_model
    )

    return agent.run()
