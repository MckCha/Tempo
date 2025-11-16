from pydantic import BaseModel

class ItineraryResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str]
    tools_used: list[str]