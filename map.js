console.log("Inside bubble chart");
// NOTE: I used this tutorial as reference
function mapp(container, data, dataByCountry, allCountriesGithub, updateBarGraph) {
  this.updateBarGraph = updateBarGraph;

  var margin = {
    top: 0,
    right: 20,
    bottom: 0,
    left: 40
  },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    sens = 0.25,
    focused;

  //Setting projection

  var projection = d3.geo.orthographic()
    .scale(245)
    .rotate([0, 0])
    .translate([width / 2, height / 2])
    .clipAngle(90);

  var path = d3.geo.path()
    .projection(projection);

  //SVG container

  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

  //Adding water

  svg.append("path")
    .datum({ type: "Sphere" })
    .attr("class", "water")
    .attr("d", path);



  // var CT2 = svg.append("text")
  //   .attr("x", 80)
  //   .attr("y", -30)
  //   .attr("dy", "0.71em")
  //   .attr("fill", "#000")
  //   .text(`Selected Country: ${}`)
  //   .style("font", "18px avenir")
  //   .style("fill", "#000000")
  //   .attr("class", "CT2")


  var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip"),
    countryList = d3.select("body").append("select").attr("name", "countries").attr("class", "select");


  queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.tsv, "data/world-110m-country-names.tsv")
    .await(ready);

  //Main function

  function ready(error, world, countryData) {

    var countryById = {},
      countries = topojson.feature(world, world.objects.countries).features;

    //Adding countries to select

    countryData.forEach(function (d) {
      countryById[d.id] = d.name;
      option = countryList.append("option");
      option.text(d.name);
      option.property("value", d.id);
    });

    //Drawing countries on the globe

    var world = svg.selectAll("path.land")
      .data(countries)
      .enter().append("path")
      .attr("class", "land")
      .attr("d", path)

      //Drag event

      .call(d3.behavior.drag()
        .origin(function () { var r = projection.rotate(); return { x: r[0] / sens, y: -r[1] / sens }; })
        .on("drag", function () {
          var rotate = projection.rotate();
          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
          svg.selectAll("path.land").attr("d", path);
          svg.selectAll(".focused").classed("focused", focused = false);
        }))

      .on("mouseover", function (d) {
        if (!allCountriesGithub.includes(countryById[d.id])) {
          countryTooltip.text(countryById[d.id] + " (Not in dataset)")
            .style("left", (d3.event.pageX + 7) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            .style("display", "block")
            .style("opacity", 1);
        } else {
          countryTooltip.text(countryById[d.id])
            .style("left", (d3.event.pageX + 7) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            .style("display", "block")
            .style("opacity", 1);
        }
      })
      .on("mouseout", function (d) {
        countryTooltip.style("opacity", 0)
          .style("display", "none");
      })
      .on("mousemove", function (d) {
        countryTooltip.style("left", (d3.event.pageX + 7) + "px")
          .style("top", (d3.event.pageY - 15) + "px");
      });

    //Country focus on option select

    d3.select("select").on("change", function () {
      // remove previous selection's info on new selection
      d3.selectAll(".infoBox").remove()
      d3.selectAll(".mapPop").remove()
      d3.selectAll(".mapYC").remove()

      var rotate = projection.rotate(),
        focusedCountry = country(countries, this),
        p = d3.geo.centroid(focusedCountry);

      d3.select("body").append("text")
        .attr("transform",
          "translate(" + (900) + " ," +
          (height - 350) + ")")
        .style("text-anchor", "bold")
        .style("font-size", "40px")
        .text(countryById[focusedCountry.id])
        .attr("class", "infoBox")

      if (allCountriesGithub.includes(countryById[focusedCountry.id])) {
        updateBarGraph(countryById[focusedCountry.id]);
        d3.select("body").append("text")
          .attr("transform",
            "translate(" + (800) + " ," +
            (height - 400) + ")")
          .style("text-anchor", "bold")
          .text("Total Respondants: " + dataByCountry.find(obj => obj.key == countryById[focusedCountry.id]).values.count)
          .attr("class", "mapPop")

        d3.select("body").append("text")
          .attr("transform",
            "translate(" + (600) + " ," +
            (height - 450) + ")")
          .style("text-anchor", "bold")
          .text("Avg Years Coded: " + dataByCountry.find(obj => obj.key == countryById[focusedCountry.id]).values.YearsCode.toPrecision(2))
          .attr("class", "mapYC")

      } else {
        updateBarGraph("EMPTY");
        d3.select("body").append("text")
          .attr("transform",
            "translate(" + (800) + " ," +
            (height - 400) + ")")
          .style("text-anchor", "bold")
          .text("No data available")
          .attr("class", "mapPop")
      }



      svg.selectAll(".focused").classed("focused", focused = false);

      //Globe rotating

      (function transition() {
        d3.transition()
          .duration(2500)
          .tween("rotate", function () {
            var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
            return function (t) {
              projection.rotate(r(t));
              svg.selectAll("path").attr("d", path)
                .classed("focused", function (d, i) { return d.id == focusedCountry.id ? focused = d : false; });
            };
          })
      })();
    });

    function country(cnt, sel) {
      for (var i = 0, l = cnt.length; i < l; i++) {
        if (cnt[i].id == sel.value) { return cnt[i]; }
      }
    };

  };
}
