let dataMock = [{
    "endTime": "2021-01-05 11:28",
    "artistName": "Lorenzo",
    "trackName": "Tu le C",
    "msPlayed": 53393,
    "genre": ["Pop", "Rap"],
    "country": "France",
    "listener": "Tom"
}, {
    "endTime": "2021-01-05 11:28",
    "artistName": "Lorenzo",
    "trackName": "Tu le C",
    "msPlayed": 53393,
    "genre": ["Rock", "Pop"],
    "country": "France",
    "listener": "Tom"
}, {
    "endTime": "2021-01-05 11:28",
    "artistName": "Lorenzo",
    "trackName": "Tu le C",
    "msPlayed": 53393,
    "genre": ["Pop"],
    "country": "France",
    "listener": "Tom"
}, {
    "endTime": "2021-01-05 11:28",
    "artistName": "Lorenzo",
    "trackName": "Tu le C",
    "msPlayed": 53393,
    "genre": ["Rap"],
    "country": "France",
    "listener": "Tom"
}, {
    "endTime": "2021-01-05 11:28",
    "artistName": "Lorenzo",
    "trackName": "Tu le C",
    "msPlayed": 53393,
    "genre": ["Pop", "Rap"],
    "country": "France",
    "listener": "Tom"
}
]

let filteredDataMock

let music_styles = ['pop', 'rock', 'rap', 'reggae', 'metal', 'lo-fi', 'jazz', 'funk', 'blues', 'variete']

let music_styles_card = document.getElementById("musical_style_card")

let checkbox_div = document.createElement("div")
checkbox_div.id = "checkbox_div"

music_styles_card.appendChild(checkbox_div)

let stylesToFilter = [];
let checkboxes = []


function eventCheckbox(_checkbox){


    if (_checkbox.checked) {
        stylesToFilter.push(_checkbox.value)
    }
    else{
        stylesToFilter = stylesToFilter.filter(item => item !== _checkbox.value)
    }
    filteredDataMock = filterMusicStyle(dataMock,stylesToFilter)

    console.log("Checkbox event")
    console.log(stylesToFilter)
    console.log(filteredDataMock)
}

for (let style of music_styles) {
    let form_check = document.createElement("div")
    form_check.className = "form-check"

    let input = document.createElement("input")
    input.className = "form-check-input"
    input.type = "checkbox"
    input.name = "flexRadioDefault"
    input.id = "flexRadio" + style
    input.value = style
    input.setAttribute("onchange", "eventCheckbox(this)");

    let label = document.createElement("label")
    label.className = "form-check-label"
    label.innerHTML = style
    label.htmlFor = input.id

    checkbox_div.appendChild(form_check)

    checkboxes.push(input)

    form_check.appendChild(input)
    form_check.appendChild(label)

}



function filterMusicStyle(data,stylesToFilter) {
    return data.filter(music => stylesToFilter.some(val => music.genre.includes(val)))
}
