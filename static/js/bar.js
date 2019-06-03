async function buildBar(country) {

    //using d3.json to fetch the country data for the plot
    let varietyURL = await d3.json(`/varieties/${country}`);

    const variety = varietyURL.variety
    const counts = varietyURL.count
    const itemsReturned = variety.length

    //console.log(variety)
    //console.log(itemsReturned)
    //console.log(variety[0])

    //build a color array to put in color for varieties that we want
    //to be a certain color in our chart
    //Top10 value counts in world:  
    //Pinot Noir, Cabernet Sauvignon, Chardonnay, Syrah, Red Blend,
    //Zinfandel, MErlot, Sauvignon Blanc, Bordeaux-style Red Blend, Riesling
    //anthing else will be a medium blue/green

    var count = 0;
    colorArray = []
    for (var i = 0; i < itemsReturned; ++i) {
        if (variety[i] == 'Chardonnay') {
            colorChard = 'rgba(255,200,120,0.8)'
            colorArray.push(colorChard)
        } else if (variety[i] == 'Red Blend') {
            colorRedBlend = 'rgba(114,47,55,0.8)'
            colorArray.push(colorRedBlend)
        } else if (variety[i] == 'Cabernet Sauvignon') {
            colorCab = 'rgba(88,11,28,0.8)'
            colorArray.push(colorCab)
        } else if (variety[i] == 'Pinot Noir') {
            colorPinotNoir = 'rgba(120,13,48,0.8)'
            colorArray.push(colorPinotNoir)
        } else {
            //put any non matching colors here
            //colorBasecolor = 'rgba(204,204,204,1)'
            colorBasecolor = 'rgba(0,103,120,1)' //jacksonville jag teal
            colorArray.push(colorBasecolor)
        }

    }
    //console.log(colorArray)

    const varietyTrace = {
        "x": variety,
        "y": counts,
        "type": "bar",
        marker: {
            color: colorArray
        },

    }

    const varietyData = [varietyTrace]

    const layout = {
        margin: {
            t: 30,
            b: 90
        },
        showlegend: false,
        title: "Top 10 Varietal Counts",
        paper_bgcolor: 'rgba(0, 0, 0, 0)', //  transparent backgroung
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        yaxis: {
            showgrid: true,
            gridcolor: '#bdbdbd',
            gridwidth: 2,
        }
    };


    Plotly.newPlot("bar", varietyData, layout);
}