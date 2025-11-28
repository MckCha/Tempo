
from langchain_core.output_parsers import PydanticOutputParser
from models import ItineraryResponse

parser = PydanticOutputParser(pydantic_object=ItineraryResponse) 

system_prompt_text = f"""
You are a travel research assistant. Answer the user query and use necesary tools. 
Wrap the output in the following JSON format:
{parser.get_format_instructions()}
"""