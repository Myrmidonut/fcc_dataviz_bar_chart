 // data:
// https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
// [[date, value], ...]

/*
const dataset = d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(data) {
  console.log(data);
});
*/

var reqUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var req = new XMLHttpRequest();
req.open("GET", reqUrl, true);
req.responseType = "json";
req.send();
req.onload = function () {
   var data = req.response.data;

   var width = 1200;
   var height = 500;
   var padding = 70;

   var svg = d3.select("#graph").
   append("svg").
   attr("width", width).
   attr("height", height);

   var xScale = d3.scaleTime().
   domain([d3.min(data, function (e) {return new Date(e[0]);}), d3.max(data, function (e) {return new Date(e[0]);})]).
   range([padding, width - padding]);

   var yScale = d3.scaleLinear().
   domain([0, d3.max(data, function (e) {return e[1];})])
   //.domain([ d3.min(data, (e) => e[1]), d3.max(data, (e) => e[1]) ])
   .range([height - padding, padding]);

   var xAxis = d3.axisBottom(xScale);
   var yAxis = d3.axisRight(yScale);

   var tooltip = d3.select("#graph").
   append("div").
   attr("id", "tooltip").
   style("opacity", 0);

   svg.selectAll("rect").
   data(data).
   enter().
   append("rect").
   attr("x", function (e) {return xScale(new Date(e[0]));}).
   attr("y", function (e) {return yScale(e[1]);})
   //.attr("width", 1 + width / data.length)
   .attr("width", 5).
   attr("height", function (e) {return height - padding - yScale(e[1]);}).
   attr("class", "bar").
   attr("data-date", function (e) {return e[0];}).
   attr("data-gdp", function (e) {return e[1];}).

   on("mouseover", function (e) {
      tooltip.transition().
      duration(200).
      style("opacity", .9);
      tooltip.html("Date: " + e[0] + "<br>" + "GDP: " + e[1]).
      attr("data-date", e[0]).
      style("left", d3.event.pageX + "px").
      style("top", d3.event.pageY - 42 + "px");
   }).

   on("mouseout", function (e) {
      tooltip.transition().
      duration(500).
      style("opacity", 0);
   });

   svg.append("g").
   attr("transform", "translate(2," + (height - padding) + ")").
   attr("id", "x-axis").
   style("font-size", 15).
   call(xAxis);

   svg.append("g").
   attr("transform", "translate(" + (width - padding + 3) + ", 0)").
   attr("id", "y-axis").
   style("font-size", 15).
   call(yAxis);

   svg.append("text").
   attr("x", 100).
   attr("y", 100).
   text("US GDP from 1947 to 2015 in billions of Dollars.").
   style("font-family", "Lato").
   style("font-size", "25").
   attr("id", "title");
};