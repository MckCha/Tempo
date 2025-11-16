# Helper function that takes consideration of differnt api call outputs
def extract_text_from_api(msg):
    c = msg.content
    if isinstance(c, str):
        return c
    if isinstance(c, list):
        return "".join(
            part.get("text", "")
            for part in c
                if isinstance(part, dict) and part.get("type") == "text"
        )
    return str(c)