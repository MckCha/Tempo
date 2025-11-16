from prompts import parser
from utils import extract_text_from_api
from agent_executor import build_research_agent

agent = build_research_agent()

response = agent.invoke({
    "messages": [{"role": "user", "content": "I will be visiting japan for 3 days? Please create me a travel plan."}]
})

ai_msg = response["messages"][-1]

text = extract_text_from_api(ai_msg)

try:
    obj = parser.parse(text)
    print(obj.summary)
except Exception as e:
    raise(ValueError("Failed to parse AI response")) from e