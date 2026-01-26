from prompts import parser
from utils import extract_text_from_api
from agent_executor import build_research_agent
from tools import flight_quotes, hotel_list, weather_info, poi_search

agent = build_research_agent(tools=[poi_search, hotel_list])

tokens = True
conversation_history = []

user_input = """
I am planning a trip from New York City to Los Angeles from January 16th to January 20t 2026.
"""

response = agent.invoke({
    "messages": [{"role": "user", "content": user_input}]
})

tools_msgs = [m for m in response["messages"] if getattr(m, "type", "") == "tool"]
flight_data = next((m.content for m in tools_msgs if m.name == "flight_quotes"), None)
weather_data = next((m.content for m in tools_msgs if m.name == "weather_info"), None)
hotel_data = next((m.content for m in tools_msgs if m.name == "hotel_list"), None)
poi_data = next((m.content for m in tools_msgs if m.name == "poi_search"), None)

if flight_data:
    print("\n Flight Quotes Response:")
    print(f"{flight_data}\n")

if weather_data:
    print("\n Weather Info Response:")
    print(f"{weather_data}\n")

if hotel_data:
    print("\n Hotel List Response:")
    print(f"{hotel_data}\n")

if poi_data:
    print("\n Points of Interest Response:")
    print(f"{poi_data}\n")

ai_msg = response["messages"][-1]
text = extract_text_from_api(ai_msg)

print("\n AI Response:")
print(f"{text}\n")  


# while tokens:
#     user_input = input("Provide your travel details: ")
#     if user_input == "exit":
#         tokens = False
# 
#     conversation_history.append({"role": "user", "content": user_input})
# 
#     response = agent.invoke({
#         "messages": conversation_history
#     })
# 
# 
#     ai_msg = response["messages"][-1]
#     text = extract_text_from_api(ai_msg)
# 
#     conversation_history.append({"role": "assistant", "content": text})
# 
#     try:
#         # Resolve issue, where the output is not valid JSON based on the prompt instructions
#         obj = parser.parse(text)
#         print("\n Parsed Itinerary Response:")
#         print(obj)
#         tokens = False
# 
#     except Exception as e:
#          print(f"\n{text}\n")