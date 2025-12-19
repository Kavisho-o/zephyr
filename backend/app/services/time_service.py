# app/services/time_service.py

from datetime import datetime, timedelta
from app.utils.geometry import haversine_distance

def build_departure_datetime(date_str, time_str):
    """
    date_str: YYYY-MM-DD
    time_str: HH:MM

    """
    return datetime.fromisoformat(f"{date_str}T{time_str}")

def interpolate_timestamps_by_distance(sampled_points, total_duration_sec):
    """
    Returns a list of timedelta offsets corresponding to each sampled point.
    
    """
    distances = [0.0]

    # compute cumulative distance
    for i in range(1, len(sampled_points)):
        prev = sampled_points[i - 1]
        curr = sampled_points[i]

        dist = haversine_distance(
            prev[0], prev[1],
            curr[0], curr[1]
        )
        distances.append(distances[-1] + dist)

    total_distance = distances[-1]

    # map distance ratio → time offset
    time_offsets = []
    for d in distances:
        ratio = d / total_distance if total_distance > 0 else 0
        seconds = ratio * total_duration_sec
        time_offsets.append(timedelta(seconds=seconds))

    return time_offsets
