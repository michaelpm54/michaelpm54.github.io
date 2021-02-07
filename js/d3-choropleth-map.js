const w = 1000;
const h = 630;

const title = d3.select("body")
  .append("h1")
  .attr("id", "title")
  .text("US Education Data Per County");

const description = d3.select("body")
  .append("h2")
  .attr("id", "description")
  .text("Percentage of people with bachelors or higher");

const svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

const educationJson = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const countiesJson = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

d3.queue()
  .defer(d3.json, educationJson)
  .defer(d3.json, countiesJson)
  .await((err, data, geom) => {
    if (err) {
      d3.select("body")
        .style("background-color", "IndianRed");
      title.text("Failed to retrieve JSON data");
      description.text("");
      return;
    }
  
  const path = d3.geoPath();
  const bach = data.map(d => d.bachelorsOrHigher);
  const bMin = d3.min(bach);
  const bMax = d3.max(bach);
  const spread = 9;
  const range = (bMax - bMin) / spread;
  
  const colorScale = d3
    .scaleThreshold()
    .domain(d3.range(bMin, bMax, spread))
    .range(d3.schemeYlOrBr[9]);
  
  const legendWidth = 300;
  const legendHeight = 25;
  const legendMin = w - legendWidth;
  const legendMax = legendMin + legendWidth;
  
  const legendScale = d3
    .scaleLinear()
    .domain([bMin, bMax])
    .rangeRound([legendMin, legendMax]);
  
  const legendAxis = d3.axisBottom()
    .scale(legendScale)
    .tickValues(colorScale.domain())
    .tickFormat(n => Math.round(n) + "%");

  const legend = svg.append("g")
    .call(legendAxis)
    .attr("id", "legend")
    .attr("transform", "translate(-50,18)");

  legend.selectAll("rect")
    .data(
      // For each point in the colour range,
      // get the corresponding domain point.
      // Make sure any null values are clamped.
      colorScale.range().map(d => {
        d = colorScale.invertExtent(d);
        d[0] = (d[0] === null) ? legendScale.domain()[0] : d[0];
        d[1] = (d[1] === null) ? legendScale.domain()[1] : d[1];
        return d;
      })
    )
    .enter()
    .append("rect")
    .attr("height", 18)
    .attr("x", d => legendScale(d[0]))
    .attr("width", d => legendScale(d[1]) - legendScale(d[0]))
    .attr("fill", d => colorScale(d[0]))
    .attr("y", "-18");
 
  /* D3 uses GeoJSON to render geographical data.
     The data set we are given is in TopoJSON format.
     We need to use TopoJSON to convert it.
     In this case, it converts a GeometryCollection to a FeatureCollection. 
     
     We pass this FeatureCollection to d3.geoPath, which is stated in the
     docs as 'geographic path generators (functions that convert GeoJSON shapes into SVG or Canvas paths)'.
     
     d3.geoJson is set as the generator to use by setting the "d" attribute.
     */
  
  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(geom, geom.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("fill", (d) => {
      const result = data.filter(e => e.fips === d.id);
      return result[0] ? colorScale(result[0].bachelorsOrHigher) : "black";
    })
    .attr("data-fips", d => data.filter(e => e.fips === d.id)[0].fips)
    .attr("data-education", d => data.filter(e => e.fips === d.id)[0].bachelorsOrHigher)
    .on("mouseover", (d) => {
      const b = data.filter(e => e.fips === d.id)[0].bachelorsOrHigher;
      d3.select("#tooltip")
        .style("left", d3.event.pageX-70+"px")
        .style("top", d3.event.pageY+50+"px")
        .style("opacity", 0.93)
        .html(`<span>Population with bachelors: ${b}%</span>`)
        .attr("data-education", b);
    })
    .on("mouseout", () => d3.select("#tooltip").style("opacity", 0.0));
});
