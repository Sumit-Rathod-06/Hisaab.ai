import os
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

from agents.ingestion import run_ingestion
from agents.expense import run_expense_analysis
from agents.goal import run_goal_planner
from agents.alerts import run_alerts
from agents.cfo import run_cfo_summary

load_dotenv()

mcp = FastMCP("Autonomous CFO")

STATE = {}


@mcp.tool()
def upload_statement(pdf_path: str):
    df = run_ingestion(STATE, pdf_path)
    return {"status": "ok", "rows": len(df)}

@mcp.tool()
def expense_analysis():
    return run_expense_analysis(STATE)

@mcp.tool()
def set_goal(amount: float, months: int, purpose: str):
    return run_goal_planner(STATE, amount, purpose, months)

@mcp.tool()
def alerts():
    return run_alerts(STATE)

@mcp.tool()
def cfo_summary():
    return run_cfo_summary(STATE)


if __name__ == "__main__":
    mcp.run()
