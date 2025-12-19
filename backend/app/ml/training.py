import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error


FEATURE_COLUMNS = [
    "temperature",
    "windspeed",
    "precipitation",
    "humidity",
    "cloudcover",
]


def train_hazard_model(
    dataset_csv: str,
    model_output_path: str = "hazard_model.pkl"
):
    """
    Phase 2.5:
    Trains a simple regression model to predict hazard_score
    from weather features.
    
    """

    # load dataset
    df = pd.read_csv(dataset_csv)

    X = df[FEATURE_COLUMNS]
    y = df["hazard_score"]

    # train-test split (basic validation)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # train model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # basic evaluation
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)

    print(f"Model trained successfully")
    print(f"Test MAE: {mae:.2f}")

    # persist model
    with open(model_output_path, "wb") as f:
        pickle.dump(model, f)

    return model
