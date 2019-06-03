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
    # print(countries)
    return jsonify(countries)


@app.route("/mapData")
def map_data():
    """Return the map data in GeoJSON format"""
    filepath = os.path.join("db", "map_data.json")
    with open(filepath) as jsonfile:
        map_data = json.load(jsonfile)

    # print(map_data)
    return jsonify(map_data)


@app.route("/varieties/<country>")
# <country is actually passed on the pull down click..
def varieties_data(country):
    """Return variety counts by the selected country"""

    # print(country)
    stmt = db.session.query(Wines).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    condition = (df["country"] == country)
    df_only_country = df.loc[condition, :]

    df_variety_totals = df_only_country['variety'].value_counts(
    ).rename_axis("Variety").reset_index(name="Counts")
    df_top10varieties = df_variety_totals[:10]

    data = {
        "variety": df_top10varieties.Variety.values.tolist(),
        "count": df_top10varieties.Counts.values.tolist(),
    }

    # print(data)
    return jsonify(data)


@app.route("/time/<country>")
def time_data(country):
    """Return data for price, score, and year for D3 chart"""

    stmt = db.session.query(Wines).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    condition = (df["country"] == country)
    df_only_country = df.loc[condition, :]

    # group by year
    group_by_year = df_only_country.groupby(['year'])

    # group by points
    df_points_by_year = pd.DataFrame(group_by_year["points"].mean())

    # df_points_by_year
    avg_price = group_by_year["price"].mean()
    df_total = df_points_by_year
    df_total['price'] = avg_price
    df_total = df_total.reset_index()
    df_total = df_total[(df_total["year"] > 1900) & (df_total["year"] < 2020)]

    data = df_total.to_json(orient="records")

    # print(data)
    return data


if __name__ == "__main__":
    app.run(debug=True)
