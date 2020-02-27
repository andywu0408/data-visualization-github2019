console.log("Hello from main.js");

// read data from json file
d3.csv("developer_survey_2019/survey_results_public.csv", function (datum) {

  var dataByCountry = d3.nest()
    .key(function (d) { return d.Country; })
    .rollup(function (v) {
      return {
        count: v.length,
        YearsCode: d3.mean(v, function (d) { return d.YearsCode; })

        // total: d3.sum(v, function(d) { return d.amount; }),
        // avg: d3.mean(v, function(d) { return d.amount; })
      };
    })
    .entries(datum);


  var allCountriesGithub = [];

  dataByCountry.forEach(function (arrayItem) {
    var country = arrayItem.key;
    allCountriesGithub.push(country)
  })

  var parallelData = datum.map(function (d) {
    return {
      Country: d.Country,
      Age1stCode: d.Age1stCode,
      YearsCode: d.YearsCode,
      YearsCodePro: d.YearsCodePro,
      SOVisit1st: d.SOVisit1st
    }
  });

  // console.log(parallelData)
  var map = new mapp(d3.select("#map"), datum, dataByCountry, allCountriesGithub,
    function (targetCountry) {
      //console.log(targetCountry)
      barGraph.drawBarGraph(targetCountry, dataByCountry, allCountriesGithub) // "EMPTY" or country's name
      Parallel.drawParallelChart(targetCountry, parallelData, dataByCountry, allCountriesGithub)
    },
  );

  var barGraph = new BarGraph(d3.select('#bar'), datum, "Taiwan", dataByCountry, allCountriesGithub);
  var Parallel = new ParallelChart(d3.select('#parallel'), datum, "Taiwan", parallelData, dataByCountry, allCountriesGithub);
});


