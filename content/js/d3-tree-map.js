const DATASET_URL = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

const model = ((treemapElem, legendElem) => {
	return {
		treemap: treemapElem,
		tooltip: d3.select("body")
			.append("div")
			.attr("id", "tooltip")
			.style("opacity", 0),
		treemapWidth: +treemapElem.attr("width"),
		treemapHeight: +treemapElem.attr("height"),
		
	};
})(d3.select("#treemap"), d3.select("#legend"));

const color_scale = d3.scaleOrdinal(d3.schemeSet3);
const opacity_scale = d3.scaleLinear()
		.domain([0.0, 100.0])
		.range([0.5, 2.0]);

const treemap = d3.treemap()
	.size([model.treemapWidth, model.treemapHeight])
	.paddingInner(3);

d3.json(DATASET_URL, (error, data) => {
	if (error) {
		throw error;
	}

	/*
		Modify the data, adding some fields to it.
		- depth: counts how many parents every node has.
		- height: counts how many levels of children every node has.
		- parent: the parent of the node or null for the root node.
		Source: https://dev.to/hajarnasr/treemaps-with-d3-js-55p7
	*/
	const layout = d3.hierarchy(data)
		.sum(d => d.value)
		.sort((a, b) => b.value - a.value); // descending order

	// Modifies layout!
	treemap(layout);
	
	// For each leaf in the modified data,
	// add a group
	const treemapSvg = model.treemap.selectAll("g")
		.data(layout.leaves())
		.enter()
		.append("g")
		.attr("transform", d => `translate(${d.x0}, ${d.y0})`);

	// For each group, add a rect
	treemapSvg.append("rect")
		.attr("class", "tile")
		.attr("width", d => d.x1 - d.x0)
		.attr("height", d => d.y1 - d.y0)
		.attr("fill", d => color_scale(d.data.category))
		.attr("opacity", d => opacity_scale(d.data.value))
		.attr("data-name", d => d.data.name)
		.attr("data-category", d => d.data.category)
		.attr("data-value", d => d.data.value)
		.on("mousemove", d => {
			const e = d.data;
			model.tooltip.style("opacity", 0.95);
			model.tooltip
			.html(`
			<ul style="text-align: left">
				<li>Name: <u>${e.name}</u></li>
				<li>Data: ${e.value}</li>
				<li>Platform: ${e.category}</li>
			</ul>
			`)
			.attr("data-value", e.value)
			.style("left", `${d3.event.pageX + 10}px`)
			.style("top", `${d3.event.pageY - 50}px`);
		})
		.on("mouseout", () => {model.tooltip.style("opacity", 0)});

	treemapSvg.append("text")
		.selectAll("tspan")
		.data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
		.enter()
		.append("tspan")
		.attr("x", 4)
		.attr("y", (d, i) => 13 + i * 10)
		.text(d => d)
		.style("cursor", "default");
	
	const categories = [... new Set(layout.leaves().map(d => d.data.category))];

	var x = 100;
	var y = 10;
	
	// add elements/transform
	var l = d3.select("#legend")
		.selectAll("g")
		.data(categories)
		.enter()
		.append("g")
		.attr("transform", (d, i) => {
			const t = `translate(${x}, ${y})`;
			x += 70;
			if (x >= 700) {
				x = 100;
				y += 50;
			}
			return t;
		});

	// style
	l.append("rect")
		.attr("class", "legend-item")
		.attr("width", 15)
		.attr("height", 15)
		.attr("fill", d => color_scale(d))
		.style("outline", "1px solid #777");
	
	// labels
	l.append("text")
		.attr("x", 20)
		.attr("y", 15)
		.text(d => d);
});
