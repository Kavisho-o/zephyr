import requests
import csv

OPEN_METEO_HISTORICAL_URL = "https://archive-api.open-meteo.com/v1/archive"

FIELDS = [
    "temperature_2m",
    "windspeed_10m",
    "precipitation",
    "relative_humidity_2m",
    "cloudcover",
]


def fetch_historical_weather(lat, lon, start_date, end_date):
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": ",".join(FIELDS),
        "timezone": "UTC",
    }

    response = requests.get(
        OPEN_METEO_HISTORICAL_URL,
        params=params,
        timeout=10
    )
    response.raise_for_status()
    return response.json()


def save_to_csv(weather_data, filename):
    hourly = weather_data["hourly"]
    times = hourly["time"]

    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "temperature",
            "windspeed",
            "precipitation",
            "humidity",
            "cloudcover",
        ])

        for i in range(len(times)):
            row = [
                hourly["temperature_2m"][i],
                hourly["windspeed_10m"][i],
                hourly["precipitation"][i],
                hourly["relative_humidity_2m"][i],
                hourly["cloudcover"][i],
            ]

            # Skip only if ANY core value missing
            if any(v is None for v in row):
                continue

            writer.writerow(row)
