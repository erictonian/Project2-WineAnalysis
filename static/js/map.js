// Creating map object
var myMap = L.map("mapPlot", {
    center: [20, 0],
    zoom: 2
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

(async function () {
    // Link to GeoJSON
    const path = "../../json_merging/map_data.json"
    const data = await d3.json(path);

    // Create a new choropleth layer
    const geojson = L.choropleth(data, {

        // Define what  property in the features to use
        totalWines: "total_wines",

        // Set color scale
        scale: ["#ffffb2", "#892545"],

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
            const popupMsg = `<h3>${feature.properties.name}</h3><br>Number of Wines: ${feature.properties.total_wines}<br>Avg. Wine Review: ${feature.properties.avg_score}`
            layer.bindPopup(popupMsg);
        }
    }).addTo(myMap);

    // Set up the legend
    const legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        const limits = geojson.options.limits;
        const colors = geojson.options.colors;

        // Add min & max
        const legendInfo = "<h2>Wines Reviewed</h2>" +
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