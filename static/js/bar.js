async function buildBar(country) {

    //using d3.json to fetch the country data for the plot
    // console.log("in buildCharts:" + country)
    //console.log(trace)
    //d3.json(`/varieties/${country}`).then(function (trace) {
    //console.log(trace)    //peek at the data

    let varietyURL = await d3.json(`/varieties/${country}`);
    // console.log("in buildCharts--bar chart")
    // console.log("country:" + country)
    // console.log(data)
    //const layout = { margin: { t: 30, b: 100 } };
    //Plotly.plot("bar", data, layout);
    const variety = varietyURL.variety
    const counts = varietyURL.count

    const varietyTrace = {
        "x": variety,
        "y": counts,
        "type": "bar"
    }

    const varietyData = [varietyTrace]

    const layout = {
        margin: {
            t: 100,
            b: 100
        },
        showlegend: true,
        title: "Top 10 Variety Counts"
    };

    Plotly.newPlot("bar", varietyData, layout);
}

//end of d3.json fetch country data