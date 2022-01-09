let ANNEE = [];
let SEMAINES = [];
let MOIS = [];
let PERSONNE = [];
let ALL_DATAS;
let CURRENT_DATA;
// O correspond à toutes les données
// 1 aux semaines
// 2 aux mois
// 3 aux années
let TYPE_JOUR = 0;

let nb_de_semaines_en_tout = 54;
let nb_de_mois_en_tout = 13;
let nb_d_annee_en_tout = 2;

let premiere_date = new Date(Date.parse("2020-11-23 15:58"))

let premiere_semaine=calculate_number_week(premiere_date)
let premier_mois = calculate_number_month(premiere_date)
let premiere_annee = calculate_number_year(premiere_date)

// On recupere l'element slider
let slider = document.getElementById('slider')

// On créer les tableau aux bonnes dimensions
for (var i = 0;i<nb_de_semaines_en_tout;i++){
    var date_tour = new Date(premiere_date.getTime() + 7*24*60*60*1000*i)
    SEMAINES.push([calcule_semaine(date_tour),[]]);
}

for (var i = 0;i<nb_de_mois_en_tout;i++){
    premiere_date_1 = new Date(premiere_date)
    premiere_date_1.setDate(5)
    var date_tour = new Date( premiere_date_1.getTime()+ 31*24*60*60*1000*i)
    var moi_actuel =date_tour.getMonth() +1
    MOIS.push([moi_actuel+ "/" + date_tour.getFullYear(),[]]);
}
for (var i = 0;i<nb_d_annee_en_tout;i++){
    var annee_nb = premiere_date.getFullYear() + i
    ANNEE.push(["" + annee_nb,[]]);
}



// On instancie les différents tableaux en fonction des mois semaine et année
d3.json("../jsonToNodesLinks/nodes_links.json").then(function (json)  {
    console.log('Dans Slider.js')

    filtre(json);
    ALL_DATAS = json;
    CURRENT_DATA = json;
    console.log(json['links'])
    console.log(CURRENT_DATA);
    console.log(ALL_DATAS['links']);


    //On instancie le sliders avec les donnees de tous les jours
    slider.style.display = 'none'
    slider.setAttribute("max", 0);
    document.getElementById('day').innerHTML = "Du 23/11/2021 au 24/11/2021";
    drawGraph()
});

d3.select('#slider').on('input', e => sliderEvent());

function sliderEvent(){

        var val = document.getElementById('slider').value;
        //console.log(val)
        if (TYPE_JOUR === 0) {
            CURRENT_DATA = mise_en_forme(tri_time(0,val));
            drawGraph()
        }
        if (TYPE_JOUR === 1) {
            document.getElementById('day').innerHTML = SEMAINES[val][0];
            CURRENT_DATA = mise_en_forme(tri_time(1,val));
            drawGraph();
        }
        if (TYPE_JOUR === 2) {
            document.getElementById('day').innerHTML = MOIS[val][0];
            CURRENT_DATA = mise_en_forme(tri_time(2,val));
            drawGraph();
        }
        if (TYPE_JOUR === 3) {
            document.getElementById('day').innerHTML = ANNEE[val][0];
            CURRENT_DATA = mise_en_forme(tri_time(3,val));
            //console.log(CURRENT_DATA)
            drawGraph()}

}

