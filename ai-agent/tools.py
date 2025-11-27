from urllib import response
from langchain_community.tools import RequestsGetTool
from langchain_core.tools import tool

import openmeteo_requests
import requests_cache
from retry_requests import retry
import datetime
import numpy as np
import pandas as pd

# Set up cached and retried session for Open-Meteo requests
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.3)
openmeteo = openmeteo_requests.Client(session=retry_session)

@tool
def flight_quotes(origin: str, destination: str, date: str, flight_budget: float, currency: str) -> str:
    """Get flight quotes for a given origin, destination, and date."""
    # Placeholder implementation

@tool
def hotel_search(city: str, check_in: str, check_out: str, hotel_budget: float, currency: str) -> str:
    """Search for hotels in a given city within a budget."""
    # Placeholder implementation

@tool
def weather_info(lat: float, lon: float, start_date: str, end_date: str) -> str:
    """Get weather information for a given city and date."""
    params = {
	    "latitude": lat,
	    "longitude": lon,
	    "hourly": "temperature_2m",
        "start_date": start_date,
        "end_date": end_date,
        "timezone": "auto"
    }
    url = choose_endpoint(start_date, end_date)
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]
    
    # Process response data

# Helper function to determine the correct API endpoint based on date range
def choose_endpoint(start_date, end_date):
    today = datetime.date.today()
    sd = datetime.date.fromisoformat(start_date)
    ed = datetime.date.fromisoformat(end_date)
    if ed < today:
        return "https://archive-api.open-meteo.com/v1/archive"
    return "https://api.open-meteo.com/v1/forecast"

@tool
def poi_search(city: str, poi_type: str, characteristics: str) -> str:
    """Search for points of interest in a given city based off of characteristics."""
    # Placeholder implementation