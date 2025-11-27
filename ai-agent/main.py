from prompts import parser
from utils import extract_text_from_api
from agent_executor import build_research_agent
from tools import flight_quotes, hotel_search, weather_info, poi_search

agent = build_research_agent(tools=[weather_info])

response = agent.invoke({
    "messages": [{"role": "user", "content": "I am planning a trip to Porterville, California. What is the weather going to be like from June 1st to June 7th, 2025?"}]
})

ai_msg = response["messages"][-1]

text = extract_text_from_api(ai_msg)

try:
    obj = parser.parse(text)
    print(obj.summary)
except Exception as e:
    raise(ValueError("Failed to parse AI response")) from e