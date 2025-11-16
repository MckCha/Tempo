from langchain.agents import create_agent
from prompts import system_prompt_text
from config import llm

def build_research_agent(tools=None):
    tools = tools or []
    return create_agent(
        model=llm,
        tools=tools,
        system_prompt=system_prompt_text,
    )