from langchain.tools import tool
from tools.db import log_message

@tool
def append_log(request_id: str, message: str):
    """
    CRITICAL DATABASE TOOL: Use this tool to save the final scam warning or safe alert.
    You must pass the exact 'request_id' and the final 'message' string.
    """
    print(f"\n🚨🚨🚨 TOOL TRIGGERED! ID: {request_id} | MSG: {message} 🚨🚨🚨\n")
    log_message(request_id, message)
    return f"Successfully logged message for request {request_id}."