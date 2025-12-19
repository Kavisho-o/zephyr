import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    haversine formula calculates the distance between two points on a sphere given their latitudes and longitudes (in kms)
    we need this because route apis only give geometry but
    we also need distance so far for dist->time interpolation (later)

    """
    R = 6371  # radius of earth in kms

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)

    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c
