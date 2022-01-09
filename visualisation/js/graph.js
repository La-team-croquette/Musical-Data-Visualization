function ForceGraph({
                        nodes, // an iterable of node objects (typically [{id}, …])
                        links // an iterable of link objects (typically [{source, target}, …])
                    }, {
                        nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
                        nodeGroup, // given d in nodes, returns an (ordinal) value for color
                        nodeGroups, // an array of ordinal values representing the node groups
                        nodeTitle, // given d in nodes, a title string
                        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
                        nodeStroke = "#fff", // node stroke color
                        nodeStrokeWidth = 1.5, // node stroke width, in pixels
                        nodeStrokeOpacity = 1, // node stroke opacity
                        nodeRadius = d => d.size, // node radius, in pixels
                        nodeStrength = d => d.force,
                        linkSource = ({source}) => source, // given d in links, returns a node identifier string
                        linkTarget = ({target}) => target, // given d in links, returns a node identifier string
                        linkStroke = "#999", // link stroke color
                        linkStrokeOpacity = 0.6, // link stroke opacity
                        linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
                        linkStrokeLinecap = "round", // link stroke linecap
                        linkStrength = 0.05,
                        width = 640, // outer width, in pixels
                        height = 400, // outer height, in pixels
                    } = {}) {
    // Compute values.
    const userRadius = 30;

    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, d => d.type === "music" ? d.id + '\n' + Math.round(d.msTotal / 6000) + "m d'écoute\n" + d3.sort(d.genres) : d.id);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);

    // Replace the input nodes and links with mutable objects for the simulation.
    // nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
    // links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);
    // Construct the scales.

    G.splice(0, 3)
    G.sort()

    let genres = G
    genres = genres.filter((v, i, s) => s.indexOf(v) === i);
    genres.sort()
    let c = [];
    for (let i = 0; i < 1; i += 1. / genres.length) {
        c.push(d3.interpolateRainbow(i));
    }
    // let c = d3.schemeBlues[3];
    // Array.prototype.push.apply(c, d3.schemeGreens[3])
    // Array.prototype.push.apply(c, d3.schemeOranges[3])
    // Array.prototype.push.apply(c, d3.schemePurples[3])
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, c);

    let sizeScale = d3.scaleLinear()
        .domain([d3.min(nodes, n => n.msTotal), d3.max(nodes, n => n.msTotal)])
        .range([4, 20])

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(d => d.type === "music" ? -sizeScale(d.msTotal) : -500);
    if (linkStrength !== undefined) forceLink.strength(d => 0.05);

    const simulation = d3.forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter())
        .on("tick", ticked);


    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const link = svg.append("g")
        .attr("stroke", linkStroke)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");

    const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation));

    const node_music = node.filter(d => d.type === "music")
        .append("circle")
        .attr("r", d => sizeScale(d.msTotal))
        .attr("fill", d => color(d.genres.join(", ")))
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)

    const node_user = node.filter(d => d.type === "user")
        .append("image")
        .attr("xlink:href", d => "img/team/" + d.id + ".png")
        .attr("width", 2 * userRadius + 2)
        .attr("height", 2 * userRadius + 2)

    if (T) node.append("title").text(({index: i}) => T[i]);


    const legend = d3.select("#svg_legend")
        .attr("height", "400px")

    legend.selectAll("mydots")
        .data(genres)
        .enter()
        .append("circle")
        .attr("cx", 10)
        .attr("cy", (d, i) => 10 + i * 25)
        .attr("r", 7)
        .style("fill", d => color(d))
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth / 1.5)

    legend.selectAll("mylabels")
        .data(genres)
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", (d, i) => 15 + i * 25)
        .style("fill", d => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    //
    const legend2 = d3.select("#svg_legend2")

    legend2.append("circle")
        .attr("cx", 20)
        .attr("cy", 25)
        .attr("r", sizeScale(d3.max(nodes, n => n.msTotal)))
        .attr("fill", "white");
    legend2.append("text")
        .attr("x", 50)
        .attr("y", 30)
        .text(Math.round((d3.max(nodes, n => n.msTotal) / 6000) || 0) + " Minutes d'écoute")
        .attr("fill", "white")
        .attr("text-anchor", "left");

    legend2.append("circle")
        .attr("cx", 20)
        .attr("cy", 75)
        .attr("r", sizeScale(d3.min(nodes, n => n.msTotal)))
        .attr("fill", "white");
    legend2.append("text")
        .attr("x", 50)
        .attr("y", 80)
        .text(Number.parseFloat((d3.min(nodes, n => n.msTotal) / 6000) || 0).toPrecision(2) +
            " Minutes d'écoute")
        .attr("fill", "white")
        .attr("text-anchor", "left")


    // .attr("height", "400px")


    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    let refs = {
        "Tom": [0, -200],
        "Marion": [-300, 200],
        "Victor": [300, 200],
    }

    function ticked() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cy", function (d) {
            if (d.type === "user" && d.oncey !== "1") {
                d.oncey = "1";
                d.y = refs[d.id][1];
                return refs[d.id][1];
            } else {
                return d.y;
            }
        })
            .attr("cx", function (d) {
                if (d.type === "user" && d.oncex !== "1") {
                    d.oncex = "1";
                    d.x = refs[d.id][0];
                    return refs[d.id][0];
                } else {
                    return d.x;
                }
            });

        node_music.attr("cx", d => d.x)
            .attr("cy", d => d.y)
        node_user.attr("x", d => d.x - userRadius)
            .attr("y", d => d.y - userRadius)
    }

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    return Object.assign(svg.node(), {scales: {color}});
}
function drawGraph() {
    d3.json("../jsonToNodesLinks/nodes_links.json").then(function (nodes_links) {
        //console.log("Je suis ici")
        console.log('Dans Graphe.js')
        console.log(CURRENT_DATA)

        //let test = filterMusicStyle(CURRENT_DATA, stylesToFilter)
        //console.log(test)

        d3.select("#svg_legend").selectAll("circle").remove();
        d3.select("#svg_legend").selectAll("text").remove();
        d3.select("#svg_legend2").selectAll("circle").remove();
        d3.select("#svg_legend2").selectAll("text").remove();
        const margin = {top: 0, right: 0, bottom: 30, left: 0};
        const chart = ForceGraph(CURRENT_DATA, {
            nodeId: d => d.id,
            nodeGroup: d => d.type === "music" ? d3.sort(d.genres).join(", ") : "user",
            linkStrokeWidth: l => Math.sqrt(l.value),
            width: parseInt(d3.select('#graph').style('width'), 10),
            height: window.innerHeight * .8,
            // invalidation // a promise to stop the simulation when the cell is re-run
        })

        d3.select("#graph").selectAll("svg > *").remove();

        d3.select("#graph")
            .append("svg")
            .attr("width", "100%")
            .attr("height", window.innerHeight * .8)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var svg = document.getElementsByTagName('svg')[2]; //Get svg element
        svg.appendChild(chart);

    })
}
