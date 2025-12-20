# geocoding + routing

import requests
from app.config import Config

def geocode_location(place_name):

    print("ORS KEY INSIDE APP:", Config.OPENROUTESERVICE_API_KEY)

    url = "https://api.openrouteservice.org/geocode/search"

    params = {
        "api_key": Config.OPENROUTESERVICE_API_KEY,
        "text": place_name,
        "size": 1
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()

    if "features" not in data or not data["features"]:
        raise ValueError(f"Could not geocode location: {place_name}")

    lon, lat = data["features"][0]["geometry"]["coordinates"]
    return lat, lon


def fetch_route(start_lat, start_lon, end_lat, end_lon):
    url = "https://api.openrouteservice.org/v2/directions/driving-car"

    headers = {
        "Authorization": Config.OPENROUTESERVICE_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "coordinates": [
            [start_lon, start_lat],
            [end_lon, end_lat]
        ],
        "geometry_format": "geojson"
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=10
    )

    response.raise_for_status()
    data = response.json()

    if "routes" not in data or not data["routes"]:
        raise ValueError(f"Invalid route response: {data}")

    route = data["routes"][0]

    geometry = route["geometry"]["coordinates"]

    # ORS gives [lon, lat]
    polyline = [(lat, lon) for lon, lat in geometry]

    summary = route["summary"]

    return {
        "coordinates": polyline,
        "distance_km": summary["distance"] / 1000,
        "duration_sec": summary["duration"]
    }
