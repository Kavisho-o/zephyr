import csv
from app.ml.labeling import label_hazard


def build_training_dataset(input_csv, output_csv):
    """
    Phase 2.4:
    Converts raw weather CSV into ML-ready dataset
    by appending hazard_score.
    
    """

    with open(input_csv, "r") as infile, open(output_csv, "w", newline="") as outfile:
        reader = csv.DictReader(infile)

        fieldnames = reader.fieldnames + ["hazard_score"]
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)

        writer.writeheader()

        for row in reader:
            weather_row = {
                "temperature": float(row["temperature"]),
                "windspeed": float(row["windspeed"]),
                "precipitation": float(row["precipitation"]),
                "humidity": float(row["humidity"]),
                "cloudcover": float(row["cloudcover"]),
            }

            hazard_score = label_hazard(weather_row)
            row["hazard_score"] = hazard_score

            writer.writerow(row)
