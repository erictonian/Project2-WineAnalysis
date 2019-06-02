// Creating map object
const bounds = L.LatLngBounds(L.LatLng(-89.999999, -179.999999), L.LatLng(89.999999, 179.999999))

var myMap = L.map("mapPlot", {
    center: [4.5, 20],
    zoomSnap: .1,
    zoomDelta: .5,
    zoom: 2.5,
    minZoom: 2.5,
    maxZoom: 6,
    setMaxBounds: bounds,
    maxBoundsViscosity: 1,
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    noWrap: false,
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
}).addTo(myMap);

(async function buildMap() {
    // Link to GeoJSON
    const path = "/mapData"
    const data = await d3.json(path);

    // Create a new choropleth layer
    const geojson = L.choropleth(data, {

        // Define what  property in the features to use
        valueProperty: "total_wines",

        // Set color scale
        colors: ['#f3c4d7', '#dda9bb', '#c78ea1', '#b17587', '#9c5b6e', '#864256', '#712a3f', '#5b0e2a'],

        // Number of breaks in step range
        steps: 8,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },

        // Binding a pop-up to each layer
        onEachFeature: function (feature, layer) {
            const popupMsg = `<center><h5>${feature.properties.name}</h5>Number of Wines: ${feature.properties.total_wines}<br>Avg. Wine Review: ${feature.properties.avg_score}</center>`
            layer.bindPopup(popupMsg);
        }
    }).addTo(myMap);

    // Set up the legend
    const legend = L.control({
        position: "topright"
    });
    legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        const limits = geojson.options.limits;
        const colors = geojson.options.colors;

        // Add min & max
        const legendInfo = "<center>Wines Reviewed</center>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        const labels = limits.map((limit, index) => {
            return "<li style=\"background-color: " + colors[index] + "\"></li>"
        })

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
})()