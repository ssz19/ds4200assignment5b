//variables
var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 1300 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
.rangeRoundBands([0, width - 150], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
.range([height, 0]);

var color = d3.scale.ordinal()
.range(["#F79620", "#F5C918", "#FF6600", "#707FBE", "#3669B3", "#009ACC", "#008C8C", "#3EBCA2","#2DB45F"]);

var xAxis = d3.svg.axis()
.scale(x0)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickFormat(d3.format(".2s"));

var svg2 = d3.select("#table5").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//read in the csv file for data from table 5
d3.csv("data_table5.csv", function(error, data) {
if (error) throw error;


var epiNames = d3.keys(data[0]).filter(function(key) { 		     return key !== "Land"; });

data.forEach(function(d) {
d.epi = epiNames.map(function(name) { return {name: name, value: +d[name]}; });
});

x0.domain(data.map(function(d) { return d.Land; }));
x1.domain(epiNames).rangeRoundBands([0, x0.rangeBand()]);
y.domain([0, d3.max(data, function(d) { return d3.max(d.epi, function(d) { return d.value; }); })]);

svg2.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg2.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 5)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Annual Value ($) of Ecosystem Service");

var land = svg2.selectAll(".land")
  .data(data)
.enter().append("g")
  .attr("class", "land")
  .attr("transform", function(d) { return "translate(" + x0(d.Land) + ",0)"; });

land.selectAll("rect")
  .data(function(d) { return d.epi; })
.enter().append("rect").attr("width", x1.rangeBand())
  .attr("x", function(d) { return x1(d.name); })
  .attr("y", function(d) { return y(d.value); })
  .attr("height", function(d) { return height - y(d.value); })
.on("mouseover", function(d, i) {
        div.style("left", d3.event.pageX+10+"px");
        div.style("top", d3.event.pageY-25+"px");
        div.style("display", "inline-block");
        div.html((d.Land)+"<br> "+(d.CurrentContry*100)+"%");
      })
  .style("fill", function(d) { return color(d.name); });

//create the legend for the graph
var legend = svg2.selectAll(".legend")
  .data(epiNames.slice())
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", color);

legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d; });
});