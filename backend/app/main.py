# attempting an industry standard pattern for testing, scaling and clean seperation

from flask import Flask
from app.config import Config
from app.logging import setup_logging
from flask_cors import CORS

def create_app():
    setup_logging()

    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    # registering blueprints
    from app.routes.health import health_bp
    app.register_blueprint(health_bp)

    from app.routes.trip import trip_bp
    app.register_blueprint(trip_bp)

    return app