document.getElementById("number2").onclick = function () {
    //change first name
    document.getElementById("dropdownMenuButton1").textContent = "Par semaine"
    CURRENT_DATA = mise_en_forme(tri_time(1,0))
    slider.setAttribute("max", SEMAINES.length -1);
    document.getElementById('day').innerHTML = SEMAINES[0][0];
    document.getElementById('slider').value = 0;
    TYPE_JOUR = 1;
    slider.style.display = '';
    //console.log(CURRENT_DATA)
    drawGraph()
}
document.getElementById("number1").onclick = function () {
    //change first name
    document.getElementById("dropdownMenuButton1").textContent = "Toutes les données"
    CURRENT_DATA = mise_en_forme(tri_time(0,0))
    slider.setAttribute("max", 0);
    document.getElementById('day').innerHTML = "Du 23/11/2021 au 24/11/2021";
    TYPE_JOUR =0;
    slider.style.display = 'none'
    //console.log(CURRENT_DATA)
    document.getElementById('slider').value = 0;
    drawGraph()
}
document.getElementById("number3").onclick = function () {
    //change first name
    document.getElementById("dropdownMenuButton1").textContent = "Par mois"
    CURRENT_DATA = mise_en_forme(tri_time(2,0))
    slider.setAttribute("max", MOIS.length -1);
    document.getElementById('day').innerHTML = MOIS[0][0];
    //console.log(CURRENT_DATA)
    TYPE_JOUR =2;
    slider.style.display = '';
    document.getElementById('slider').value = 0;
    drawGraph()
}
document.getElementById("number4").onclick = function () {
    //change first name
    document.getElementById("dropdownMenuButton1").textContent = "Par année"
    CURRENT_DATA = mise_en_forme(tri_time(3,0))
    //console.log(CURRENT_DATA)
    slider.setAttribute("max", ANNEE.length -1);
    document.getElementById('day').innerHTML = ANNEE[0][0];
    TYPE_JOUR =3;
    slider.style.display = '';
    document.getElementById('slider').value = 0;
    drawGraph()
}



function eventslider () {
    var val = document.getElementById('slider').value;
    //console.log(val)
    if (TYPE_JOUR === 1) {
        document.getElementById('day').innerHTML = "";
    }
}

function tri_time (tempo, time) {
    //On ne touche pas les liens et on ajoute un tableau vide pour les noeuds
    //On filtre les noeuds en fonction de la date
    //Si tempo est égal à 0, on retourne l'ensemble des noeuds
    if (tempo === 0) {
        let resultat = ANNEE[0][1].concat(ANNEE[1][1])
        return resultat;
    }
    //Si tempo est égal à 1 on filtre sur les semaines
    else if (tempo === 1) {
        //console.log(SEMAINES[time][1])
        return SEMAINES[time][1];
    }
    //Si tempo est égal à 2 on filtre les mois
    else if (tempo === 2) {
        return MOIS[time][1];
    }
    //Si tempo est égal à 3 on filtre les années
    else if (tempo === 3) {
        return ANNEE[time][1];
    }
}

function mise_en_forme (musics) {

    musics = musics.filter(music => stylesToFilter.some(val => music.genres.includes(val)))

    let nodes = PERSONNE.concat(musics);
    //console.log(PERSONNE)
    console.log(ALL_DATAS['links'])
    //console.log(nodes)
    //console.log(nodes[4])
    filteredLink = ALL_DATAS['links'].filter(link => musics.some(val =>  link['target']['id']=== val.id))
    console.log("FILTER")
    console.log(filteredLink)
    return {'links': filteredLink, 'nodes': nodes}
}

/*
Cette fonction retourne un objet contenant tous les noeuds filtrer sous forme de tableau
 */
