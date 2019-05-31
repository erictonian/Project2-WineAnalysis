import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/wine_data.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
# Wines = Base.classes.wine_data


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/MapData")
def map_data(map_data):
    """ Return the map data in GeoJSON format """
    map_data = "/db/map_data.json"
    return jsonify(map_data)


if __name__ == "__main__":
    app.run()
