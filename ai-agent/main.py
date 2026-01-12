from prompts import parser
from utils import extract_text_from_api
from agent_executor import build_research_agent
from tools import flight_quotes, hotel_list, weather_info, poi_search

agent = build_research_agent(tools=[flight_quotes, hotel_list, poi_search])

tokens = True
conversation_history = []

while tokens:
    user_input = input("Provide your travel details: ")
    if user_input == "exit":
        tokens = False

    conversation_history.append({"role": "user", "content": user_input})

    response = agent.invoke({
        "messages": conversation_history
    })


    ai_msg = response["messages"][-1]
    text = extract_text_from_api(ai_msg)

    conversation_history.append({"role": "assistant", "content": text})

    try:
        # Resolve issue, where the output is not valid JSON based on the prompt instructions
        obj = parser.parse(text)
        print("\n Parsed Itinerary Response:")
        print(obj)
        tokens = False

    except Exception as e:
         print(f"\n{text}\n")