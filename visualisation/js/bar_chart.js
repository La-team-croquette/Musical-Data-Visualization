function create_barchart(list_files, id_chart, margin, width, height) {

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    const y = d3.scaleLinear()
        .range([height, 0]);

    const svg = d3.select(id_chart)
        .append("svg")
        .attr("id", "svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'hidden tooltip');

    let promises = []
    for (const filename of list_files) {
        promises.push(d3.json(filename))
    }

    Promise.all(promises).then(function (files) {
        let count_musics = [];
        for (let i = 0; i < list_files.length; ++i) {
            const name = list_files[i].split("/").at(-1).split(".")[0];
            count_musics.push({
                "name": name,
                "count": files[i].length,
                "i": i
            })
        }
        count_musics.sort((a, b) => b.count - a.count)

        x.domain(count_musics.map(d => d.name))
        y.domain([0, d3.max(count_musics, d => d.count)])

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        svg.append("g")
            .call(d3.axisLeft(y).ticks(6));

        colors = {
            "Tom": "#ff6f6f",
            "Marion": "#5effaa",
            "Victor": "#5e8fff"
        }

        svg.selectAll(".bar")
            .data(count_musics)
            .enter().append("rect")
            .style("fill", d => colors[d.name])
            .attr("class", "bar")
            .attr("x", d => x(d.name))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.count))
            .attr("height", d => height - y(d.count))
            .on('mousemove', function (e, d) {
                const mousePosition = [e.pageX, e.pageY];
                tooltip.classed('hidden', false)
                    .attr('style', 'left:' + (mousePosition[0] + 15) +
                        'px; top:' + (mousePosition[1] - 35) + 'px')

                    .html(d.name + ": " + d.count);
            })
            .on('mouseout', function () {
                tooltip.classed('hidden', true);
            });
    }).catch(function (err) {
    })
}

const margin = {top: 20, right: 20, bottom: 150, left: 50},
    width = 630 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
list_files = ["../data/Marion.json", "../data/Tom.json", "../data/Victor.json"]
create_barchart(list_files, '#chart_count', margin, width, height)