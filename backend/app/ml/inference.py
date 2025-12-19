import pickle


RISK_SAFE = "SAFE"
RISK_CAUTION = "CAUTION"
RISK_DANGEROUS = "DANGEROUS"


def load_model(model_path: str):
    with open(model_path, "rb") as f:
        return pickle.load(f)


def predict_hazard(model, weather_row: dict) -> float:
    """
    Predict hazard_score using trained ML model.

    """
    if weather_row is None:
        return 0.0
    
    features = [[
        weather_row.get("temperature", 0),
        weather_row.get("windspeed", 0),
        weather_row.get("precipitation", 0),
        weather_row.get("humidity", 0),
        weather_row.get("cloudcover", 0),
    ]]

    return float(model.predict(features)[0])


def map_risk(hazard_score: float, visibility: float) -> str:
    """
    convert hazard_score + visibility into risk level.

    """

    # hard visibility override
    if visibility is not None and visibility < 300:
        return RISK_DANGEROUS

    # high hazard
    if hazard_score >= 40:
        return RISK_DANGEROUS

    # moderate risk
    if hazard_score >= 20 or (visibility is not None and visibility < 1000):
        return RISK_CAUTION

    # safe
    return RISK_SAFE


def generate_advisory(risk_level: str) -> str:

    if risk_level == RISK_DANGEROUS:
        return "Unsafe driving conditions detected. Consider delaying travel."
    
    if risk_level == RISK_CAUTION:
        return "Reduced visibility or weather conditions require cautious driving."
    
    return "Weather conditions are suitable for driving."


def summarize_trip(timeline):
    """
    Phase 3.2:
    Aggregates per-point risk into trip-level risk and advisory.
    
    """

    risk_priority = {
        "SAFE": 0,
        "CAUTION": 1,
        "DANGEROUS": 2
    }

    worst_risk = "SAFE"
    worst_index = 0

    for idx, point in enumerate(timeline):
        risk = point["risk_level"]
        if risk_priority[risk] > risk_priority[worst_risk]:
            worst_risk = risk
            worst_index = idx

    if worst_risk == "DANGEROUS":
        advisory = "Hazardous conditions detected along the route. Consider postponing the trip."
    elif worst_risk == "CAUTION":
        advisory = "Some parts of the trip require cautious driving."
    else:
        advisory = "Trip conditions are generally safe for travel."

    return {
        "trip_risk": worst_risk,
        "advisory": advisory,
        "worst_segment_index": worst_index
    }
