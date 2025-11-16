from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_MODEL = os.getenv("OPENAI_MODEL")

llm = ChatOpenAI(model=OPENAI_MODEL)