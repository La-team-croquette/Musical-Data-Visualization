d3.json("../data/formated_json.json").then(function (data) {
    document.getElementById("fact_nb_songs").innerText = data.length;
    let time_total = 0;
    data.forEach(d => time_total += d.msPlayed)
    document.getElementById("fact_time_total").innerText = Math.round(time_total / 3600000).toString();

    let artists = {}
    data.forEach(d => artists[d.artistName] = 1)
    document.getElementById("fact_nb_artists").innerText = Object.keys(artists).length.toString();

    d3.json("../jsonToNodesLinks/nodes_links.json").then(function (links_nodes) {
        document.getElementById("fact_nb_shared").innerText = links_nodes.nodes.length;
    });

});