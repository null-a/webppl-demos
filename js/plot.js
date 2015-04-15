// http://bl.ocks.org/mbostock/3310323

function initPlot(width, height, xDomain, yDomain) {

  var width = width || 600,
      height = height || 600;

  var xDomain = xDomain || [0,1],
      yDomain = yDomain || [0,1];

  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      totalWidth = width + margin.left + margin.right,
      totalHeight = height + margin.top + margin.bottom;

  var x = d3.scale.linear()
    .domain(xDomain)
    .range([0, width]);

  var y = d3.scale.linear()
    .domain(yDomain)
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width);

  var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

  var svg = d3.select("#plot").append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  var plotPoints = function(data) {
    svg.selectAll(".dot").remove();
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", line.x())
      .attr("cy", line.y())
      .attr("r", 3.5);
  }

  var plotLine = function(data, klass) {
    svg.datum(data);
    svg.append("path")
      .attr("class", ["line", klass].join(" "))
      .attr("d", line);
  }

  var clearLines = function() {
    svg.selectAll("path.line").remove();
  }

  var plotFunction = function(f, klass) {
    var step = (xDomain[1] - xDomain[0]) / 100;
    var data = d3.range(xDomain[0],xDomain[1]+step,step).map(function(x) {
      return { x: x, y: f(x) };
    });
    plotLine(data, klass);
  }

  return { plotFunction: plotFunction, plotPoints: plotPoints, clearLines: clearLines };
}
