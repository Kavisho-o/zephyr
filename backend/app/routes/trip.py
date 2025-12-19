import os

from flask import Blueprint, request, jsonify

from app.services.route_service import geocode_location, fetch_route
from app.services.sampling_service import sample_route_every_n_km
from app.services.time_service import build_departure_datetime, interpolate_timestamps_by_distance
from app.services.weather_service import fetch_weather, round_location, round_time_to_hour
from app.ml.inference import summarize_trip

from app.ml.inference import (
    load_model,
    predict_hazard,
    map_risk,
    generate_advisory
)

# Load ML model once at startup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "hazard_model.pkl")
HAZARD_MODEL = load_model(MODEL_PATH)

trip_bp = Blueprint("trip", __name__)


@trip_bp.route("/predict-trip", methods=["POST"])
def predict_trip():
    data = request.get_json()

    start = data["start"]
    end = data["end"]
    departure_date = data["departure_date"]
    departure_time = data["departure_time"]

    dep_datetime = build_departure_datetime(departure_date, departure_time)

    start_lat, start_lon = geocode_location(start)
    end_lat, end_lon = geocode_location(end)

    route = fetch_route(start_lat, start_lon, end_lat, end_lon)

    sampled_points = sample_route_every_n_km(
        route["coordinates"],
        route["distance_km"]
    )

    time_offsets = interpolate_timestamps_by_distance(
        sampled_points,
        route["duration_sec"]
    )

    timeline = []
    weather_cache = {}

    for point, offset in zip(sampled_points, time_offsets):
        current_dt = dep_datetime + offset

        lat_bucket, lon_bucket = round_location(point[0], point[1])
        hour_dt = round_time_to_hour(current_dt)
        hour_iso = hour_dt.strftime("%Y-%m-%dT%H:00")

        cache_key = (lat_bucket, lon_bucket, hour_iso)

        if cache_key not in weather_cache:
            weather_cache[cache_key] = fetch_weather(
                lat_bucket,
                lon_bucket,
                hour_iso
            )

        weather = weather_cache[cache_key]

        # ML hazard prediction
        hazard_score = predict_hazard(HAZARD_MODEL, weather)

        visibility = weather.get("visibility") if weather else None

        # Rule-based risk mapping (visibility-aware)
        risk_level = map_risk(hazard_score, visibility)

        advisory = generate_advisory(risk_level)

        timeline.append({
            "lat": point[0],
            "lon": point[1],
            "datetime": current_dt.isoformat(),
            "weather": weather,
            "hazard_score": round(hazard_score, 1),
            "risk_level": risk_level,
            "advisory": advisory
        })

    trip_summary = summarize_trip(timeline)

    return jsonify({
        "start": start,
        "end": end,
        "total_distance_km": round(route["distance_km"], 2),
        "estimated_duration_min": round(route["duration_sec"] / 60, 1),
        "trip_risk": trip_summary["trip_risk"],
        "trip_advisory": trip_summary["advisory"],
        "worst_segment_index": trip_summary["worst_segment_index"],
        "timeline": timeline
    })
