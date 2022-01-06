const MIN_DATE = "2019-12-18 15:53"
const MAX_DATE = "2020-12-18 15:53"

let TABLE_DATA_JOUR = [];
let TABLE_JOUR = [];
let TABLE_JOUR_VAL = [];
let TABLE_JOUR2 = []
let TABLE_TIME = [];
let TABLE_TIME2 = [];
let TABLE_MOIS = [];
let TABLE_DATA_MOIS = [];
let TABLE_TIME_MOIS = [];

d3.json("../data/Tom.json").then(json => {
    //On définit comme date courrante la plus petite date du JSON
    let date_current = Date.parse(json[0]['endTime']);
    let jourcurrent = new Date(date_current).getDate();

    //On initialise des tables vides pour établir les tables des données
    let table = [];
    let table_mois = [];
    //On ajoute la premiere date
    let date_string = toString(date_current);
    console.log(date_string);
    TABLE_JOUR.push(date_string);
    TABLE_JOUR_VAL.push(new Date(date_current));

    let dernier_jour = Date.parse(json[json.length - 1]['endTime']);
    TABLE_JOUR2 = getDates(date_current, dernier_jour);
    let time_tot = 0;
    let time_mois = 0;
    for (var i = 0; i < json.length; i++) {
        let date_new = Date.parse(json[i]['endTime']);
        let journew = new Date(date_new).getDate();

        if (jourcurrent === journew) {
            table.push(json[i])
            time_tot += json[i]['msPlayed']
        } else {
            date_current = Date.parse(json[i]['endTime']);
            TABLE_DATA_JOUR.push(table);
            table = [];
            jourcurrent = new Date(date_current).getDate();
            date_string = toString(date_current);
            TABLE_JOUR.push(date_string);
            TABLE_JOUR_VAL.push(date_current);
            TABLE_TIME.push(time_tot);

            time_tot = json[i]['msPlayed'];
        }
    }
    let indexe_vrais = 0;
    for (let i = 0; i < TABLE_JOUR2.length; i++) {
        if (toString(TABLE_JOUR_VAL[indexe_vrais]) == toString(TABLE_JOUR2[i])) {
            TABLE_TIME2[i] = TABLE_TIME[indexe_vrais];
            indexe_vrais++;
        } else {
            TABLE_TIME2[i] = 0;
        }
    }


    // console.log(TABLE_JOUR);
    // console.log(TABLE_DATA_JOUR);
    let input = document.getElementById('slider');
    // console.log(TABLE_JOUR.length)
    console.log(TABLE_TIME)
    input.setAttribute("max", TABLE_JOUR.length - 1)
    document.getElementById('day').innerHTML = TABLE_JOUR[0];

    let max = 0
    for (var i = 0; i < TABLE_TIME.length; i++) {
        if (max < TABLE_TIME[i]) {
            max = TABLE_TIME[i]
        }
    }
    let table_test = []
    console.log(max)
    for (var i = 0; i < TABLE_TIME2.length; i++) {
        table_test.push(TABLE_TIME2[i] / max * 20)
    }
    console.log(table_test.length)

    creatchartbar(table_test);
    d3.select('#slider').on("input", e => {
        var val = document.getElementById('slider').value;
        console.log(val)
        document.getElementById('day').innerHTML = TABLE_JOUR[val];
    })
    d3.select('#number1').on("input", e => {
        console.log("happy")

    })
});

// Dropdown response
document.getElementById("number2").onclick = function () {
    //change first name
    document.getElementById("dropdownMenuButton1").textContent = "Par semaine"
}
document.getElementById("number1").onclick = function () {
    //change first name
    document.getElementById("dropdownMenuButton1").textContent = "Par jour"
}
document.getElementById("number3").onclick = function () {
    //change first name
    document.getElementById("dropdownMenuButton1").textContent = "Par mois"
}
document.getElementById("number4").onclick = function () {
    //change first name
    document.getElementById("dropdownMenuButton1").textContent = "Par année"
}


function getDates(startDate, stopDate) {
    let dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate))
        currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
    return dateArray;
}

function toString(date) {
    let jour = new Date(date).getDate();
    let mois = new Date(date).getMonth() + 1;
    let annee = new Date(date).getFullYear();
    return jour.toString() + "/" + mois.toString() + "/" + annee.toString();
}

function creatchartbar(table_test, width, height) {
    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    let w = table_test.length * 10;
    let h = 100;
    let size = table_test.length
    let svg = d3.select("#bargraph_time")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
    svg.selectAll("rect")
        .data(table_test)
        .enter()
        .append("rect")
        .attr("x", (d, i) => w / size + i * 3)
        .attr("y", (d, i) => h - 3 * d)
        .attr("width", (d, i) => w / size)
        .attr("height", (d, i) => d * 3)
        .attr("fill", "navy")
        .attr("class", "bar")
}