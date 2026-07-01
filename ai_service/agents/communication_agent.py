import asyncio
import logging
import os
import sys
from dotenv import load_dotenv

from band.adapters import LangGraphAdapter

from langchain_openai import ChatOpenAI
from band import Agent
from band.config import load_agent_config

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from tools.agent_tools import append_log

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    load_dotenv()

    # Load agent credentials for the Communication Agent
    agent_id, api_key = load_agent_config("Communication_agent")

    adapter = LangGraphAdapter(
        llm=ChatOpenAI(
            model="llama-3.1-8b-instant",
            openai_api_key=os.getenv("GROQ_API_KEY"),
            openai_api_base="https://api.groq.com/openai/v1",
        ),
        additional_tools=[append_log],
        custom_section="""
        You are the SmartRupi Communication Agent.
        Your job is to listen for messages explicitly addressed to you (@Communication_Agent).
        
        When you receive JSON data:
        1. You will receive data from the Scam Analyst in this format: 
       "DATA_FOR_COMMUNICATION: {"isScam": true, "confidence": 92, "reason": "..."}"
       2. Extract the 'isScam' boolean.
        
        STRICT FORMATTING RULES:
        1. NO paragraphs, NO greetings, NO explanations.
        2. If 'isScam' is TRUE, log ONLY: "Warning! Scam Alert!"
        3. If 'isScam' is FALSE, log ONLY: "Safe to Open!"
        4. Do not use tools. Send only the final string.
        5. Do not output anything other than these specific phrases.

        FINAL INSTRUCTION:
        1. Your output is the FINAL step in the process.
        2. NEVER mention @Scam_Analyst in your response.
        3. Output your alert as a single-line string.
        4. DO NOT trigger any more tool calls or messages after your single-line alert.

        CRITICAL RULE:
        1. Do NOT reply in the chat. You MUST use the append_log tool to save the phrase 'Warning! Scam Alert!' OR 'Safe to Open!' along with the extracted request ID.
        2. YOU MUST NOT SEND A CHAT MESSAGE. DO NOT use the '@' symbol. DO NOT reply in the room.
        3. After completing your task, do not exit the room. Remain available for further analysis or user inquiries.

        ACTION REQUIRED(MANDATORY): 
        You have access to a function/tool named `append_log`. You MUST invoke the `append_log` tool immediately, passing the Request ID and the message as arguments. 
        Do not do anything else. Do NOT use your own Agent ID or invent a UUID. If you do not use the exact Request ID provided in the text, the system will fail."
        """

    )

    agent = Agent.create(
        adapter=adapter,
        agent_id=agent_id,
        api_key=api_key,
        ws_url=os.getenv("BAND_WS_URL"),
        rest_url=os.getenv("BAND_REST_URL")
    )

    logger.info("📡 Communication Agent is running!")
    await agent.run()

if __name__ == "__main__":
    asyncio.run(main())