
from langchain_core.output_parsers import PydanticOutputParser
from models import ItineraryResponse

parser = PydanticOutputParser(pydantic_object=ItineraryResponse) 

system_prompt_text = f"""
You are a Travel Assistant. Understand the user's travel plans and provide a detailed itinerary. Answer the user with necessary tools.
{parser.get_format_instructions()}
"""