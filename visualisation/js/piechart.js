d3.json("../data/genre_count.json").then(function (d) {
    const data = d
    const color_list = [
        '#0789F8',
        '#F9BA00',
        '#FE8C00',
        '#A6A8F8',
        '#47D7A8',
        '#3BCB60',
        '#1446A0',
        '#256D1B',
        '#CE6D8B',
        '#BA3F1D',
        '#393E41'
    ]
    for (const i in data) {
        // console.log(data[i])
        // console.log(i)
        data[i]['color'] = color_list[i];
    }
    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    };
// compute the width and height of the actual viz from the viewBox dimensions and considering the margins
// this to later work with width and height attributes directly through the width and height variables
    const width = 630 - (margin.left + margin.right);
    const height = 500 - (margin.top + margin.bottom);

// retrieve the svg in which to plot the viz
    const svg = d3.select('#piechart')
        .append("svg")
        .attr("id", "svg_pie")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

// const svg = d3
//     .select('svg');

// identify the dimensions of the viewBox to establish the svg canvas
// with the margin convention include a group element translated within the svg canvas

// compute the radius as half the minor size between the width and height
    const radius = Math.max(width, height) / 3.2;
// initialize a variable to have the multiple elements share the same stroke-width property
    const strokeWidth = 37;

    const group = svg
        .append('g')
        .attr('transform', `translate(${margin.left} ${margin.top})`);


// DEFAULT CIRCLE
// circle used as a background for the colored donut chart
// add a group to center the circle in the canvas (this to rotate the circle from the center)
    const groupDefault = group
        .append('g')
        .attr('transform', `translate(${width / 2} ${height / 2})`);

// append the circle showing only the stroke
    groupDefault
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'none')
        .attr('stroke', 'hsla(0, 0%, 0%, 0.08')
        .attr('stroke-width', strokeWidth + 2)
        .attr('stroke-linecap', 'round')
        // hide the stroke of the circle using the radius
        // this to compute the circumference of the shape
        .attr('stroke-dasharray', radius * 3.14 * 2)
        .attr('stroke-dashoffset', radius * 3.14 * 2);


// COLORED CIRCLES
// pie function to compute the arcs
    const pie = d3
        .pie()
        .sort(null)
        .padAngle(0.12)
        // use either the value or the percentage in the dataset
        .value(d => d.value);

// arc function to create the d attributes for the path elements
    const arc = d3
        .arc()
        // have the arc overlaid on top of the stroke of the circle
        .innerRadius(radius - 2)
        .outerRadius(radius + 2);

    /* for each data point include the following structure
    g             // wrapping all arcs
      g           // wrapping each arc
        arc       // actual shape
        line      // connecting line
        text      // text label
      g
        arc
        ...
    */
// wrapping group, horizontally centered
    const groupArcs = group
        .append('g')
        .attr('transform', `translate(${width / 2} ${height / 2})`);

    const groupsArcs = groupArcs
        .selectAll('g')
        .data(pie(data))
        .enter()
        .append('g');

// include the arcs specifying the stroke with the same width of the circle element
    groupsArcs
        .append('path')
        .attr('d', arc)
        .attr('fill', 'none')
        .attr('stroke', d => d.data.color)
        .attr('stroke-width', strokeWidth * 0.7)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        // hide the segments by applying a stroke-dasharray/stroke-dashoffset equal to the circle circumference
        // ! the length of the element varies, and it considered afterwords
        // for certain the paths are less than the circumference of the entire circle
        .attr('stroke-dasharray', radius * 3.14 * 2)
        .attr('stroke-dashoffset', radius * 3.14 * 2);

// include line elements visually connecting the text labels with the arcs
    groupsArcs
        .append('line')
        .attr('x1', 0)
        .attr('x2', (d) => {
            const [x] = arc.centroid(d);
            return x > 0 ? '35' : '-35'; //len of the line
        })
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', ({data: d}) => d.color)
        .attr('stroke-width', 2)
        .attr('transform', (d) => {
            const [x, y] = arc.centroid(d);
            const offset = x > 0 ? 20 : -20;
            return `translate(${x + offset} ${y})`;
        })
        .attr('stroke-dasharray', 35)
        .attr('stroke-dashoffset', 35);

// include text elements associated with the arcs
    groupsArcs
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-size', 21)
        .attr('text-anchor', (d) => {
            const [x] = arc.centroid(d);
            return x > 0 ? 'start' : 'end';
        })
        .attr('transform', (d) => {
            const [x, y] = arc.centroid(d);
            const offset = x > 0 ? 60 : -60;
            return `translate(${x + offset} ${y})`;
        })
        .html(({data: d}) => `
    <tspan x="0">${d.name}</tspan><tspan x="0" dy="14" font-size="11">${(d.percentage * 100).toFixed(2)}% / ${d.value}   </tspan>
  `)
        .style('opacity', 0)
        .style('visibility', 'hidden');


// TRANSITIONS
// once the elements are set up
// draw the stroke of the larger circle element
    groupDefault
        .select('circle')
        .transition()
        .ease(d3.easeExp)
        .delay(200)
        .duration(2000)
        .attr('stroke-dashoffset', '0')
        // once the transition is complete
        // draw the smaller strokes one after the other
        .on('end', () => {
            // immediately set the stroke-dasharray and stroke-dashoffset properties to match the length of the path elements
            // using vanilla JavaScript
            const paths = document.querySelectorAll('svg_pie g g path');
            paths.forEach((path) => {
                const length = path.getTotalLength();
                path.setAttribute('stroke-dasharray', length);
                path.setAttribute('stroke-dashoffset', length);
            });

            const duration = 750;
            // transition the path elements to stroke-dashoffset 0

            d3.selectAll('#svg_pie')
                .on("load", function () {
                    print("OUI");
                })

            d3.selectAll('#svg_pie g g path')
                .transition()
                .ease(d3.easeLinear)
                .delay((d, i) => i * duration)
                .duration(duration * 2.8)
                .attr('stroke-dashoffset', 0);

            // transition the line elements elements to stroke-dashoffset 0
            d3
                .selectAll('#svg_pie g g line')
                .transition()
                .ease(d3.easeLinear)
                .delay((d, i) => i * duration + duration / 2.5)
                .duration(duration / 2)
                .attr('stroke-dashoffset', 0);

            // transition the text elements to opacity 1 and visibility visible
            d3
                .selectAll('#svg_pie g g text')
                .transition()
                .ease(d3.easeLinear)
                .delay((d, i) => i * duration + duration / 2.3)
                .duration(duration / 2)
                .style('opacity', 1)
                .style('visibility', 'visible');

        });
});

function blablabla() {
    console.log("blablabla")
}