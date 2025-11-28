from prompts import parser
from utils import extract_text_from_api
from agent_executor import build_research_agent
from tools import flight_quotes, hotel_search, weather_info, poi_search

agent = build_research_agent(tools=[weather_info])

#user_input = input("Provide your travel details: ")
user_input = """
I am traveling to Porterville, CA.
Please give me the weather for today.
Also gather web information on potential natural disasters in that area.
"""

response = agent.invoke({
    "messages": [{"role": "user", "content": user_input}]
})

tool_msgs = [m for m in response["messages"] if getattr(m, "type", "") == "tool"]
weather_data = next((m.content for m in tool_msgs if m.name == "weather_info"), None)

if weather_data:
    print("\n Weather Info Retrieved from Tool:")
    print(f"{weather_data}\n")

ai_msg = response["messages"][-1]
text = extract_text_from_api(ai_msg)

try:
    obj = parser.parse(text)
    print(obj.summary)
except Exception as e:
    raise(ValueError("Failed to parse AI response")) from e