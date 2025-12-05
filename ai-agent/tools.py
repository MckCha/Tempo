from langchain_community.tools import RequestsGetTool, DuckDuckGoSearchRun
from langchain_core.tools import tool

import openmeteo_requests
import requests_cache, requests
from retry_requests import retry
import datetime
import os

# Set up cached and retried session for Open-Meteo requests
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.3)
openmeteo = openmeteo_requests.Client(session=retry_session)

@tool
def web_search(query: str, num_results: int = 5) -> str:
    """Perform a web search and return the top results."""
    ddg = DuckDuckGoSearchRun(max_results=num_results)
    results = ddg.run(query)
    return results

@tool
def flight_quotes(origin: str, destination: str, date: str, flight_budget: float, currency: str) -> str:
    """Get flight quotes for a given origin, destination, and date."""
    # Amadeus Flight Offers Price API + Flight Offers Search implementation

@tool
def hotel_search(lat: float, lon: float, radius: int = 10, radiusUnit: str = "km") -> str:
    """Search for hotels in a given city within a budget."""
    token = get_amadeus_token()

    paramaters = {
        "latitude": lat,
        "longitude": lon,
        "radius": radius,
        "radiusUnit": radiusUnit,
    }

    hotel = cache_session.get(
        "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode",
        params = paramaters,
        headers = {"Authorization": f"Bearer {token}"}
    )
    
    data = hotel.json()
    
    hotels = data.get("data", [])[:10]  # Top 10 hotels

    top_hotels = []
    for hotel in hotels:
        top_hotels.append({
            "name": hotel.get("name"),
            "hotelId": hotel.get("hotelId"),
            "iataCode": hotel.get("iataCode"),
        })    
    return top_hotels

def get_amadeus_token():
    auth_response = requests.post("https://test.api.amadeus.com/v1/security/oauth2/token",
        data={
            "grant_type": "client_credentials",
            "client_id": os.getenv("AMADEUS_API_KEY"),
            "client_secret": os.getenv("AMADEUS_API_SECRET")
        }
    )
    return auth_response.json()["access_token"]

@tool
def weather_info(lat: float, lon: float, start_date: str, end_date: str, temperature_unit: str) -> str:
    """Get weather information for a given city and date."""
    params = {
	    "latitude": lat,
	    "longitude": lon,
	    "hourly": "temperature_2m",
        "start_date": start_date,
        "end_date": end_date,
        "temperature_unit": "fahrenheit",
        "timezone": "auto"
    }
    url = choose_endpoint(start_date, end_date)
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]
    temps = response.Hourly().Variables(0).ValuesAsNumpy()
    return {
        "parameters": params,
        "min_temp_f": float(temps.min()),
        "max_temp_f": float(temps.max()),
        "avg_temp_f": float(temps.mean())
    }

# Helper function to determine the correct API endpoint based on date range
def choose_endpoint(start_date, end_date):
    today = datetime.date.today()
    sd = datetime.date.fromisoformat(start_date)
    ed = datetime.date.fromisoformat(end_date)
    if ed < today:
        return "https://archive-api.open-meteo.com/v1/archive"
    return "https://api.open-meteo.com/v1/forecast"

@tool
def poi_search(lat: float, lon: float, radius: int = 5000, poi_categories: str = "all") -> str:
    """Find multiple points of interest near a location (museums, restaurants, parks, attractions)."""
    
    # Build category filters based on input
    query = f"""
    [out:json][timeout:25];
    (
      node["tourism"~"museum|attraction|artwork|viewpoint"]["name"](around:{radius},{lat},{lon});
      node["amenity"~"restaurant|cafe|bar"]["name"](around:{radius},{lat},{lon});
      node["leisure"~"park|garden|nature_reserve"]["name"](around:{radius},{lat},{lon});
      node["historic"]["name"](around:{radius},{lat},{lon});
    );
    out body 15;
    """
    
    response = cache_session.get(
        "https://overpass-api.de/api/interpreter",
        params={"data": query},
        headers={"User-Agent": "TravelAgent/1.0"}
    )
    
    data = response.json()
    
    pois = []
    for elem in data.get("elements", []):
        tags = elem.get("tags", {})
        poi_type = (tags.get("tourism") or tags.get("amenity") or 
                   tags.get("leisure") or tags.get("historic") or "other")
        
        pois.append({
            "name": tags.get("name", "Unnamed"),
            "type": poi_type,
            "lat": elem.get("lat"),
            "lon": elem.get("lon"),
            "address": tags.get("addr:street", ""),
        })
    
    return {
        "search_location": {"lat": lat, "lon": lon, "radius_m": radius},
        "poi_count": len(pois),
        "recommendations": pois[:10]  # Top 10
    }