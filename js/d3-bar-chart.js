const kSvgWidth = 1000;
const kSvgHeight = 400;
const kSvgPadding = 50;

function createSvg()
{  
  const svg = d3.select("#chartSvg")
    .append("svg")
    .attr("w", kSvgWidth)
    .attr("h", kSvgHeight)
    .style("width", `${kSvgWidth}px`)
    .style("height", `${kSvgHeight}px`)
    .style("border", "1px solid blue");
  
  return svg;
}

function updateSvg(svg, data)
{  
  document.getElementById("title").textContent = data.name;
  document.getElementById("description").textContent = data.description;
  
  const xData = data.data.map(e => new Date(e[0]));
  const yData = data.data.map(e => e[1]);
  
  var xMax = d3.max(xData);
  xMax.setMonth(12);
  
  const xScale = d3.scaleTime()
    .domain([d3.min(xData), d3.max(xData)])
    .range([kSvgPadding, kSvgWidth - kSvgPadding]);
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(yData)])
    .range([kSvgHeight - kSvgPadding, kSvgPadding]);
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  const barWidth = kSvgWidth / data.data.length;
  
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${kSvgHeight - kSvgPadding})`)
    .call(xAxis);
  
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${kSvgPadding}, 0)`)
    .call(yAxis);
  
  var tooltip = d3.select("#tooltip");
  
  svg
    .selectAll("rect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(new Date(data.data[i][0])))
    .attr("y", (d, i) => yScale(data.data[i][1]))
    .attr("width", barWidth)
    .attr("height", (d, i) => kSvgHeight - kSvgPadding - yScale(data.data[i][1]))
    .attr("fill", (d, i) => `rgb(${255-i}, 0, 0)`)
    .attr('data-date', (d, i) => data.data[i][0])
    .attr('data-gdp', (d, i) => data.data[i][1])
    .on("mouseover", function(e, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
    
        tooltip.html(`<span>$${d[1]} billion</span><br/><span>${d[0]}</span>`);
        tooltip.attr("data-date", d[0]);
    })
    .on("mouseout", function(e, d) {
      tooltip.transition()
        .duration(100)
        .style('opacity', 0.0);
    });
}

function fetchData(svg)
{
  return fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(response => response.json())
  .then(data => updateSvg(svg, data));
}

document.addEventListener('DOMContentLoaded', () => {
  const svg = createSvg();
  fetchData(svg);
});
