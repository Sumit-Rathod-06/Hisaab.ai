# agents/ingestion.py

import os
import json
import requests
import pandas as pd
import google.generativeai as genai


# ----------------------------
# Configuration
# ----------------------------

UNSTRACT_API_KEY = os.getenv("UNSTRACT_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

UNSTRACT_URL = (
    "https://us-central.unstract.com/deployment/api/org_rFEveiPBC1hw3ZTw/hisaab_1767987931608/"
)

CATEGORIES = [
    # Food & Daily
    "Food & Dining",
    "Groceries",
    "Beverages",

    # Transport
    "Transport",
    "Fuel",

    # Shopping
    "Shopping",
    "Online Shopping",

    # Utilities
    "Bills & Utilities",
    "Mobile Recharge",
    "Internet",

    # Health
    "Medical",
    "Pharmacy",

    # Finance
    "Rent",
    "Education",
    "Investments",
    "Insurance",

    # Transfers
    "Peer Transfer",
    "Self Transfer",

    # Misc
    "Entertainment",
    "Travel",
    "Cash Withdrawal",
    "Others"
]


# ----------------------------
# Unstract PDF Parser
# ----------------------------

def parse_pdf_with_unstract(pdf_path: str) -> pd.DataFrame:
    headers = {
        "Authorization": f"Bearer {UNSTRACT_API_KEY}"
    }

    with open(pdf_path, "rb") as f:
        files = {"files": f}
        data = {
            "timeout": 300,
            "include_metadata": "False",
            "include_metrics": "False"
        }

        response = requests.post(
            UNSTRACT_URL,
            headers=headers,
            files=files,
            data=data
        )

    response.raise_for_status()
    result = response.json()

    raw_json_string = (
        result["message"]["result"][0]
        ["result"]["output"]["Hisaab_1"]
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    transactions = json.loads(raw_json_string)
    return pd.DataFrame(transactions)


# ----------------------------
# Gemini Categorizer
# ----------------------------

def categorize_transaction_gemini(description: str, gemini_model) -> str:
    prompt = f"""
You are a financial transaction classifier.

Transaction description:
"{description}"

Choose ONLY ONE category from this list:
{CATEGORIES}

Return ONLY the category name.
"""
    try:
        response = gemini_model.generate_content(prompt)
        category = response.text.strip()
        return category if category in CATEGORIES else "Others"
    except Exception as e:
        print("Gemini error:", e)
        return "Others"


# =====================================
# Data Ingestion & Categorization Agent
# =====================================

class DataIngestionCategorizationAgent:
    def __init__(self, context: dict, llm_model):
        self.context = context
        self.llm_model = llm_model

    def run(self, pdf_path: str):
        print("Parsing PDF via Unstract...")
        df = parse_pdf_with_unstract(pdf_path)

        print("Categorizing transactions with LLM...")
        df["category"] = df["description"].apply(
            lambda x: categorize_transaction_gemini(x, self.llm_model)
        )

        self.context["raw_transactions"] = df
        self.context["categorized_transactions"] = df

        print("Ingestion & Categorization Completed")
        return df


# =====================================
# MCP-Callable Wrapper
# =====================================

def run_ingestion(state: dict, pdf_path: str):
    """
    Entry point used by server.py.
    Receives the shared MCP STATE and a PDF path.
    """

    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")

    agent = DataIngestionCategorizationAgent(
        context=state,
        llm_model=gemini_model
    )

    return agent.run(pdf_path)
