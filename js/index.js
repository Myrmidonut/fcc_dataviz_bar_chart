/*
data:
https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
[[date, value], ...]
*/

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(URL, (error, response) => {
  if (error) throw error;

  const data = response.data;

  const width = 1200;
  const height = 500;
  const padding = 70;

  const svg = d3.select("#graph")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  const xScale = d3.scaleTime()
                   .domain([ d3.min(data, e => new Date(e[0])), d3.max(data, e => new Date(e[0])) ])
                   .range([ padding, width - padding ]);

  const yScale = d3.scaleLinear()
                   .domain([ 0, d3.max(data, e => e[1]) ])
                   //.domain([ d3.min(data, (e) => e[1]), d3.max(data, (e) => e[1]) ])
                   .range([ height - padding, padding ]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisRight(yScale);

  const tooltip = d3.select("#graph")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", e => xScale(new Date(e[0])))
     .attr("y", e => yScale(e[1]))
     //.attr("width", 1 + width / data.length)
     .attr("width", 5)
     .attr("height", e => height - padding - yScale(e[1]))
     .attr("class", "bar")
     .attr("data-date", e => e[0])
     .attr("data-gdp", e => e[1])
     .on("mouseover", e => {
       tooltip.transition()
              .duration(200)
              .style("opacity", .9);
       tooltip.html("Date: " + e[0] + "<br>" + "GDP: " + e[1])
              .attr("data-date", e[0])
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 42 + "px");
     })
     .on("mouseout", e => {
       tooltip.transition()
              .duration(500)
              .style("opacity", 0);
     });

  svg.append("g")
     .attr("transform", "translate(2," + (height - padding) + ")")
     .attr("id", "x-axis")
     .style("font-size", 15)
     .call(xAxis);

  svg.append("g")
     .attr("transform", "translate(" + (width - padding + 3) + ", 0)")
     .attr("id", "y-axis")
     .style("font-size", 15)
     .call(yAxis);

  svg.append("text")
     .attr("x", 100)
     .attr("y", 100)
     .text("US GDP from 1947 to 2015 in billions of Dollars.")
     .style("font-family", "Lato")
     .style("font-size", "25")
     .attr("id", "title");
})