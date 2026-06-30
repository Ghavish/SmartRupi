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
    agent_id, api_key = load_agent_config("Scam_analyst")

    # GoogleADKAdapter
    # adapter = GoogleADKAdapter(
    #     model="gemini-2.5-flash",
    #     custom_section="""
    #     You are the SmartRupi Scam Analyst AI. 
    #     Your sole purpose is to analyze the provided text for phishing or scam indicators.

    #     INSTRUCTIONS:
    #     1. You will receive messages formatted as "TASK_REQUEST: [text to analyze]".
    #     2. If the message does NOT start with "TASK_REQUEST:", ignore it.
    #     3. Analyze the content for:
    #     - Suspicious links
    #     - Urgency or threatening language (e.g., "Account suspended", "Verify immediately")
    #     - Requests for sensitive data like PINs or passwords.
    #     4. Respond ONLY in valid JSON format with no additional text:
    #     {
    #         "is_scam": boolean,
    #         "confidence_score": integer (0-100),
    #         "reason": "Brief explanation of your finding"
    #     }

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
        You are the SmartRupi Scam Analyst AI. 
        Your ONLY purpose is to evaluate text for phishing, fraud, or scam indicators.

        CRITICAL RULES:
        1. You will receive messages starting with "TASK_REQUEST:". Ignore all other messages.
        2. DO NOT use markdown formatting (no ```json).
        3. DO NOT use the '@' or '<@' symbols under any circumstances. Do not tag or mention any user or agent.
        4. DO NOT include any conversational filler (e.g., "Here is the analysis", "Understood").

        Respond ONLY with a raw, minified JSON object in this exact format:
        {
        "isScam": boolean,
        "confidence": integer (0-100),
        "reason": "One short sentence explaining the primary red flag or confirming safety."
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
