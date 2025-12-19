import requests
from datetime import datetime, timedelta

from app.config import Config

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

def round_location(lat, lon):
    return round(lat, 1), round(lon, 1)


def round_time_to_hour(dt):
    if dt.minute >= 30:
        dt = dt.replace(minute=0, second=0) + timedelta(hours=1)
    else:
        dt = dt.replace(minute=0, second=0)
    return dt


def fetch_weather(lat, lon, hour_iso):
    
    if Config.TEST_MODE:
        return {
            "temperature": 10,
            "windspeed": 7,
            "precipitation": 0,
            "humidity": 90,
            "cloudcover": 85,
            "visibility": 800
        }
    
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "windspeed_10m",
            "visibility",
            "cloudcover"
        ],
        "timezone": "UTC"
    }

    response = requests.get(OPEN_METEO_URL, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()
    hours = data["hourly"]["time"]

    if hour_iso not in hours:
        return None

    idx = hours.index(hour_iso)

    return {
        "temperature": data["hourly"]["temperature_2m"][idx],
        "humidity": data["hourly"]["relative_humidity_2m"][idx],
        "precipitation": data["hourly"]["precipitation"][idx],
        "windspeed": data["hourly"]["windspeed_10m"][idx],
        "visibility": data["hourly"]["visibility"][idx],
        "cloudcover": data["hourly"]["cloudcover"][idx]
    }
