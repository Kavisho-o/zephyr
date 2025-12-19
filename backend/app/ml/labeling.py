def label_hazard(row):
    """
    convert a single weather row into a hazard score (0–100).
    row keys expected:
    - temperature
    - windspeed
    - precipitation
    - humidity
    - cloudcover
    
    """

    hazard = 0

    # precipitation (0–30)
    p = row["precipitation"]
    if p > 10:
        hazard += 30
    elif p > 5:
        hazard += 25
    elif p > 2:
        hazard += 15
    elif p > 0:
        hazard += 5

    # wind speed (0–25)
    w = row["windspeed"]
    if w > 40:
        hazard += 25
    elif w > 25:
        hazard += 15
    elif w > 10:
        hazard += 5

    # temperature (0–15)
    t = row["temperature"]
    if t < 0 or t > 40:
        hazard += 15
    elif t < 5 or t > 35:
        hazard += 10
    elif t < 10 or t > 30:
        hazard += 5

    # humidity (0–10)
    h = row["humidity"]
    if h > 80:
        hazard += 10
    elif h > 60:
        hazard += 5

    # cloud cover (0–10)
    c = row["cloudcover"]
    if c > 70:
        hazard += 10
    elif c > 30:
        hazard += 5

    return min(hazard, 100)
