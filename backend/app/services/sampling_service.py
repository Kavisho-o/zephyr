from app.utils.geometry import haversine_distance

def sample_route_every_n_km(route_coords, n_km=10):
    sampled = [route_coords[0]]
    accumulated = 0.0

    for i in range(1, len(route_coords)):
        prev = route_coords[i - 1]
        curr = route_coords[i]

        dist = haversine_distance(
            prev[0], prev[1],
            curr[0], curr[1]
        )

        accumulated += dist

        if accumulated >= n_km:
            sampled.append(curr)
            accumulated = 0.0

    if sampled[-1] != route_coords[-1]:
        sampled.append(route_coords[-1])

    return sampled


def densify_route(anchor_points, meters_between_points=800):
    """
    Adds virtual points between anchor points.
    These points DO NOT cause extra weather calls.
    
    """

    dense_points = [anchor_points[0]]

    for i in range(1, len(anchor_points)):
        start = anchor_points[i - 1]
        end = anchor_points[i]

        segment_distance_km = haversine_distance(
            start[0], start[1],
            end[0], end[1]
        )

        if segment_distance_km <= 0:
            continue

        steps = max(1, int((segment_distance_km * 1000) / meters_between_points))

        for step in range(1, steps + 1):
            ratio = step / steps

            lat = start[0] + ratio * (end[0] - start[0])
            lon = start[1] + ratio * (end[1] - start[1])

            dense_points.append((lat, lon))

    return dense_points
