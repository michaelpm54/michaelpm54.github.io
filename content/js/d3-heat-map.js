const kSvgWidth = 1000;
const kSvgHeight = 600;
const kSvgPadding = 50;
const kSvgFontPadding = 80;
const kSvgLegendHeight = 100;
const kMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function createSvg()
{  
  d3.select("#chart")
    .style("width", kSvgWidth+"px")
    .style("height", kSvgHeight+kSvgLegendHeight+"px")
    .style("margin", "0 auto");
  
  const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("w", kSvgWidth)
    .attr("h", kSvgHeight+kSvgLegendHeight)
    .style("width", `${kSvgWidth}px`)
    .style("height", `${kSvgHeight+kSvgLegendHeight}px`);
  
  return svg;
}

function updateSvg(svg, data)
{  
  const svgMinX = kSvgPadding + kSvgFontPadding;
  const svgMinY = kSvgPadding + kSvgLegendHeight;
  const svgMaxX = kSvgWidth - kSvgPadding;
  const svgMaxY = kSvgHeight - kSvgPadding + kSvgLegendHeight;
  
  const years = [...new Set(data.monthlyVariance.map(d => d.year))];
  
  const xScale = d3.scaleBand()
    .domain(years)
    .range([svgMinX, svgMaxX]);  
  
  const xAxis = d3.axisBottom(xScale)
    .tickValues(years.filter(e => e % 10 === 0));
  
  const yScale = d3.scaleBand()
    .domain(kMonths)
    .range([svgMinY, svgMaxY]);
  
  const yAxis = d3.axisLeft(yScale);
  
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${kSvgHeight + kSvgPadding})`)
    .call(xAxis)
    .style("font-size", "9pt");;
  
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${kSvgPadding + kSvgFontPadding}, 0)`)
    .call(yAxis)
    .style("font-size", "16pt");
 
  var tooltip = d3.select("#tooltip");
  
  const variance = data.monthlyVariance.map(e => e.variance);
  
  const temperatures = variance.map(e => data.baseTemperature + e);
  
  const w = 200;
  
  const legendScale = d3.scaleLinear()
    .domain(d3.extent(variance))
    .range([0, w]);
  
  const varMin = d3.min(variance);
  const varMax = d3.max(variance);
  
  const colorScale = d3.scaleQuantize()
    .domain(d3.extent(variance))
    .range(d3.schemeSpectral[9].reverse());
  
  const diff = varMax - varMin;
  const step = diff / 5;
  
  const legendAxis = d3.axisBottom(legendScale)
    .tickFormat(d3.format('+.1f'))
    .tickValues(d3.range(
      varMin,
      varMax + step,
      step
    ));
  
  svg.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${kSvgPadding}, ${kSvgPadding+20})`)
    .call(legendAxis);
  
  var legend = d3.select("#legend");
  
  const bw = w / legendScale.ticks().length;
  
  d3.schemeSpectral[9].map((color, index) => {
    legend.append("rect")
      .attr("width", w / 9)
      .attr("height", 20)
      .attr("x", w / 9 * index)
      .attr("y", -20)
      .attr("fill", color);
  });
  
  svg.selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", d => d.month-1)
    .attr("data-year", d => d.year)
    .attr("data-temp", (d, i) => temperatures[i])
    .attr("x", (d, i) => xScale(d.year))
    .attr("y", (d, i) => yScale(kMonths[d.month-1]))
    .attr("width", (d, i) => xScale.bandwidth()+0.2)
    .attr("height", (d, i) => yScale.bandwidth()+0.5)
    .attr("fill", d => colorScale(d.variance))
    .on("mouseover", (e, d) => {
      tooltip.html(`<span>${d.variance}</span><br><span>${d.year}</span>`)
        .style("left", d3.pointer(e)[0]-50+"px")
        .style("top", d3.pointer(e)[1]+50+"px")
        .style("opacity", 0.9)
        .attr("data-year", d.year);
    })
    .on("mouseout", (e, d) => {
      tooltip.style("opacity", 0.0);
    });
}

function fetchData(svg)
{
  return fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(response => response.json())
  .then(data => updateSvg(svg, data));
}

document.addEventListener('DOMContentLoaded', () => {
  const svg = createSvg();
  fetchData(svg);
});
