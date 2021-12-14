const MIN_DATE = "2019-12-18 15:53"
const MAX_DATE = "2020-12-18 15:53"

let TABLE_DATA_JOUR = [];
let TABLE_JOUR = [];

d3.json("/data/Marion.json").then(json => {
    console.log(json[0]['endTime']);
    console.log(json.length);
    let date_current = Date.parse(json[0]['endTime']);
    let jourcurrent = new Date(date_current).getDate();
    let moiscurrent = new Date(date_current).getMonth() +1;
    let anneecurrent = new Date(date_current).getFullYear();
    let table = [];
    let date_string = jourcurrent.toString() + "/" + moiscurrent.toString() + "/" + anneecurrent.toString();
    console.log(date_string)
    TABLE_JOUR.push(date_string)
    for (var i = 0; i < json.length; i++) {
        let date_new = Date.parse(json[i]['endTime']);
        let journew = new Date(date_new).getDate();
        if (jourcurrent === journew) {
            table.push(json[i])
        }
        else {
            date_current = Date.parse(json[i]['endTime']);
            TABLE_DATA_JOUR.push(table);
            table = [];
            jourcurrent = new Date(date_current).getDate();
            moiscurrent = new Date(date_current).getMonth() +1 ;
            anneecurrent = new Date(date_current).getFullYear();
            date_string = jourcurrent.toString() + "/" + moiscurrent.toString() + "/" + anneecurrent.toString();
            TABLE_JOUR.push(date_string);
        }
    }
    console.log(TABLE_JOUR);
    console.log(TABLE_DATA_JOUR);

    d3.select('#slider').on("input", e=> {
        var val =document.getElementById('slider').value;
        document.getElementById('day').innerHTML = MAX_DATE;
    })
});




