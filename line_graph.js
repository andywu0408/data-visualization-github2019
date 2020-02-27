function line_graph(container, data, initialDistrict){

  // set the dimensions and margins of the graph
  var margin = {
      top: 0,
      right: 20,
      bottom: 10,
      left: 40
    },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


  // parse the date / time
  var parseTime = d3.timeParse("%Y");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  this.drawLineGraph = function(data, targetDistrict){

    // define the line
    var valueline = d3.line()
      .x(function(d) {
        return x(d.years);
      })
      .y(function(d) {
        return y(d[targetDistrict]);
      });
    
    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3.select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // remove line before each update
    svg.selectAll('*').remove();

    // Get the data
    d3.csv("./data/2010-2017_review.csv", function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.year = parseTime(d.years);
        d[targetDistrict] = +d[targetDistrict];
        //console.log(d[targetDistrict]);
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) {
        return d.years;
      }));
      y.domain([0, d3.max(data, function(d) {
        return d[targetDistrict];
      })]).nice();

      // Add the valueline path.
      svg.append("path")
        .data([data])
        .attr("class", "line2")
        .attr("d", valueline)
        .attr("transform", "translate(42" + ", 70" + ")");

      // Add the X Axis
      var marginB = 460;

      svg.append("g")
        .attr("transform", "translate(40," + marginB + ")")
        .call(d3.axisBottom(x)
          .tickFormat(d3.format(".4r")));

      // Add the Y Axis
      svg.append("g")
        .attr('class', 'y axis')
        .attr("transform", "translate(40" + ", 70" + ")")
        .call(d3.axisLeft(y)
          .ticks(5));

      svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform",
          "translate(" + (width / 2.5 + 110) + " ," +
          (height + 110) + ")")
        .style("text-anchor", "middle")
        .text("Years");

      // name of district, displayed above line graph
      svg.append("text")
        .attr("transform",
          "translate(" + (width / 2.5 + 110) + " ," +
          (height-350) + ")")
        .style("text-anchor", "middle")
        .text(targetDistrict);

      svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Reviews");
      
      // svg.selectAll("circle")
      //   .data(data)
      //   .enter()
      //   .append("circle")
      //   .attr("r", 5)
      //   .attr("fill", "black")
      //   .attr("cx", function(d) {return x(d.years) + 42})
      //   .attr("cy", function(d) {return y(d[targetDistrict]) + 70})

      svg.select("path")
      .data(data)
        .on('mouseover', function(d) {
            var dot = d3.select('#dot');
  
            // make sure our tooltip is going to be displayed
            dot.style('display', 'block');
    
            // set the initial position of the tooltip
            dot.style('left', (d3.event.pageX - 5 ) + "px");
            dot.style('top', d3.event.pageY + "px");
   
            var displayText = '<br/>'+ (-1*d3.event.pageY/2+550)// text displayed in tooltip
      
            dot.html(displayText); 
        });
    });


      }

  this.drawLineGraph(data, initialDistrict);
}