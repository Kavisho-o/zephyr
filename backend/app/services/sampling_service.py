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
