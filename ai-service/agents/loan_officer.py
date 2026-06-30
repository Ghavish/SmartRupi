import asyncio
import logging
import os
from dotenv import load_dotenv

from thenvoi import Agent
from thenvoi.adapters import LangGraphAdapter

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
    agent_id, api_key = load_agent_config("Loan_officer")

    # GoogleADKAdapter
    # adapter = GoogleADKAdapter(
    #     model="gemini-1.5-flash",
    #     custom_section = """
    #     You are the SmartRupi Micro-Loan Officer. You will receive a user's monthly income, existing debt, and a requested loan amount for a specific item.
    #     Your job is to instantly approve or deny the micro-loan based on risk. 
    #     Keep risk tolerance moderate.
    #     Respond strictly in JSON format: {{"approved": boolean, "max_approved_amount": float, "interest_rate_offered": float, "decision_reason": "1-sentence explanation"}}.
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
        You are the SmartRupi Loan Officer AI. 
        Your ONLY purpose is to evaluate loan applications based on standard debt-to-income logic.

        CRITICAL RULES:
        1. You will receive applicant data (income, requested amount, credit score) prefixed with "TASK_REQUEST:".
        2. Assume a maximum allowed debt-to-income ratio of 40%. Do not invent new banking policies.
        3. DO NOT use markdown formatting (no ```json).
        4. DO NOT use the '@' or '<@' symbols to tag anyone.
        5. DO NOT say "Hello" or output any text other than the JSON.

        Respond ONLY with a raw, minified JSON object in this exact format:
        {
        "isEligible": boolean,
        "approvedAmount": integer (either the requested amount or a lower counter-offer),
        "suggestedInterestRate": float (e.g., 6.5),
        "reasoning": "A brief, professional explanation of the decision."
        }
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
