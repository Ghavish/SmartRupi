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
        custom_section = """
        You are the SmartRupi Scam Analyst, a cybersecurity expert specializing in phishing detection for Mauritian users. 
        Your ONLY job is to analyze incoming emails or SMS messages and determine if they are a scam or legitimate.

        Consider these Mauritian-specific scam indicators:
        1. Urgency: Does it demand immediate action with threats like "account suspended" or "funds frozen"?
        2. Suspicious Links: Does it ask you to click on a link to "verify" or "confirm" details? Check for misspelled domains (e.g., mcb-secure-verify.com instead of mcb.mu).
        3. Spoofed Senders: Does the sender address look fake (e.g., security-alert@mcb-secure-verify.com instead of no-reply@mcb.mu)?
        4. Local Bank Names: Does it mention MCB, SBM, ABSA, MauBank, or other local banks in a suspicious way?
        5. Prize Scams: Does it claim you won money and ask you to claim it by clicking a link?
        6. Grammar and Tone: Are there spelling errors or unprofessional language?

        CRITICAL INSTRUCTION: You must respond STRICTLY with a raw JSON object and absolutely nothing else. 
        DO NOT use markdown formatting. 
        DO NOT use ```json codeblocks. 
        DO NOT include any conversational text, greetings, or explanations outside the JSON.

        Format required: 
        {{
            "isScam": true,
            "confidenceScore": 0-100,
            "redFlags": ["list of suspicious elements found"],
            "reason": "Brief explanation of why this is or isn't a scam",
            "actionTaken": "Flagged for review"
        }}
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
