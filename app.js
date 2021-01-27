
function makeResponsive() {
    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    // var svgWidth = window.innerWidth;
    // var svgHeight = window.innerHeight;

    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
    d3.csv("/assets/data/data.csv").then(function (features) {

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        features.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.abbr = +data.abbr;

        });

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            // .domain([8, d3.max(features, d => d.poverty)])
            .domain([d3.min(features, d => d.poverty), d3.max(features, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            // .domain([4, d3.max(features, d => d.healthcare)])
            .domain([d3.min(features, d => d.healthcare), d3.max(features, d => d.healthcare)])
            .range([height, 0]);

        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(features)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            // .attr("cz", d => yLinearScale(d.abbr))
            .attr("r", "15")
            .attr("fill", "lightblue")
            .attr("opacity", ".5");

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axisText", true)
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .classed("axisText", true)
            .text("In Poverty (%)");

        // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
            .attr("id", "tooltip")
            .offset([80, -60])
            .html(function (d) {
                return (`${data.abbr}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
            });

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("click", function (data) {
            toolTip.show(data, this);
        })
            // onmouseout event
            .on("mouseout", function (data) {
                toolTip.hide(data);
            });

    }).catch(function (error) {
        console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);