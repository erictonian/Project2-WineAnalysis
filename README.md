# UTA Data Bootcamp Project 2 - Analysis of Wine Ratings

---

### Team Members: Ryan Frescas, Eric Staveley, Tony Jones, Eric Tonian

---
Link to functioning build: https://wineanalysis.herokuapp.com

## Project Summary

Continuing on Ryan/Eric T's ETL project _"Wine and Happiness"_, we dove further into the great World of Wine! Using already scraped data from WineEnthusiast, we built a visual dashboard app made up of the following: a main 'World Wine Map' using Leaflet and a choropleth plugin; an interactive d3 graph that allows for user to compare different variables (avg. price per year, avg. rating per year) per country based on user selection; and a bar chart breakdown of the top 10 types of wine (cab sauv, red blend, etc.) per country based on the same user selection.

#### ETL and App Build

Two main data transformations were necessary for this project:
  - The first involved cleaning the wine csv itself to remove and modify values that would result in issues when mapping and aggregating the data. We also were able to pull the year from the title column in order to perform time-based analysis in our graphs. These changes were then converted into a sqlite file for the Flask app. 
  - The second involved merging the wine csv with a geojson containing country boundaries and then exporting this back into a properly formatted geojson in order to correctly display wine data on the choropleth map.
  
The app was built with Flask, connecting our sqlite file to the database and creating routes for the main page, map, dropdown, and the two graphs. The graph routes contain all data aggregation necessary for the corresponding js files based on user selection of the dropdown.

## Resources

Wine Review Dataset- 130k wine reviews with variety, location, winery, price, and description
https://www.kaggle.com/zynicide/wine-reviews

Country Boundaries GeoJSON
https://github.com/johan/world.geo.json

Choropleth Leaflet Plugin
https://github.com/timwis/leaflet-choropleth

![glug-glug](static/images/winepour.gif)
