function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of country names to populate the select country options
    d3.json("/countries").then((countryNames) => {
        countryNames.forEach((country) => {
            selector
                .append("option")
                .text(country)
                .property("value", country)
        });

        // Use the first sample from the list to build the initial plots
        const firstCountry = countryNames[0]
        buildBar(firstCountry)
        buildD3(firstCountry)
    });
}


// Get new data whenever the dropdown selection changes
function optionChanged(newCountry) {
    //fetch new data for the new country
    buildBar(newCountry)
    buildD3(newCountry)
}

// // Initializae the dashboard
init()