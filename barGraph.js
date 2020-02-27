console.log("Inside BarGraph")
function BarGraph(container, data, initialCountry, dataByCountry, allCountriesGithub) {


    this.drawBarGraph = function (targetCountry, dataByCountry, allCountriesGithub) {
        d3.selectAll("#bar svg").remove()
        var margin = { top: 54, right: 60, bottom: 107, left: 88 },
            width = 960 - margin.left - margin.right,
            height = 2000 - margin.top - margin.bottom;


        var x = d3.scale.linear().range([0, width]);

        var y = d3.scale.ordinal().rangeRoundBands([0, height]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg1 = d3.select("#bar").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "barChartSVG")


        svg1.append("text")
            .attr("x", 0)
            .attr("y", -35)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Avg years coded per person for each country")
            .style("font", "23px avenir")
            .style("fill", "#000000");

        svg1.append("text")
            .attr("x", -69)
            .attr("y", -8)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Country")
            .style("font", "12px avenir")
            .style("fill", "#000000")
            .style("font-weight", "bold");

        svg1.append("text")
            .attr("x", 0)
            .attr("y", 1910)
            .attr("dy", "0em")
            .style("font", "12px avenir")
            .style("fill", "#000000")
            .text("This visualization will highlight the country you selected from draggable globe chart above");



        dataByCountry.forEach(function (d) {
            if (d.values.YearsCode == null) {
                d.values.YearsCode = 0;
            }
            //console.log(d.values.YearsCode)
            // d.count = +d.count;
        });

        //dataByCountry.sort(function (a, b) { return b.count - a.count });

        x.domain([0, 50]);
        y.domain(dataByCountry.map(function (d) { return d.key }));

        svg1.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")

        svg1.append("g")
            .attr("class", "yaxis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")


        svg1.selectAll(".bar")
            .data(dataByCountry)
            .enter().append("rect")
            // .style("fill", "steelblue")
            .attr("fill", function (d) {
                if (d.key == targetCountry) {
                    return "red"
                } else {
                    return "steelblue"
                }
            })
            .attr("y", function (d) { return y(d.key) })  // Country
            .attr("width", function (d) { return x(d.values.YearsCode); })

            .attr("height", 3)

        svg1.append("text")
            .attr("x", 350)
            .attr("y", 1890)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Avg Number of years coded")
            .style("font", "12px avenir")
            .style("fill", "#000000")
            .style("font-weight", "bold");
    };


    this.drawBarGraph("Taiwan", dataByCountry, allCountriesGithub);
}