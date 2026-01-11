# agents/chatbot.py

import pandas as pd

class FinanceChatAgent:
    def __init__(self, context: dict, llm_model):
        self.context = context
        self.llm = llm_model

    def build_context(self, df: pd.DataFrame):
        compact_rows = df[[
            "date", "description", "amount", "category"
        ]].head(200).to_dict(orient="records")

        return {
            "total_transactions": len(df),
            "rows_sample": compact_rows
        }

    def run(self, question: str):
        df = self.context.get("categorized_transactions")

        if df is None or df.empty:
            return "No transaction data is available yet. Please upload a statement first."

        context = self.build_context(df)

        prompt = f"""
You are a personal finance assistant.

Answer the user's question using ONLY the data provided below.
The data contains real transaction rows.

User Question:
{question}

Transactions & Summary:
{context}

Rules:
- Use only the provided data
- Do not invent numbers
- If the answer cannot be derived, say so clearly
"""
        
        try:
            response = self.llm.generate_content(prompt)
            return response.text.strip()
        except Exception:
            return "Unable to answer the question at the moment."
