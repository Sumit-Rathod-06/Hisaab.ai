# server.py

import os
import uuid
import json
import psycopg
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP
from agents.milestone import MilestoneAdjustmentAgent
from agents.chatbot import FinanceChatAgent
import google.generativeai as genai

from agents.ingestion import run_ingestion
from agents.expense import run_expense_analysis
from agents.goal import run_goal_planner
from agents.alerts import run_alerts
from agents.cfo import run_cfo_summary

load_dotenv()

mcp = FastMCP("Autonomous CFO")

# ----------------------------
# Shared MCP State (Session)
# ----------------------------
STATE = {
    "user_id": None,
    "current_upload_id": None,

    "current_transactions": None,
    "current_expense_analysis": None,
    "current_alerts": None,

    "all_transactions": None,
    "goal_plan": None
}

# ----------------------------
# DB Helpers
# ----------------------------

def get_conn():
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        dbname=os.getenv("DB_DATABASE")
    )

def fetch_all_transactions(user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT date, description, amount, transaction_type, category
                FROM transactions
                WHERE user_id = %s
                ORDER BY created_at
                """,
                (user_id,)
            )
            rows = cur.fetchall()

    # Convert to list of dicts for agents
    return [
        {
            "date": r[0],
            "description": r[1],
            "amount": r[2],
            "transaction_type": r[3],
            "category": r[4]
        }
        for r in rows
    ]

# -------------------------------------------------
# Tool 1: Upload & Ingest Statement
# -------------------------------------------------

@mcp.tool()
def upload_statement(user_id: str, pdf_path: str):
    upload_id = str(uuid.uuid4())

    STATE["user_id"] = user_id
    STATE["current_upload_id"] = upload_id

    df = run_ingestion(STATE, pdf_path)

    with get_conn() as conn:
        with conn.cursor() as cur:
            for _, row in df.iterrows():
                cur.execute(
                    """
                    INSERT INTO transactions
                    (user_id, upload_id, date, description, amount,
                     transaction_type, category, raw_json)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        user_id,
                        upload_id,
                        row.get("date"),
                        row.get("description"),
                        row.get("amount"),
                        row.get("transaction_type"),
                        row.get("category"),
                        json.dumps(row.to_dict())
                    )
                )

    STATE["current_transactions"] = df
    STATE["all_transactions"] = fetch_all_transactions(user_id)

    return {
        "status": "ok",
        "upload_id": upload_id,
        "rows": len(df)
    }

# -------------------------------------------------
# Tool 2: Expense Analysis (Current Upload Only)
# -------------------------------------------------

@mcp.tool()
def expense_analysis(user_id: str):
    if STATE["current_transactions"] is None:
        raise ValueError("No active upload")

    result = run_expense_analysis(STATE)

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO expense_analyses (user_id, upload_id, summary)
                VALUES (%s,%s,%s)
                """,
                (user_id, STATE["current_upload_id"], json.dumps(result))
            )

    STATE["current_expense_analysis"] = result
    return result

# -------------------------------------------------
# Tool 3: Alerts (Current Upload Only)
# -------------------------------------------------

@mcp.tool()
def alerts(user_id: str):
    if STATE["current_expense_analysis"] is None:
        raise ValueError("Run expense_analysis first")

    result = run_alerts(STATE)

    with get_conn() as conn:
        with conn.cursor() as cur:
            for alert in result["alerts"]:
                cur.execute(
                    """
                    INSERT INTO alerts
                    (user_id, upload_id, alert_type, severity, message, recommendations)
                    VALUES (%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        user_id,
                        STATE["current_upload_id"],
                        alert["type"],
                        alert["severity"],
                        alert["message"],
                        json.dumps(alert["recommendations"])
                    )
                )

    STATE["current_alerts"] = result
    return result

# -------------------------------------------------
# Tool 4: Goal Planning (Uses All History)
# -------------------------------------------------

@mcp.tool()
def set_goal(user_id: str, amount: float, months: int, purpose: str):
    if STATE["all_transactions"] is None:
        STATE["all_transactions"] = fetch_all_transactions(user_id)

    result = run_goal_planner(STATE, amount, purpose, months)

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO goals (user_id, purpose, amount, months, plan)
                VALUES (%s,%s,%s,%s,%s)
                """,
                (user_id, purpose, amount, months, json.dumps(result))
            )

    STATE["goal_plan"] = result
    return result

# -------------------------------------------------
# Tool 5: CFO Summary
# -------------------------------------------------

@mcp.tool()
def cfo_summary(user_id: str):
    return run_cfo_summary(STATE)

@mcp.tool()
def update_milestone(
    user_id: str,
    goal_id: str,
    saved_amount: float,
    expected_amount: float,
    expense_analysis: dict
):
    goal_id = int(goal_id)  # 🔥 ensure correct type

    with get_conn() as conn:
        with conn.cursor() as cur:
            # Fetch goal
            cur.execute(
                """
                SELECT plan FROM goals
                WHERE id = %s AND user_id = %s
                """,
                (goal_id, user_id)
            )
            row = cur.fetchone()

            if not row:
                raise ValueError("Goal not found for this user")

            goal_plan = row[0]

            # Delete old version
            cur.execute(
                """
                DELETE FROM goals
                WHERE id = %s AND user_id = %s
                """,
                (goal_id, user_id)
            )

            if cur.rowcount == 0:
                raise RuntimeError("Delete failed: goal still exists")

            conn.commit()

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("models/gemini-2.0-flash")

    agent = MilestoneAdjustmentAgent(model)
    updated_plan = agent.run(
        saved_amount,
        expected_amount,
        goal_plan,
        expense_analysis
    )

    # Insert updated version
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO goals (user_id, purpose, amount, months, plan)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    user_id,
                    updated_plan["goal"]["purpose"],
                    updated_plan["goal"]["amount"],
                    updated_plan["goal"]["time_period_months"],
                    json.dumps(updated_plan)
                )
            )
            conn.commit()

    return updated_plan

@mcp.tool()
def finance_chat(question: str):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("models/gemini-2.0-flash")

    agent = FinanceChatAgent(STATE, model)
    answer = agent.run(question)

    return {"answer": answer}


# ----------------------------
# Run Server
# ----------------------------

if __name__ == "__main__":
    mcp.run()
