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
    agent_id, api_key = load_agent_config("Scam_analyst")

    # Groq with OpenAI Adapter via LangGraph
    adapter = LangGraphAdapter(
        llm=ChatOpenAI(
            model="openai/gpt-oss-120b",
            openai_api_key=os.getenv("GROQ_API_KEY"),
            openai_api_base="https://api.groq.com/openai/v1",
        ),
        # custom_section="""
        # You are the SmartRupi Scam Analyst, a cybersecurity expert specializing in phishing detection for Mauritian users. 
        # Your ONLY job is to analyze incoming emails or SMS messages.

        # CRITICAL OUTPUT PROTOCOL:
        # 1. Analyze the text provided in "TASK_REQUEST:".
        # 2. MANDATORY: You must preface your output with exactly "@Communication_Agent".
        # 3. Output ONLY a single, unified JSON object (schema provided below).
        # 4. NO Markdown, NO whitespace, NO conversational filler.

        # FINAL TERMINATION RULES:
        # 1. You are a ONE-WAY agent. Once you output the "@Communication_Agent {json}" string, you have completed your task.
        # 2. DO NOT reply if the Communication Agent sends a message back to the room.
        # 3. DO NOT acknowledge the Communication Agent or mention @Scam_Analyst again.
        # 4. If you see any further conversation in the room, ignore it completely.

        # Required JSON schema:
        # {
        #     "isScam": boolean,
        #     "confidenceScore": integer,
        #     "reason": "string",
        #     "urgency": boolean,
        #     "suspiciousLink": boolean,
        #     "spoofedSender": boolean,
        #     "localBankMention": boolean,
        #     "prizeScam": boolean,
        #     "grammarIssues": boolean
        # }
        # """
        custom_section="""
        You are the SmartRupi Scam Analyst.
        
        CRITICAL PROTOCOL:
        1. Analyze the text provided in "TASK_REQUEST:".
        2. Output ONLY the analysis in this format:
        "@Communication_Agent DATA_FOR_COMMUNICATION: {"isScam": true, "confidence": 92, "reason": "..."}"
        3. You MUST include "@Communication_Agent" at the start so the correct agent receives this data.
        4. DO NOT reply to any further messages after sending this analysis.
        5. After completing your task, do not exit the room.
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