let svgWidth = 1000;
let svgHeight = 500;
let margin = {
    top: 20,
    right: 40,
    bottom: 105,
    left: 100
};
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// function used for updating x-scale let upon click on axis label
// Use bracket notation when you don't know the variable name, dot notation when you do ("[]" notation use below for the transitions)
// Min/max buffers to ensure all dat gets plotted within the chart boundaries
// Create y scale function
function yScale(timeData, chosenYAxis) {
    // create scales
    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(timeData, d => d[chosenYAxis]) * 0.9,
            d3.max(timeData, d => d[chosenYAxis]) * 1.1
        ])
        .range([height, 0]);
    return yLinearScale;
}
// function used for updating yAxis let upon click on axis label
function renderYAxis(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
// function used for updating country text (textGroup)  with a transition to new text
function renderYLabels(labelsYGroup, newYScale, chosenYAxis) {
    labelsYGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]))
    return labelsYGroup;
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {
    let xlabel = [timeData.country] + "Wines over Time";
    let ylabel = "";
    // Updating circles group along y-axis
    if (chosenYAxis === "points") {
        ylabel = "Wine Ratings (Points)";
    }
    // else if (chosenYAxis === "price") {
    else {
        ylabel = "Wine Price ($)";
    }
    console.log("xlabel: " + xlabel)
    console.log("ylabel: " + ylabel)
    // ToolTip elements
    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.country}<br>${d.region_1}<br>${d.variety}<br>${d.designation} ${d[chosenXAxis]}`);
        });
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function (data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data, this);
        });
    return circlesGroup;
}
var g_sync

async function buildD3(country) {
    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    let timeData = await d3.json(`/time/${country}`)

    //parse data
    timeData.forEach(function (data) {
        data.year = +data.year
        data.points = +data.points
        data.price = +data.price
    })

    d3.selectAll("#d3Plot > *").remove()

    var svg = d3
        .select("#d3Plot")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    // Append an SVG group
    let chartGroup = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // Initial Params
    let chosenYAxis = "points";

    g_sync = timeData

    // xLinearScale function above csv import
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(timeData, d => d.year), d3.max(timeData, d => d.year)])
        .range([0, width])
    // yLinearScale function above csv import

    let yLinearScale = yScale(timeData, chosenYAxis);

    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(timeData)
        //.remove()
        .enter()
        .append("circle")
        // .attr("cx", d => yLinearScale(d[chosenXAxis]))
        .attr("cx", d => xLinearScale(d.year))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        // .attr("cy", d => yLinearScale(d.points))
        .attr("r", 20)
        .attr("fill", "red")
        .attr("opacity", ".5")

    // Create group for  2 y- axis labels
    let labelsYGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    let pointsLabel = labelsYGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "points") // value to grab for event listener
        .classed("active", true)
        .text("Wine Ratings (Points)");

    let priceLabel = labelsYGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "2em")
        .attr("value", "price") // value to grab for event listener
        .classed("active", false)
        .text("Wine Prices ($)");

    // append x axis
    chartGroup.append("text")
        // .remove()
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "year")
        .classed("active", true)
        .text("Vintage Years")
    // updateToolTip function above csv import
    // circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

    // y axis labels event listener
    labelsYGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            let value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                // replaces chosenYAxis with value
                chosenYAxis = value;
                console.log(chosenYAxis)
                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(timeData, chosenYAxis);
                // updates y axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);
                // updates circles with new y values
                circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
                // updates tooltips with new info
                // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
                // changes classes to change bold text
                if (chosenYAxis === "points") {
                    pointsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    priceLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    pointsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    priceLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        })
}