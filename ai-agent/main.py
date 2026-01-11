from prompts import parser
from utils import extract_text_from_api
from agent_executor import build_research_agent
from tools import flight_quotes, hotel_list, weather_info, poi_search

agent = build_research_agent(tools=[flight_quotes, hotel_list, weather_info, poi_search])

#user_input = input("Provide your travel details: ")
user_input = """
Weather info in la today?
"""

response = agent.invoke({
    "messages": [{"role": "user", "content": user_input}]
})

tool_msgs = [m for m in response["messages"] if getattr(m, "type", "") == "tool"]
weather_data = next((m.content for m in tool_msgs if m.name == "weather_info"), None)
poi_data = next((m.content for m in tool_msgs if m.name == "poi_search"), None)
hotel_data = next((m.content for m in tool_msgs if m.name == "hotel_list"), None)
flight_data = next((m.content for m in tool_msgs if m.name == "flight_quotes"), None)

if weather_data:
    print("\n Weather Info Retrieved from Tool:")
    print(f"{weather_data}\n")

if poi_data:
    print("\n Points of Interest Retrieved from Tool:")
    print(f"{poi_data}\n")

if hotel_data:
    print("\n Hotel Information Retrieved from Tool:")
    print(f"{hotel_data}\n")

if flight_data:
    print("\n Flight Quotes Retrieved from Tool:")
    print(f"{flight_data}\n")

ai_msg = response["messages"][-1]
text = extract_text_from_api(ai_msg)

try:
    obj = parser.parse(text)
    print(obj)
except Exception as e:
    raise(ValueError("Failed to parse AI response")) from e