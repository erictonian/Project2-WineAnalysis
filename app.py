import os

import json
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
Wines = Base.classes.wine_data


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/countries")
def country_names():
    """Return the choices for the selection country"""

    # Query for the country
    results = db.session.query(Wines.country.distinct().label("country"))
    countries = [row.country for row in results.all()]
    countries = sorted(countries, reverse=False)

    # ready to load into country selector
    print(countries)
    return jsonify(countries)


@app.route("/mapData")
def map_data():
    """ Return the map data in GeoJSON format """
    filepath = os.path.join("db", "map_data.json")
    with open(filepath) as jsonfile:
        map_data = json.load(jsonfile)

    print(map_data)
    return jsonify(map_data)


if __name__ == "__main__":
    app.run(debug=True)
