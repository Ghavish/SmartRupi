import asyncio
import logging
import os
from dotenv import load_dotenv

from band.adapters import LangGraphAdapter

from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import InMemorySaver

from band import Agent
from band.adapters import GoogleADKAdapter
from band.config import load_agent_config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    load_dotenv()

    # Load agent credentials
    agent_id, api_key = load_agent_config("Financial_auditor")

    # GoogleADKAdapter
    # adapter = GoogleADKAdapter(
    #     model="gemini-1.5-flash",
    #     custom_section = """
    #     You are the SmartRupi Financial Auditor. You will receive a JSON list of recent bank transactions.
    #     Your job is to categorize the spending and provide a quick financial health insight.
    #     Respond strictly in JSON format: {{"total_spent": float, "top_category": "string", "budget_status": "Healthy" | "Warning" | "Critical", "insight": "1-sentence actionable advice"}}.
    #     Do not provide conversational text.
    #     """
    # )

    # OpenRouter with OPENAI Adapter
    adapter = LangGraphAdapter(
        llm=ChatOpenAI(
            model="openai/gpt-oss-120b",
            
            # openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            # openai_api_base="https://openrouter.ai/api/v1",
            
            openai_api_key=os.getenv("GROQ_API_KEY"),
            openai_api_base="https://api.groq.com/openai/v1",
        ),
        custom_section="""
        You are the SmartRupi Financial Auditor AI. 
        Your ONLY purpose is to analyze arrays of bank transactions to identify unusual spending or anomalies.

        CRITICAL OUTPUT RULE:
        1. Once you have audited the transactions, you MUST respond by mentioning the Communication Agent.
        2. Format your response exactly as: @Communication_Agent { "anomaliesDetected": boolean, ... }
        3. Do not output anything else.
        """
    )

    # Create and run the agent
    agent = Agent.create(
        adapter=adapter,
        agent_id=agent_id,
        api_key=api_key,
        ws_url=os.getenv("BAND_WS_URL"),
        rest_url=os.getenv("BAND_REST_URL")
    )

    logger.info("Agent is running! Press Ctrl+C to stop.")
    await agent.run()

if __name__ == "__main__":
    asyncio.run(main())
