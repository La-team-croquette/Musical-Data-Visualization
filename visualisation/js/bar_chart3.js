function create_barchart3(filename, id_chart, margin, width, height, who) {

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
        const first_date = "2020-11-23",
            last_date = "2021-11-24";
        var getDaysArray = function (s, e) {
            for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
                a.push(new Date(d).toISOString().split('T')[0]);
            }
            return a;
        };
        let time_by_date = {
            "Tom": {},
            "Marion": {},
            "Victor": {}
        }
        let daylist = getDaysArray(new Date(first_date), new Date(last_date));
        Object.keys(time_by_date).forEach(function (name) {
            daylist.forEach(function (d) {
                time_by_date[name][d] = 0;
            })
        });
        data.forEach(function (d) {
            time_by_date[d.listener][d.endTime.split(' ')[0]] += d.msPlayed;
        });

        let user_time = []
        Object.keys(time_by_date[who]).forEach(function (d) {
            user_time.push({
                "date": d,
                "msTotal": time_by_date[who][d]
            });
        });

        x.domain(user_time.map(d => d.date));
        y.domain([0, d3.max(user_time, d => d.msTotal / 3600000)]);
        const max_x = d3.max(user_time, d => d.msTotal / 3600000);

        svg.append("g")
            .call(d3.axisLeft(y).ticks(6));

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        svg.selectAll(".bar")
            .data(user_time)
            .enter().append("rect")
            .style("fill", d => d3.interpolateTurbo((d.msTotal / 3600000) / max_x))
            .attr("class", "bar")
            .attr("x", d => x(d.date))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.msTotal / 3600000))
            .attr("height", d => height - y(d.msTotal / 3600000))
            .on('mousemove', function (e, d) {
                const mousePosition = [e.pageX, e.pageY];
                tooltip.classed('hidden', false)
                    .attr('style', 'left:' + (mousePosition[0] + 15) +
                        'px; top:' + (mousePosition[1] - 35) + 'px')
                    .html(d.date + ": " + (d.msTotal / 3600000).toFixed(1) + " Heures d'écoute");
            })
            .on('mouseout', function () {
                tooltip.classed('hidden', true);
            });

    }).catch(function (err) {
    })

}

const margin3 = {top: 20, right: 20, bottom: 50, left: 50},
    width3 = 1800 - margin3.left - margin3.right,
    height3 = 400 - margin3.top - margin3.bottom;
create_barchart3("../data/formated_json.json", '#chart_tom', margin3, width3, height3, "Tom")
create_barchart3("../data/formated_json.json", '#chart_marion', margin3, width3, height3, "Marion")
create_barchart3("../data/formated_json.json", '#chart_victor', margin3, width3, height3, "Victor")