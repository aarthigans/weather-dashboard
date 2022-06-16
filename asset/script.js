//variable declaration

let world_cities = []
let saved_cities = []
const api_key = 'db2e0817e0753a4bbbaf3164c30e16ba'
const date = moment().format('ddd, DD/MM/YYYY')

//Remove city from Saved items
function remove_city(id) {
    for (let i in saved_cities) {
        if (saved_cities[i].id == id) {
            saved_cities.splice(i, 1)
        }
        localStorage.setItem('saved_cities', JSON.stringify(saved_cities))
    }
}



// Add the city into saved items if not found in th existing list
function save_new_city(id) {
    let found = false
    id = parseInt(id)
    let new_saved_city = {
        id: id,
        City: world_cities[id].City,
        Lng: world_cities[id].Lng,
        Lat: world_cities[id].Lat,
        Country: world_cities[id].Country
    }
    for (city of saved_cities) {
        if (city.id == new_saved_city.id) {
            found = true
        }
    }
    if (!found) {
        saved_cities.push(new_saved_city)
        localStorage.setItem('saved_cities', JSON.stringify(saved_cities))
        let new_row = $(`<tr id=row_${new_saved_city.id}></tr>`)
        let new_data = $(`<td class="text-center">${new_saved_city.City},${new_saved_city.Country}</td>`)
        new_row.append(new_data)
        $('tbody').append(new_row)
    }
}