function filtre (objet) {
    let nodes = objet['nodes'];
    let resultat = []
    //On parcours les différents noeuds s'il s'agit de musique
    for (var i = 0; i < nodes.length; i++) {
        //Pour chaque noeud on récupère les endTime
        if (nodes[i]['type'] === "music") {
            let endTimes = nodes[i]['endTimes'];
            let isIn_semaine = [false, []];
            let isIn_mois = [false, []];
            let isIn_annee = [false, []];
            if (Object.keys(endTimes).length === 3) {
                isIn_semaine = corespondance_semaine_a_3(endTimes['Victor'], endTimes['Tom'], endTimes['Marion']);
                isIn_mois = corespondance_mois_a_3(endTimes['Victor'], endTimes['Tom'], endTimes['Marion']);
                isIn_annee = corespondance_annee_a_3(endTimes['Victor'], endTimes['Tom'], endTimes['Marion']);

            }
            if (Object.keys(endTimes).length === 2) {
                if (typeof endTimes['Marion'] == "undefined") {
                    isIn_semaine = corespondance_semaine_a_2(endTimes['Victor'], endTimes['Tom']);
                    isIn_mois = corespondance_mois_a_2(endTimes['Victor'], endTimes['Tom']);
                    isIn_annee = corespondance_annee_a_2(endTimes['Victor'], endTimes['Tom']);
                } else if (typeof endTimes['Tom'] == "undefined") {
                    isIn_semaine = corespondance_semaine_a_2(endTimes['Victor'], endTimes['Marion']);
                    isIn_mois = corespondance_mois_a_2(endTimes['Victor'], endTimes['Marion']);
                    isIn_annee = corespondance_annee_a_2(endTimes['Victor'], endTimes['Marion']);
                } else {
                    isIn_semaine = corespondance_semaine_a_2(endTimes['Marion'], endTimes['Tom']);
                    isIn_mois = corespondance_mois_a_2(endTimes['Marion'], endTimes['Tom']);
                    isIn_annee = corespondance_annee_a_2(endTimes['Marion'], endTimes['Tom']);
                }
            }

            if (isIn_semaine[0]) {
                for (var t = 0; t < isIn_semaine[1].length; t++) {
                    SEMAINES[isIn_semaine[1][t]][1].push(nodes[i]);
                }
            }
            if (isIn_mois[0]) {
                for (var t = 0; t < isIn_mois[1].length; t++) {
                    MOIS[isIn_mois[1][t]][1].push(nodes[i]);
                }
            }
            if (isIn_annee[0]) {
                for (var t = 0; t < isIn_annee[1].length; t++) {
                    ANNEE[isIn_annee[1][t]][1].push(nodes[i]);
                }
            }
        } else {
            PERSONNE.push(nodes[i])
        }
    }
    //console.log(SEMAINES)
    //console.log(MOIS)
    //console.log(ANNEE)
}

function calculate_number_month (currentDate) {
    return currentDate.getMonth();
}

function calculate_number_year (currentDate) {
    return currentDate.getFullYear();
}

