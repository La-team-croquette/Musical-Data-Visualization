function create_barchart2(filename, id_chart, margin, width, height) {

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

    d3.json(filename).then(function (data) {
        let time_by_artist = {}

        data.forEach(function (d) {
            if (!time_by_artist.hasOwnProperty(d.artistName)) {
                time_by_artist[d.artistName] = 0;
            }
            time_by_artist[d.artistName] += d.msPlayed;
        });

        function draw_(nb_elements) {
            let time_by_artist_json = []
            Object.keys(time_by_artist).forEach(function (d) {
                time_by_artist_json.push({"artistName": d, "msTotal": time_by_artist[d]})
            });
            time_by_artist_json.sort((a, b) => a.msTotal < b.msTotal)

            time_by_artist_json.splice(nb_elements, time_by_artist_json.length - 1);


            x.domain(time_by_artist_json.map(d => d.artistName));
            y.domain([0, d3.max(time_by_artist_json, d => d.msTotal / 3600000)]);
            const max_x = d3.max(time_by_artist_json, d => d.msTotal / 3600000);

            if (nb_elements <= 55) {
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).tickSize(0))
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");

            }

            svg.append("g")
                .call(d3.axisLeft(y).ticks(6));

            svg.selectAll(".bar")
                .data(time_by_artist_json)
                .enter().append("rect")
                .style("fill", d => d3.interpolateTurbo((d.msTotal / 3600000) / max_x))
                .attr("class", "bar")
                .attr("x", d => x(d.artistName))
                .attr("width", x.bandwidth())
                .attr("y", d => y(d.msTotal / 3600000))
                .attr("height", d => height - y(d.msTotal / 3600000))
                .on('mousemove', function (e, d) {
                    const mousePosition = [e.pageX, e.pageY];
                    tooltip.classed('hidden', false)
                        .attr('style', 'left:' + (mousePosition[0] + 15) +
                            'px; top:' + (mousePosition[1] - 35) + 'px')

                        .html(d.artistName + ": " + (d.msTotal / 3600000).toFixed(1) + " heures d'écoute");
                })
                .on('mouseout', function () {
                    tooltip.classed('hidden', true);
                });
        }


        d3.select("#top_artist").on("input", function () {
            // console.log(+this.value);
            d3.select(id_chart).selectAll("rect").remove();
            d3.select(id_chart).selectAll("text").remove();
            draw_(+this.value)
        });

        draw_(50);

    }).catch(function (err) {
    })

}

const margin2 = {top: 20, right: 20, bottom: 150, left: 50},
    width2 = 630 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;
create_barchart2("../data/formated_json.json", '#chart_artist', margin2, width2, height2)