import os
import logging
import traceback
from flask import Blueprint, request, jsonify

from app.services.route_service import geocode_location, fetch_route
from app.services.sampling_service import sample_route_every_n_km, densify_route
from app.services.time_service import build_departure_datetime, interpolate_timestamps_by_distance
from app.services.weather_service import fetch_weather, round_location, round_time_to_hour

from app.ml.inference import (
    load_model,
    predict_hazard,
    map_risk,
    generate_advisory,
    summarize_trip
)

# --------------------------------------------------
# Setup
# --------------------------------------------------

logger = logging.getLogger(__name__)

trip_bp = Blueprint("trip", __name__)

# Load ML model once at startup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "hazard_model.pkl")
HAZARD_MODEL = load_model(MODEL_PATH)


# --------------------------------------------------
# Route
# --------------------------------------------------

@trip_bp.route("/predict-trip", methods=["POST"])
def predict_trip():
    try:
        data = request.get_json(force=True)

        start = data["start"]
        end = data["end"]
        departure_date = data["departure_date"]
        departure_time = data["departure_time"]

        dep_datetime = build_departure_datetime(departure_date, departure_time)

        # --------------------------------------------------
        # Geocoding
        # --------------------------------------------------
        start_lat, start_lon = geocode_location(start)
        end_lat, end_lon = geocode_location(end)

        # --------------------------------------------------
        # Routing
        # --------------------------------------------------
        route = fetch_route(start_lat, start_lon, end_lat, end_lon)

        coordinates = route.get("coordinates", [])
        distance_km = route.get("distance_km", 0)
        duration_sec = route.get("duration_sec", 0)

        if not coordinates or len(coordinates) < 2:
            raise ValueError("Route geometry is empty or invalid")

        if distance_km <= 0 or duration_sec <= 0:
            raise ValueError("Route distance or duration is invalid")

        # --------------------------------------------------
        # Sampling
        # --------------------------------------------------
        anchor_points = sample_route_every_n_km(
            coordinates,
            n_km=5
        )

        # 2) Dense virtual points (cheap, visual continuity)
        sampled_points = densify_route(
            anchor_points,
            meters_between_points=500
        )

        if not sampled_points or len(sampled_points) < 1:
            raise ValueError("No sampled points generated from route")

        # --------------------------------------------------
        # Time interpolation
        # --------------------------------------------------
        time_offsets = interpolate_timestamps_by_distance(
            sampled_points,
            duration_sec
        )

        if len(time_offsets) != len(sampled_points):
            raise ValueError("Time interpolation mismatch with sampled points")

        # --------------------------------------------------
        # Weather + Risk Timeline
        # --------------------------------------------------
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

            # Rule-based risk mapping
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

        if not timeline:
            raise ValueError("Timeline generation failed")

        # --------------------------------------------------
        # Trip summary
        # --------------------------------------------------
        trip_summary = summarize_trip(timeline)

        MAX_SEGMENTS = 50

        if len(timeline) > MAX_SEGMENTS:
            step = len(timeline) / MAX_SEGMENTS
            timeline = [
                timeline[int(i * step)]
                for i in range(MAX_SEGMENTS)
            ]

        return jsonify({
            "start": start,
            "end": end,
            "total_distance_km": round(distance_km, 2),
            "estimated_duration_min": round(duration_sec / 60, 1),
            "trip_risk": trip_summary["trip_risk"],
            "trip_advisory": trip_summary["advisory"],
            "worst_segment_index": trip_summary["worst_segment_index"],
            "timeline": timeline
        })

    except Exception as e:
        logger.error("Unhandled error in /predict-trip")
        logger.error(traceback.format_exc())

        return jsonify({
            "error": "Failed to analyze trip",
            "message": str(e)
        }), 500
