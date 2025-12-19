# this file contains the basic app configuration

import os

class Config:
    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = ENV == "development"

    # we store the api keys here
    OPENROUTESERVICE_API_KEY = os.getenv("OPENROUTESERVICE_API_KEY")
    OPEN_METEO_URL = "https://api.open-meteo.com/v1"

    # app constants
    REQUEST_TIMEOUT = 10

    TEST_MODE = os.getenv("TEST_MODE","false").lower() == "true"