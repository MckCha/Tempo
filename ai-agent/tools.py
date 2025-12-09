from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool

import openmeteo_requests
import requests_cache, requests
from retry_requests import retry
import datetime
import os
from amadeus import Client, ResponseError

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
    token = get_amadeus_token()
    # Amadeus Flight Offers Price API + Flight Offers Search implementation

@tool
def hotel_list(cityCode: str, radius: int, radiusUnit: str, amenities: list, ratings: list, budget: float = None, max_hotels: int = 5) -> str:
    """
    Search for hotels in a given city within a budget if applicable.
    
    Args:
        cityCode (str): The IATA city code.
        radius (int): Search radius.
        radiusUnit (str): Unit for radius (e.g., 'KM', 'MI').
        amenities (list): List of desired amenities.
        ratings (list): List of desired hotel ratings.
        budget (float, optional): Maximum budget for hotel stay.
        max_hotels (int, optional): Maximum number of hotels to return default is 5.
    
    """
    amadeus = get_amadeus_token()
    
    try:
        response = amadeus.reference_data.locations.hotels.by_city.get(
            cityCode = cityCode,
            radius = radius,
            radiusUnit = radiusUnit,
            amenities = amenities,
            ratings = ratings
        )

        hotels_data = response.data

        limited_hotels = hotels_data[:max_hotels]

        simplified_hotels = []
        for hotel in limited_hotels:
            hotel_info = {
                "name": hotel.get("name"),
                "address": hotel.get("address", {}).get("lines", []),
                "city": hotel.get("address", {}).get("cityName"),
                "rating": hotel.get("rating"),
                "amenities": hotel.get("amenities", []),
            }
            simplified_hotels.append(hotel_info)

        return simplified_hotels
    except ResponseError as error:
        return error.message

def get_amadeus_token():
    amadeus = Client(
        client_id=os.getenv("AMADEUS_API_KEY"),
        client_secret=os.getenv("AMADEUS_API_SECRET")
    )
    return amadeus

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