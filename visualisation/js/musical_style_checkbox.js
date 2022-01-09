

let filteredDataMock

let music_styles = ['pop', 'rock', 'rap', 'reggae', 'metal', 'lo-fi', 'jazz', 'funk', 'blues', 'variete']

let music_styles_card = document.getElementById("musical_style_card")

let checkbox_div = document.createElement("div")
checkbox_div.id = "checkbox_div"

music_styles_card.appendChild(checkbox_div)

let stylesToFilter = ['pop', 'rock', 'rap', 'reggae', 'metal', 'lo-fi', 'jazz', 'funk', 'blues', 'variete'];
let checkboxes = []


function eventCheckbox(_checkbox){

    if (_checkbox.checked) {
        stylesToFilter.push(_checkbox.value)
    }
    else{
        stylesToFilter = stylesToFilter.filter(item => item !== _checkbox.value)
    }

    sliderEvent()
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
    input.checked = true
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

    nodes = data.nodes
    links = data.links

    persons = nodes.slice(0, 3)

    nodes.shift()
    nodes.shift()
    nodes.shift()

    filteredNodes = nodes.filter(music => stylesToFilter.some(val => music.genres.includes(val)))

    console.log("Input links for styles filter : ")
    console.log(links)


    filteredLinks = links.filter(link => filteredNodes.some(val => link["target"]["id"] === val.id))

    console.log("filteredLinks")

    console.log(filteredLinks)

    data.nodes = persons.concat(filteredNodes)
    data.links = filteredLinks

    return data
}