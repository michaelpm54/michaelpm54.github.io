const kSvgWidth = 1000;
const kSvgHeight = 600;
const kSvgPadding = 50;

function createSvg()
{  
  d3.select("#chart")
    .style("width", kSvgWidth+"px")
    .style("height", kSvgHeight+"px")
    .style("margin", "0 auto");
  
  const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("w", kSvgWidth)
    .attr("h", kSvgHeight)
    .style("width", `${kSvgWidth}px`)
    .style("height", `${kSvgHeight}px`);
  
  return svg;
}

function updateSvg(svg, data)
{  
  const yearFormat = "%Y";
  const timeFormat = "%M:%S";
  
  const xData = data.map(e => d3.timeParse(yearFormat)(e.Year));
  const yData = data.map(e => d3.timeParse(timeFormat)(e.Time));
  
  const xScale = d3.scaleTime()
    .domain(d3.extent(xData))
    .range([kSvgPadding, kSvgWidth - kSvgPadding]);
  
  const yScale = d3.scaleTime()
    .domain(d3.extent(yData).reverse())
    .range([kSvgHeight - kSvgPadding, kSvgPadding]);
  
  const xAxis = d3.axisBottom(xScale)
    .ticks(d3.timeYear.every(1));
  
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => d3.timeFormat(timeFormat)(d))
    .ticks(d3.timeSecond.every(10));
  
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${kSvgHeight - kSvgPadding})`)
    .call(xAxis);
  
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${kSvgPadding}, 0)`)
    .call(yAxis);
 
  var tooltip = d3.select("#tooltip");
 
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(xData[i]))
    .attr("cy", (d, i) => yScale(yData[i]))
    .attr("r", 5)
    .attr("class", (d, i) => d.Doping ? "dot doping" : "dot")
    .attr("data-xvalue", (d, i) => xData[i])
    .attr("data-yvalue", (d, i) => yData[i])
    .on("mouseover", (e, d) => {
      tooltip.html(`<span>Name: ${d.Name}<br>Time: ${d.Time}${d.Doping && "<br>" + d.Doping}</span>`);
      tooltip.attr("data-year", xData[data.indexOf(d)])
        .style("left", d3.pointer(e)[0]+"px")
        .style("top", d3.pointer(e)[1]+25+"px")
        .transition().duration(200)
        .style("opacity", 0.9);
    })
    .on("mouseout", (e, d) => {
      tooltip.style("opacity", 0.0);
  });
}

function fetchData(svg)
{
  return fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(response => response.json())
  .then(data => updateSvg(svg, data));
}

document.addEventListener('DOMContentLoaded', () => {
  const svg = createSvg();
  fetchData(svg);
});