function calculate_number_week(currentDate){
    var oneJan = new Date(currentDate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil((currentDate.getDay() +1 + numberOfDays) / 7)
    return result;
}


function corespondance_semaine_a_2 (data1, data2) {
    let res = [false,[]]
    for (var i = 0; i < data1.length; i ++) {
        let date1 = new Date(Date.parse(data1[i]));
        for (var j = 0; j < data2.length; j++) {
            let date2 = new Date(Date.parse(data2[j]));
            if (egale_semaine(date1,date2)) {
                res[0] = true;
                var we = calcul_range_semaine(date1)
                if(res[1].includes(we) === false) {res[1].push(we);}
            }
        }
    }
    return res;
}

function corespondance_mois_a_2 (data1, data2) {
    let res = [false,[]]
    for (var i = 0; i < data1.length; i ++) {
        let date1 = new Date(Date.parse(data1[i]));
        for (var j = 0; j < data2.length; j++) {
            let date2 = new Date(Date.parse(data2[j]));
            if (egale_mois(date1,date2)) {
                res[0] = true;
                var we = calcul_range_mois(date1)
                if(res[1].includes(we) === false) {res[1].push(we);}
            }
        }
    }
    return res;
}

function corespondance_annee_a_2 (data1, data2) {
    let res = [false,[]]
    for (var i = 0; i < data1.length; i ++) {
        let date1 = new Date(Date.parse(data1[i]));
        for (var j = 0; j < data2.length; j++) {
            let date2 = new Date(Date.parse(data2[j]));
            if (egale_annee(date1,date2)) {
                res[0] = true;
                var we = calcul_range_annee(date1)
                if(res[1].includes(we) === false) {res[1].push(we);}
            }
        }
    }
    return res;
}

function corespondance_semaine_a_3(data1,data2,data3){
    let res = [false,[]]
    for (var i = 0; i < data1.length; i ++) {
        let date1 = new Date(Date.parse(data1[i]));
        for (var j = 0; j < data2.length; j++) {
            let date2 = new Date(Date.parse(data2[j]));
            for (var t=0;t<data3.length;t++) {
                let date3 = new Date(Date.parse(data3[t]));
                if (egale_semaine(date1,date2)||egale_semaine(date1,date3)) {
                    res[0] = true;
                    var we = calcul_range_semaine(date1)
                    if(res[1].includes(we) === false) {res[1].push(we);}
                }
                if(egale_semaine(date2,date3)) {
                    res[0] = true;
                    var we = calcul_range_semaine(date2)
                    if(res[1].includes(we) === false) {res[1].push(we);}
                }
            }
        }
    }
    return res;
}

function corespondance_mois_a_3(data1,data2,data3){
    let res = [false,[]]
    for (var i = 0; i < data1.length; i ++) {
        let date1 = new Date(Date.parse(data1[i]));
        for (var j = 0; j < data2.length; j++) {
            let date2 = new Date(Date.parse(data2[j]));
            for (var t=0;t<data3.length;t++) {
                let date3 = new Date(Date.parse(data3[t]));
                if (egale_mois(date1,date2)||egale_mois(date1,date3)) {
                    res[0] = true;
                    var we = calcul_range_mois(date1)
                    if(res[1].includes(we) === false) {res[1].push(we);}
                }
                if(egale_mois(date2,date3)) {
                    res[0] = true;
                    var we = calcul_range_mois(date2)
                    if(res[1].includes(we) === false) {res[1].push(we);}
                }
            }
        }
    }
    return res;
}

function corespondance_annee_a_3(data1,data2,data3){
    let res = [false,[]]
    for (var i = 0; i < data1.length; i ++) {
        let date1 = new Date(Date.parse(data1[i]));
        for (var j = 0; j < data2.length; j++) {
            let date2 = new Date(Date.parse(data2[j]));
            for (var t=0;t<data3.length;t++) {
                let date3 = new Date(Date.parse(data3[t]));
                if (egale_annee(date1,date2)||egale_annee(date1,date3)) {
                    res[0] = true;
                    var we = calcul_range_annee(date1)
                    if(res[1].includes(we) === false) {res[1].push(we);}
                }
                if(egale_annee(date2,date3)) {
                    res[0] = true;
                    var we = calcul_range_annee(date2)
                    if(res[1].includes(we) === false) {res[1].push(we);}
                }
            }
        }
    }
    return res;
}

function egale_semaine(date1, date2){
    return ((calculate_number_week(date1) === calculate_number_week(date2))&&(date1.getFullYear() === date2.getFullYear()));
}

function egale_mois(date1, date2){
    return ((calculate_number_month(date1) === calculate_number_month(date2))&&(date1.getFullYear() === date2.getFullYear()));
}

function egale_annee(date1, date2){
    return ((date1.getFullYear() === date2.getFullYear()));
}

function calcul_range_semaine(date1) {
    if(date1.getFullYear() === 2020){
        return (calculate_number_week(date1) - premiere_semaine);
    } else {
        return (calculate_number_week(date1) + (53-premiere_semaine));
    }
}

function calcul_range_mois(date1) {
    if(date1.getFullYear() === 2020){
        return (calculate_number_month(date1) - premier_mois);
    } else {
        return (calculate_number_month(date1) + (12-premier_mois));
    }
}

function calcul_range_annee(date1) {
    return (calculate_number_year(date1) - premiere_annee);
}

function calcule_semaine(currente_date){
    var nb_we = calculate_number_week(currente_date)
    var debut = new Date(((nb_we-1)*7*24*60*60*1000)+new Date(currente_date.getFullYear(),0,1).getTime());
    var mois_debut= debut.getMonth() +1
    var fin = new Date(((nb_we)*7*24*60*60*1000)+new Date(currente_date.getFullYear(),0,1).getTime())
    var mois_fin= fin.getMonth() +1
    return "semaine n°" +nb_we+" : "+ debut.getDate()+"/"+mois_debut+"/"+debut.getFullYear() + " au " + fin.getDate() + "/" + mois_fin + "/" + fin.getFullYear()
}

